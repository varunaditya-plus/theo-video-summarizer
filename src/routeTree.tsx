import { createRootRoute, createRoute, redirect } from '@tanstack/react-router'
import { HomePage } from './components/HomePage'
import { VideoPage } from './components/VideoPage'
import { loadVideos } from './lib/videos'

const rootRoute = createRootRoute()

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const videoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$videoId',
  component: VideoPage,
  loader: async ({ params }) => {
    const videos = await loadVideos()
    const exists = videos.some((v) => v.id === params.videoId)
    if (!exists) throw redirect({ to: '/', replace: true })
  },
})

export const routeTree = rootRoute.addChildren([indexRoute, videoRoute])
