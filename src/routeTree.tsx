import { lazy, Suspense } from 'react'
import { createRootRoute, createRoute, redirect } from '@tanstack/react-router'
import { HomePage } from './components/HomePage'
import { assetUrl } from './lib/paths'
import { loadVideos } from './lib/videos'

const VideoPage = lazy(() =>
  import('./components/VideoPage').then((m) => ({ default: m.VideoPage })),
)

function LoadingShell() {
  return (<></>)
}

const rootRoute = createRootRoute()

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const videoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$videoId',
  component: () => (
    <Suspense fallback={<LoadingShell />}>
      <VideoPage />
    </Suspense>
  ),
  pendingComponent: LoadingShell,
  loader: async ({ params }) => {
    const videoId = params.videoId
    const [videos, mdRes] = await Promise.all([
      loadVideos(),
      fetch(assetUrl(`videos/${videoId}.md`)),
    ])
    const exists = videos.some((v) => v.id === videoId)
    if (!exists) throw redirect({ to: '/', replace: true })
    if (!mdRes.ok) {
      return { videos, summaryMarkdown: null as string | null, loadError: true as const }
    }
    const summaryMarkdown = await mdRes.text()
    return { videos, summaryMarkdown, loadError: false as const }
  },
})

export const routeTree = rootRoute.addChildren([indexRoute, videoRoute])
