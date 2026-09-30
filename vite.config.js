import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Базовый путь. На GitHub Pages сайт живёт в подпапке /goroda-reki-final/,
// при переезде на свой домен достаточно задать BASE_PATH=/ (или переменную окружения).
const BASE = process.env.BASE_PATH || '/goroda-reki-final/'

export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : BASE,
  plugins: [react()],
  server: { host: '0.0.0.0', port: 5173, strictPort: false },
  preview: { host: '0.0.0.0', port: 4173 },
  build: {
    target: 'es2019',
    cssCodeSplit: false,
    assetsInlineLimit: 2048,
    reportCompressedSize: true
  }
}))
