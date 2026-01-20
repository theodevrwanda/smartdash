import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'smartstock.png', 'pwa-icon.png'],
      manifest: {
        name: 'SmartDash Administrative Center',
        short_name: 'SmartDash',
        description: 'Advanced Administrative Infrastructure for the SmartStock Ecosystem',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'smartstock.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'smartstock.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
