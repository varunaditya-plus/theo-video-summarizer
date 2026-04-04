const BASE = import.meta.env.BASE_URL

export function getRouterBasepath(): string {
  const trimmed = BASE.replace(/\/$/, '')
  return trimmed === '' ? '/' : trimmed
}

export function assetUrl(path: string): string {
  const p = path.replace(/^\//, '')
  return `${BASE}${p}`
}