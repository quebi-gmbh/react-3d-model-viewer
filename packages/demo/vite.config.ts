import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Using custom domain, so no base path needed
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      // Alias the workspace package to its source during development
      'react-3d-model-viewer/core': resolve(__dirname, '../viewer/src/core/index.ts'),
      'react-3d-model-viewer/controls': resolve(__dirname, '../viewer/src/controls/index.ts'),
      'react-3d-model-viewer/utils': resolve(__dirname, '../viewer/src/utils/index.ts'),
      'react-3d-model-viewer/ui': resolve(__dirname, '../viewer/src/ui/index.ts'),
      'react-3d-model-viewer/types': resolve(__dirname, '../viewer/src/types/index.ts'),
      'react-3d-model-viewer': resolve(__dirname, '../viewer/src/index.ts'),
    },
  },
}));
