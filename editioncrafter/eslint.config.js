// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  astro: true,
  react: true,
  ignores: [
    'dist/',
    'config/',
    'coverage/',
    'styles/',
  ],
})
