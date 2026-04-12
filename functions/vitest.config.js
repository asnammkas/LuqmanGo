import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['__tests__/**/*.test.js'],
  },
  resolve: {
    alias: {
      '../index': path.resolve(import.meta.dirname, './index.js'),
    },
  },
});
