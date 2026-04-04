import { useCallback, useEffect, useState } from 'react'
import { SummaryModal } from './components/SummaryModal'

export default function App() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

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

  const openVideo = useCallback((id) => {
    setSelectedId(id)
    setDetail(null)
    setDetailLoading(true)
    const url = new URL(window.location.href)
    url.searchParams.set('v', id)
    window.history.replaceState({}, '', url)
    fetch(`/videos/${id}.json`)
      .then((r) => {
        if (!r.ok) throw new Error('Summary not found')
        return r.json()
      })
      .then(setDetail)
      .catch(() => setDetail({ error: true }))
      .finally(() => setDetailLoading(false))
  }, [])

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('v')
    if (id && videos.some((v) => v.id === id)) openVideo(id)
  }, [videos, openVideo])

  const closeModal = () => {
    setSelectedId(null)
    setDetail(null)
    const url = new URL(window.location.href)
    url.searchParams.delete('v')
    window.history.replaceState({}, '', url.pathname + url.search)
  }

  const selectedTitle = videos.find((x) => x.id === selectedId)?.title ?? ''

  if (loading) {
    return ( // temporary. ill add a skeleton or sm
      <div className="mx-auto max-w-5xl px-5 py-8 text-neutral-500 dark:text-neutral-400">
        <p>Loading…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-8">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 pb-16 text-neutral-900 dark:text-neutral-100">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Theo video summaries</h1>
        <p className="mt-1 text-neutral-600 dark:text-neutral-400">
          A better way to watch Theo's videos (with sponsors because making a video about this isn't free)
        </p>
      </header>

      {videos.length === 0 ? (
        <p className="max-w-md text-neutral-600 dark:text-neutral-400">
          None yet
        </p>
      ) : (
        <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 md:grid-cols-4">
          {videos.map((v) => (
            <li key={v.id}>
              <button type="button" className="flex w-full cursor-pointer flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white text-left transition hover:border-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-blue-400" onClick={() => openVideo(v.id)}>
                <img className="aspect-video w-full bg-neutral-900 object-cover" src={v.thumbnailUrl || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} loading="lazy" />
                <span className="p-2.5 text-xs font-semibold leading-snug">{v.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <SummaryModal
        open={Boolean(selectedId)}
        onClose={closeModal}
        loading={detailLoading}
        loadError={Boolean(detail?.error)}
        videoTitle={selectedTitle}
        videoId={selectedId ?? ''}
        summaryMarkdown={detail && !detail.error ? detail.summary : null}
      />
    </div>
  )
}
