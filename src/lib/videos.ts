import type { Video } from '../types/video'
import { assetUrl } from './paths'

let cache: Video[] | null = null

export async function loadVideos(): Promise<Video[]> {
  if (cache) return cache
  const r = await fetch(assetUrl('videos.json'))
  if (!r.ok) throw new Error(`Couldn't load videos (${r.status})`)
  const data: unknown = await r.json()
  cache = Array.isArray(data) ? (data as Video[]) : []
  return cache
}