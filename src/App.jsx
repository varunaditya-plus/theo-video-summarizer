import { useCallback, useEffect, useState } from 'react'
import { SummaryPage } from './components/SummaryPage'

const BASE = import.meta.env.BASE_URL
const BASE_PREFIX = BASE.replace(/\/$/, '')

function homePath() { return BASE }
function videoPath(id) { return `${BASE_PREFIX}/${id}` }
function getPathSegments(pathname) {
  const p = BASE_PREFIX && pathname.startsWith(BASE_PREFIX) ? pathname.slice(BASE_PREFIX.length) || '/' : pathname
  return p.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)
}

export default function App() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pathname, setPathname] = useState(() => window.location.pathname)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const navigate = useCallback((path) => {
    window.history.pushState(null, '', path)
    setPathname(window.location.pathname)
  }, [])

  useEffect(() => {
    const onPop = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    fetch('/videos.json')
      .then((r) => {
        if (!r.ok) throw new Error(`Couldn't load videos (${r.status})`)
        return r.json()
      })
      .then((data) => setVideos(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const segments = getPathSegments(pathname)
  const routeVideoId = segments.length === 1 ? segments[0] : null
  const isNotFound = segments.length > 1

  useEffect(() => {
    if (!routeVideoId) {
      setDetail(null)
      setDetailLoading(false)
      return
    }
    setDetail(null)
    setDetailLoading(true)
    fetch(`/videos/${routeVideoId}.json`)
      .then((r) => {
        if (!r.ok) throw new Error('Summary not found')
        return r.json()
      })
      .then(setDetail)
      .catch(() => setDetail({ error: true }))
      .finally(() => setDetailLoading(false))
  }, [routeVideoId])

  const selectedTitle = videos.find((x) => x.id === routeVideoId)?.title ?? ''

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

  if (isNotFound) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-8 text-neutral-100">
        <p className="mb-4">This page does not exist.</p>
        <a className="font-semibold text-blue-400 hover:underline" href={homePath()} onClick={(e) => { e.preventDefault(); navigate(homePath()) }}>
          ← All videos
        </a>
      </div>
    )
  }

  if (routeVideoId) {
    return (
      <div className="text-neutral-100">
        <nav className="border-b border-neutral-800 bg-neutral-950/80 px-5 py-3 backdrop-blur">
          <a className="text-sm font-semibold text-blue-400 hover:underline" href={homePath()} onClick={(e) => { e.preventDefault(); navigate(homePath()) }}>
            ← All videos
          </a>
        </nav>
        <SummaryPage
          loading={detailLoading}
          loadError={Boolean(detail?.error)}
          videoTitle={selectedTitle}
          videoId={routeVideoId}
          summaryMarkdown={detail && !detail.error ? detail.summary : null}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 pb-16 text-neutral-100">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Theo video summaries</h1>
        <p className="mt-1 text-neutral-400">
          A better way to watch Theo's videos (with sponsors because making a video about this isn't free)
        </p>
      </header>

      {videos.length === 0 ? (
        <p className="max-w-md text-neutral-400">None yet</p>
      ) : (
        <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 md:grid-cols-4">
          {videos.map((v) => (
            <li key={v.id}>
              <button type="button" className="flex w-full cursor-pointer flex-col overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900 text-left transition hover:border-blue-400" href={videoPath(v.id)} onClick={(e) => { e.preventDefault(); navigate(videoPath(v.id)) }}>
                <img className="aspect-video w-full bg-neutral-900 object-cover" src={v.thumbnailUrl || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} loading="lazy" />
                <span className="p-2.5 text-xs font-semibold leading-snug">{v.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
