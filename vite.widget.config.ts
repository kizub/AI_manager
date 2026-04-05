import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    build: {
      lib: {
        entry: path.resolve(__dirname, 'apps/widget/src/bootstrap/index.tsx'),
        name: 'AIWidget',
        fileName: () => 'widget.js',
        formats: ['iife'] as any,
      },
      outDir: 'dist/widget',
      emptyOutDir: true,
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './apps/dashboard/src'),
      },
    },
  };
});
