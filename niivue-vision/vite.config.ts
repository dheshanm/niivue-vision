import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.',
  base: '/',
  server: {
    open: 'index.html',
    host: '0.0.0.0',
    port: 5000,
  },
  preview: {
    open: false, // Prevents Vite from opening the browser
  }
})