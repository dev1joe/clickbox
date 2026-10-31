import { defineConfig } from "vitest/config";
import { loadEnv } from "vite"

export default defineConfig(({ mode }) => ({
  test: {
    env: loadEnv(mode, process.cwd(), ''),
    exclude: ['**/node_modules/**', '**/*.smoke.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
    },
  },
}));
