import { createRouter, Navigate } from '@tanstack/react-router'
import { routeTree } from './routeTree'
import { getRouterBasepath } from './lib/paths'

export const router = createRouter({
  routeTree,
  basepath: getRouterBasepath(),
  defaultNotFoundComponent: () => <Navigate to="/" replace />,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
