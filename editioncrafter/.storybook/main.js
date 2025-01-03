/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@chromatic-com/storybook',
  ],
  docs: {},
  core: {
    builder: '@storybook/builder-vite',
  },
  framework: {
    name: '@storybook/react-vite',
  },

  staticDirs: ['../static'],

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  async viteFinal(config) {
    // Merge custom configuration into the default config
    const { mergeConfig, transformWithEsbuild } = await import('vite')

    return mergeConfig(config, {
      plugins: [
        {
          name: 'treat-js-files-as-jsx',
          async transform(code, id) {
            if (!id.match(/src\/.*\.js$/))
              return null

            // Use the exposed transform from vite, instead of directly
            // transforming with esbuild
            return transformWithEsbuild(code, id, {
              loader: 'jsx',
              jsx: 'automatic',
            })
          },
        },
      ],
    })
  },
}
export default config
