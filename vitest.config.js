import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: {
      TZ: 'Europe/London',
    },
    watch: false,
    typecheck: {
      enabled: true,
    },
  },
});
