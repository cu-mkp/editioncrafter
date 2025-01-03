import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, transformWithEsbuild } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
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
  loader: { '.js': 'jsx' },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.jsx'),
      name: 'EditionCrafter',
      fileName: 'editioncrafter',
      formats: ['es'],
    },
    assetsInlineLimit: 999999999999,
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
        },
        manualChunks: undefined,
      },
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /.*\.jsx?$/,
    exclude: [],

  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})
