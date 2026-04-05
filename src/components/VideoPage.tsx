import { useEffect } from 'react'
import { getRouteApi, Link } from '@tanstack/react-router'
import { applyPageSeo, buildVideoJsonLd, excerptDescription } from '../lib/seo'
import { SummaryPage } from './SummaryPage'

const videoRouteApi = getRouteApi('/$videoId')

export function VideoPage() {
  const { videos, summaryMarkdown, loadError } = videoRouteApi.useLoaderData()
  const { videoId } = videoRouteApi.useParams()
  const selected = videos.find((x) => x.id === videoId)

  useEffect(() => {
    if (!selected) return
    const thumb = selected.thumbnailUrl?.trim() || `https://i.ytimg.com/vi/${selected.id}/hqdefault.jpg`
    applyPageSeo({
      title: selected.title,
      description: excerptDescription(selected.description ?? `Summary of Theo's video: ${selected.title}`),
      path: `/${selected.id}`,
      imageUrl: thumb,
      ogType: 'article',
      jsonLd: buildVideoJsonLd(selected, thumb),
    })
  }, [selected])

  return (
    <div className="text-neutral-100">
      <nav className="border-b border-neutral-800 bg-neutral-950/80 px-5 py-3 backdrop-blur">
        <Link className="text-sm font-semibold text-blue-400 hover:underline" to="/">
          ← All videos
        </Link>
      </nav>
      <SummaryPage
        loading={false}
        loadError={loadError}
        videoTitle={selected?.title ?? ''}
        videoDescription={selected?.description ?? ''}
        summaryMarkdown={summaryMarkdown}
      />
    </div>
  )
}