import { getRouteApi, Link } from '@tanstack/react-router'
import { SummaryPage } from './SummaryPage'

const videoRouteApi = getRouteApi('/$videoId')

export function VideoPage() {
  const { videos, summaryMarkdown, loadError } = videoRouteApi.useLoaderData()
  const { videoId } = videoRouteApi.useParams()
  const selected = videos.find((x) => x.id === videoId)

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