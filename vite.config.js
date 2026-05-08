import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'ClinIQ — NEET PG Prep',
        short_name: 'ClinIQ',
        description: 'Gamified NEET PG exam preparation',
        theme_color: '#0E0D0B',
        background_color: '#0E0D0B',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ],
        apple_mobile_web_app_capable: 'yes',
        apple_mobile_web_app_status_bar_style: 'black-translucent'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60*60*24*365 } }
          },
          {
            urlPattern: /^https:\/\/vtrckjghmpxzyjouduwt\.supabase\.co\/rest\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'supabase-questions-cache', expiration: { maxEntries: 5, maxAgeSeconds: 60*60*24 } }
          }
        ]
      }
    })
  ]
})
