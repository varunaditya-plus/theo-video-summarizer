import { assetUrl } from './paths'

export type Sponsor = {
  href: string
  img: string
  h3: string
  p: string
  color?: string
  glow?: string
}

export function sanitizeSponsorSvgMarkup(html: string): string {
  const s = html.trim()
  const i = s.toLowerCase().indexOf('<svg')
  if (i > 0) return s.slice(i)
  return s
}

let cache: Sponsor[] | null = null

export async function loadSponsors(): Promise<Sponsor[]> {
  if (cache) return cache
  
  const r = await fetch(assetUrl('sponsors.json'))
  if (!r.ok) throw new Error(`Couldn't load sponsors (${r.status})`)
  const data: unknown = await r.json()
  cache = Array.isArray(data) ? (data as Sponsor[]) : []
  return cache
}

function normalizeSoydevUrl(u: string): string {
  const cleaned = u.trim().replace(/[.,;:!?)]+$/, '')
  try {
    const url = new URL(cleaned)
    if (url.hostname.toLowerCase() !== 'soydev.link') return cleaned.toLowerCase()
    const path = url.pathname.replace(/\/$/, '') || '/'
    return `${url.origin}${path}`.toLowerCase()
  } catch {
    return cleaned.toLowerCase()
  }
}

export function sponsorsFromDescription(description: string, catalog: Sponsor[]): Sponsor[] {
  const byHref = new Map(catalog.map((s) => [normalizeSoydevUrl(s.href), s]))
  const out: Sponsor[] = []
  const seen = new Set<string>()
  for (const m of description.matchAll(/https:\/\/soydev\.link\/[^\s\)\]\"'<>]+/gi)) {
    const norm = normalizeSoydevUrl(m[0])
    if (seen.has(norm)) continue

    const sp = byHref.get(norm)
    if (!sp) continue
    seen.add(norm)
    out.push(sp)
  }
  return out
}