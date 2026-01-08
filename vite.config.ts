import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: '.',
        },
      ],
    }),
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        newtab: resolve(__dirname, 'src/presentation/newtab/index.html'),
        options: resolve(__dirname, 'src/presentation/options/index.html'),
        'service-worker': resolve(__dirname, 'src/infrastructure/background/service-worker.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'service-worker') {
            return 'service-worker.js';
          }
          return 'assets/[name].js';
        },
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'index.html') {
            return '[name].[ext]';
          }
          return 'assets/[name].[ext]';
        },
      },
    },
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/domain': resolve(__dirname, './src/domain'),
      '@/application': resolve(__dirname, './src/application'),
      '@/infrastructure': resolve(__dirname, './src/infrastructure'),
      '@/presentation': resolve(__dirname, './src/presentation'),
    },
  },
});

