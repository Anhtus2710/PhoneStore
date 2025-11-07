import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // bật hỗ trợ Tailwind CSS
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // trỏ API về backend Node.js
        changeOrigin: true, // tránh lỗi CORS
        secure: false, // cho phép http
      },
    },
  },
})
