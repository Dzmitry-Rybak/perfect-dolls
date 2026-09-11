import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
    // host: true — слушать все интерфейсы, а не только localhost.
    // Без этого сайт виден только с самого Mac: на телефоне localhost
    // означает сам телефон. Нужно для проверки на реальном устройстве.
    host: true,
  },
})
