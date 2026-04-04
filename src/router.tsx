import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree'
import { NotFoundPage } from './components/NotFoundPage'
import { getRouterBasepath } from './lib/paths'

export const router = createRouter({
  routeTree,
  basepath: getRouterBasepath(),
  defaultNotFoundComponent: NotFoundPage,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
