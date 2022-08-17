import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
  resolve: {
    alias: [
      { find: '@hooks', replacement: path.resolve(__dirname, 'src/hooks') },
      { find: '@components', replacement: path.resolve(__dirname, 'src/components') },
      { find: '@layouts', replacement: path.resolve(__dirname, 'src/layouts') },
      { find: '@pages', replacement: path.resolve(__dirname, 'src/pages') },
      { find: '@utils', replacement: path.resolve(__dirname, 'src/utils') },
      { find: '@typings', replacement: path.resolve(__dirname, 'src/typings') },
    ],
  },
  server: {
    // https: true,
    // port: 3000,
    proxy: {
      '/api': 'http://localhost:5173',
    },
  },
});
