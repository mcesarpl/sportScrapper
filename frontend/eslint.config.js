import js from '@eslint/js'
import react from 'eslint-plugin-react'
import globals from 'globals'

export default [
  { ignores: ['coverage/', 'dist/'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    plugins: { react },
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      complexity: ['error', 8],
      'max-lines-per-function': ['error', 25],
      'react/jsx-uses-vars': 'error',
    },
  },
  {
    files: ['**/*.test.jsx'],
    languageOptions: { globals: globals.vitest },
    rules: { 'max-lines-per-function': 'off' },
  },
]
