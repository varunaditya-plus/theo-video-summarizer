import { MarkdownSummary } from './MarkdownSummary'

export function SummaryModal({ open, onClose, loading, loadError, videoTitle, videoId, summaryMarkdown }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/70 p-4" onClick={onClose}>
      <div className="relative my-auto w-full max-w-3xl rounded-xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-950" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-lg text-2xl leading-none text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100" onClick={onClose}>
          x
        </button>

        {loading && <p className="text-neutral-500 dark:text-neutral-400">Loading summary...</p>}

        {!loading && loadError && (
          <p className="text-red-600 dark:text-red-400">Could not load summary :(</p>
        )}

        {!loading && !loadError && summaryMarkdown != null && (
          <>
            <h2 className="mb-4 pr-8 text-xl font-bold leading-snug tracking-tight">
              {videoTitle}
            </h2>
            <a className="mb-6 inline-block text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400" href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noreferrer">
              Watch on YouTube
            </a>
            <MarkdownSummary markdown={summaryMarkdown} />
          </>
        )}
      </div>
    </div>
  )
}