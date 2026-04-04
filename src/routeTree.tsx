import { createRootRoute, createRoute } from '@tanstack/react-router'
import { HomePage } from './components/HomePage'
import { VideoPage } from './components/VideoPage'

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
})

export const routeTree = rootRoute.addChildren([indexRoute, videoRoute])
