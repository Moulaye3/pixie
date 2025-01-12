import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import type { UserConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('pixi.js')) return 'pixi'
            if (id.includes('react')) return 'react'
            if (id.includes('gsap')) return 'gsap'
            return 'vendor'
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    cssCodeSplit: true,
    reportCompressedSize: false,
  },
} as UserConfig)
