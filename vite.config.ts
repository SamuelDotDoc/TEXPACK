import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite acesso de qualquer host (incluindo ngrok)
    port: 5173,
    strictPort: true,
    allowedHosts: ['.ngrok-free.app', '.ngrok.io'], // Permite apenas hosts do ngrok
    hmr: {
      clientPort: 5173
    }
  }
})

