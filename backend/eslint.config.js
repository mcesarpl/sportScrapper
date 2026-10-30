import js from '@eslint/js'
import globals from 'globals'

export default [
  { ignores: ['coverage/'] },
  js.configs.recommended,
  {
    languageOptions: { globals: globals.node },
    rules: {
      complexity: ['error', 8],
      'max-lines-per-function': ['error', 25],
    },
  },
  {
    files: ['**/*.test.js'],
    rules: { 'max-lines-per-function': 'off' },
  },
]
