import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ['**/node_modules/**', '**/*.smoke.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
    },
  },
})
