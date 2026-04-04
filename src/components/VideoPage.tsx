import { useEffect, useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { SummaryPage } from './SummaryPage'
import type { Video } from '../types/video'
import { assetUrl } from '../lib/paths'
import { loadVideos } from '../lib/videos'

type DetailState = { error: true } | string | null

export function VideoPage() {
  const { videoId } = useParams({ from: '/$videoId' })
  const [videos, setVideos] = useState<Video[]>([])
  const [detail, setDetail] = useState<DetailState>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    loadVideos()
      .then(setVideos)
      .catch(() => {})
  }, [])

  useEffect(() => {
    setDetail(null)
    setDetailLoading(true)
    fetch(assetUrl(`videos/${videoId}.md`))
      .then((r) => {
        if (!r.ok) throw new Error('Summary not found')
        return r.text()
      })
      .then(setDetail)
      .catch(() => setDetail({ error: true }))
      .finally(() => setDetailLoading(false))
  }, [videoId])

  const selectedTitle = videos.find((x) => x.id === videoId)?.title ?? ''

  return (
    <div className="text-neutral-100">
      <nav className="border-b border-neutral-800 bg-neutral-950/80 px-5 py-3 backdrop-blur">
        <Link className="text-sm font-semibold text-blue-400 hover:underline" to="/">
          ← All videos
        </Link>
      </nav>
      <SummaryPage
        loading={detailLoading}
        loadError={Boolean(detail && typeof detail === 'object' && 'error' in detail)}
        videoTitle={selectedTitle}
        summaryMarkdown={typeof detail === 'string' ? detail : null}
      />
    </div>
  )
}