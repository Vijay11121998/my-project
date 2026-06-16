import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Served from https://<user>.github.io/my-project/ on GitHub Pages.
  base: '/my-project/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
})
