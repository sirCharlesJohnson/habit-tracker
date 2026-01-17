import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React dependencies
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Animation
          'motion-vendor': ['framer-motion'],
          // Icons
          'icons-vendor': ['lucide-react'],
          // Data visualization
          'chart-vendor': ['recharts'],
          // Date utilities
          'date-vendor': ['date-fns'],
          // State management and forms
          'state-vendor': ['zustand', 'react-hook-form', '@hookform/resolvers', 'zod'],
        },
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon.svg'],
      manifest: {
        name: 'Habit Tracker',
        short_name: 'Habits',
        description: 'Track your daily habits and build better routines',
        theme_color: '#0284c7',
        background_color: '#f9fafb',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
})
