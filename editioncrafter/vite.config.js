import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, transformWithEsbuild } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
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
      entry: resolve(__dirname, 'src/index.js'),
      name: 'EditionCrafter',
      fileName: 'editioncrafter',
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
