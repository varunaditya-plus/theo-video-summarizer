import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs'
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

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** Emits `dist/sitemap.xml` and overwrites `dist/robots.txt` when `VITE_SITE_URL` is set (canonical origin for SEO). */
function sitemapAndRobots() {
  let base = '/'
  return {
    name: 'seo-sitemap-robots',
    configResolved(resolved: { base: string }) {
      base = resolved.base
    },
    closeBundle() {
      const siteUrl = process.env.VITE_SITE_URL?.trim().replace(/\/$/, '')
      if (!siteUrl) return

      const videosPath = resolve('public/videos.json')
      const videos = JSON.parse(readFileSync(videosPath, 'utf-8')) as { id: string }[]
      const root = new URL(base, `${siteUrl}/`)
      const loc = (path: string) => (path === '/' || path === '' ? root.href : new URL(path.replace(/^\//, ''), root).href)

      const urls: { loc: string; changefreq: string; priority: string }[] = [
        { loc: loc('/'), changefreq: 'weekly', priority: '1.0' },
        ...videos.map((v) => ({
          loc: loc(`/${v.id}`),
          changefreq: 'monthly',
          priority: '0.8',
        })),
      ]

      const body = urls
        .map(
          (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
        )
        .join('\n')

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`
      const out = resolve('dist')
      writeFileSync(resolve(out, 'sitemap.xml'), xml)

      const sitemapHref = new URL('sitemap.xml', root).href
      const robots = `User-agent: *
Allow: /

Sitemap: ${sitemapHref}
`
      writeFileSync(resolve(out, 'robots.txt'), robots)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  appType: 'spa',
  plugins: [react(), tailwindcss(), notFound(), sitemapAndRobots()],
  build: {
    chunkSizeWarningLimit: 1600,
  },
})
