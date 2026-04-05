import type { Video } from '../types/video'
import { canonicalUrl } from './site'

const SITE_NAME = 'Theo video summaries'
const DEFAULT_DESCRIPTION = 'Fast, readable summaries of Theo (t3.gg) tech videos—open source. Skim the takeaways without watching full videos.'

type SeoOptions = {
  title: string
  description?: string
  path: string
  /** Absolute URL for og:image / twitter:image */
  imageUrl?: string | null
  ogType?: 'website' | 'article'
  jsonLd?: Record<string, unknown> | null
}

function setMetaName(name: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setMetaProperty(property: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string | null) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!href) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function setJsonLd(id: string, data: Record<string, unknown> | null) {
  const existing = document.head.querySelector(`script[data-seo-jsonld="${id}"]`)
  existing?.remove()
  if (!data) return
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.setAttribute('data-seo-jsonld', id)
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

export function applyPageSeo(opts: SeoOptions) {
  const description = (opts.description ?? DEFAULT_DESCRIPTION).slice(0, 320)
  const fullTitle =
    opts.path === '/' || opts.path === ''
      ? `${SITE_NAME} — Theo (t3.gg) tech, summarized`
      : `${opts.title} | ${SITE_NAME}`

  document.title = fullTitle
  setMetaName('description', description)
  setMetaName('robots', 'index, follow')

  const url = canonicalUrl(opts.path === '' ? '/' : opts.path)
  setCanonical(url)

  const ogImage = opts.imageUrl?.trim() || undefined

  setMetaProperty('og:site_name', SITE_NAME)
  setMetaProperty('og:title', fullTitle)
  setMetaProperty('og:description', description)
  setMetaProperty('og:type', opts.ogType ?? 'website')
  if (url) setMetaProperty('og:url', url)
  if (ogImage) setMetaProperty('og:image', ogImage)

  setMetaName('twitter:card', ogImage ? 'summary_large_image' : 'summary')
  setMetaName('twitter:title', fullTitle)
  setMetaName('twitter:description', description)
  if (ogImage) setMetaName('twitter:image', ogImage)

  setJsonLd('page', opts.jsonLd ?? null)
}

export function buildHomeJsonLd(videos: Video[]): Record<string, unknown> | null {
  const site = canonicalUrl('/')
  if (!site) return null

  const website: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: site,
  }

  const itemList: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: videos.map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: canonicalUrl(`/${v.id}`),
      name: v.title,
    })),
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [website, itemList],
  }
}

export function buildVideoJsonLd(video: Video, thumbnailUrl: string): Record<string, unknown> | null {
  const pageUrl = canonicalUrl(`/${video.id}`)
  if (!pageUrl) return null

  const desc = video.description?.replace(/\s+/g, ' ').trim().slice(0, 5000) ?? ''

  const videoObject: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: desc || `Summary of: ${video.title}`,
    thumbnailUrl,
    url: pageUrl,
  }

  if (video.publishedAt) {
    videoObject.uploadDate = video.publishedAt
  }

  return videoObject
}

export function excerptDescription(raw: string, maxLen = 155): string {
  const oneLine = raw.replace(/\s+/g, ' ').trim()
  if (oneLine.length <= maxLen) return oneLine
  return `${oneLine.slice(0, maxLen - 1).trim()}…`
}
