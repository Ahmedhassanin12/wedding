/// <reference types="vitest/config" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    base: './',
    publicDir: false,
    plugins: [
        react(),
        {
            name: 'undangan-dev-html',
            apply: 'serve',
            transformIndexHtml(html) {
                return html.replace('./dist/guest.js', '/src/guest.tsx');
            },
        },
    ],
    server: {
        port: 8080,
    },
    preview: {
        port: 8080,
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                guest: resolve(import.meta.dirname, 'src/guest.tsx'),
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: 'chunks/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash][extname]',
            },
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        include: ['src/test/**/*.test.{ts,tsx}'],
    },
});
