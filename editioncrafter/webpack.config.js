const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

/** */
const baseConfig = mode => ({
  entry: ['./src/scss/editioncrafter.scss', './src/index.js'],
  module: {
    rules: [
      {
        include: path.resolve(fs.realpathSync(process.cwd()), '.'), // CRL
        test: /\.css$/i,
        use: [
          require.resolve('style-loader'),
          require.resolve('css-loader'),
        ],
      },
      {
        include: path.resolve(fs.realpathSync(process.cwd()), '.'), // CRL
        test: /\.s[ac]ss$/i,
        use: [
          require.resolve('style-loader'),
          require.resolve('css-loader'),
          require.resolve('sass-loader'),
        ],
      },
      {
        include: path.resolve(fs.realpathSync(process.cwd()), '.'), // CRL
        loader: require.resolve('babel-loader'),
        options: {
          // Save disk space when time isn't as important
          cacheCompression: true,
          cacheDirectory: true,
          compact: true,
          envName: mode,
        },
        test: /\.(js|mjs|jsx)$/,
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/inline',
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: true,
      }),
    ],
  },
  output: {
    filename: 'editioncrafter.min.js',
    hashFunction: 'md5',
    library: 'EditionCrafter',
    libraryExport: 'default',
    libraryTarget: 'umd',
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /@blueprintjs\/(core|icons)/, // ignore optional UI framework dependencies
    }),
  ],
  resolve: {
    alias: {
      // needs shared global state for context to work
      'react-dnd': path.resolve(path.join(__dirname, 'node_modules', 'react-dnd')),
    },
    extensions: ['.js'],
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React',
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'ReactDOM',
      root: 'ReactDOM',
    },
  },
});

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';
  const config = baseConfig(options.mode);

  if (isProduction) {
    return {
      ...config,
      mode: 'production',
      plugins: [
        ...(config.plugins || []),
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 1,
        }),
      ],
    };
  }

  return {
    ...config,
    devtool: 'source-map',
    mode: 'development',
    plugins: [
      ...(config.plugins || []),
    ],
  };
};
