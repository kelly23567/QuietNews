import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages base path MUST match the repository name EXACTLY (case-sensitive)
  base: '/QuietNews/', 
})
