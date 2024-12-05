import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import replace from '@rollup/plugin-replace'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    replace({
      'process.env': 'import.meta.env',
      preventAssignment: true
    })
  ],
  loader: { '.js': 'jsx' },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'EditionCrafter',
      fileName: 'editioncrafter',
      formats: ['umd']
    }
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
  define: {
    'process.env': {}
  }
})
