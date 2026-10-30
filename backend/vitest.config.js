import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['*.js'],
      exclude: ['*.config.js'],
      thresholds: { lines: 90, branches: 90 },
    },
  },
})
