import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

function notFound() {
  return {
    name: 'spa-404',
    closeBundle() {
      const out = resolve('dist')
      copyFileSync(`${out}/index.html`, `${out}/404.html`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  appType: 'spa',
  plugins: [react(), tailwindcss(), notFound()],
})
