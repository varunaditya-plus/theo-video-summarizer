import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { Video } from '../types/video'
import { applyPageSeo, buildHomeJsonLd } from '../lib/seo'
import { loadVideos } from '../lib/videos'

export function HomePage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadVideos()
      .then(setVideos)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (loading || error) return
    applyPageSeo({
      title: 'Theo video summaries',
      path: '/',
      jsonLd: buildHomeJsonLd(videos),
    })
  }, [loading, error, videos])

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-8 text-neutral-500">
        <p>Loading…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-8">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 pb-16 text-neutral-100">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Theo video summaries</h1>
        <p className="mt-1 text-neutral-400">
          A better way to know what's going on in tech. This site summarizes a bunch of Theo's videos (with sponsors because making a video about this doesn't pay the bills) so you know what's going on quickly. <b>The content on this site is produced by AI</b>. Also, this site is open source at <a href="https://github.com/varunaditya-plus/theo-video-summarizer" className="text-neutral-300 hover:text-white underline">github.com/varunaditya-plus/theo-video-summarizer</a>.
        </p>
      </header>

      {videos.length === 0 ? (
        <p className="max-w-md text-neutral-400">None yet</p>
      ) : (
        <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 md:grid-cols-4">
          {videos.map((v) => (
            <li key={v.id}>
              <Link to={`/${v.id}`} preload="intent" className="flex w-full cursor-pointer flex-col overflow-hidden border border-neutral-800 bg-neutral-900 text-left transition hover:border-neutral-700">
                <img className="aspect-video w-full bg-neutral-900 object-cover" src={v.thumbnailUrl || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt={v.title} loading="lazy" decoding="async" />
                <span className="p-2.5 text-xs font-semibold leading-snug">{v.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}