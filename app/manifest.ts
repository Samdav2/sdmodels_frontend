import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SDModels - Premium 3D Marketplace',
    short_name: 'SDModels',
    description: 'Buy, sell, and preview premium 3D models in real-time. Created by Dawodu David Imole (SD), a 3D artist from Linar Academy.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#ff6b35',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['shopping', 'productivity', 'business'],
    shortcuts: [
      {
        name: 'Browse Models',
        short_name: 'Browse',
        description: 'Browse 3D models marketplace',
        url: '/marketplace',
        icons: [{ src: '/icon-96x96.png', sizes: '96x96' }],
      },
      {
        name: 'Start Selling',
        short_name: 'Sell',
        description: 'Upload and sell your 3D models',
        url: '/upload',
        icons: [{ src: '/icon-96x96.png', sizes: '96x96' }],
      },
    ],
  }
}
