export function getSiteUrl(): string | null {
  const raw = import.meta.env.VITE_SITE_URL?.trim()
  if (!raw) return null
  return raw.replace(/\/$/, '')
}

export function canonicalUrl(path: string): string | null {
  const site = getSiteUrl()
  if (!site) return null
  const root = new URL(import.meta.env.BASE_URL, site.endsWith('/') ? site : `${site}/`)
  if (path === '/' || path === '') return root.href
  return new URL(path.replace(/^\//, ''), root).href
}
