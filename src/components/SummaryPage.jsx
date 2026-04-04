import { code } from '@streamdown/code'
import { mermaid } from '@streamdown/mermaid'
import { Streamdown } from 'streamdown'

export function SummaryPage({ videoTitle, videoId, loading, loadError, summaryMarkdown }) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-8 pb-16 text-neutral-100">
      {loading && <p className="text-neutral-500">Loading summary...</p>}

      {!loading && loadError && <p className="text-red-400">Could not load summary :(</p>}

      {!loading && !loadError && summaryMarkdown != null && (
        <>
          <h1 className="mb-4 text-2xl font-bold leading-snug tracking-tight sm:text-3xl">{videoTitle}</h1>
          <Streamdown
            className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold"
            mode="static"
            plugins={{ code, mermaid }}
            mermaid={{
              config: {
                theme: 'dark',
                securityLevel: 'loose',
                flowchart: { useMaxWidth: false },
              },
            }}
            shikiTheme={['github-dark', 'github-dark']}
          >
            {summaryMarkdown}
          </Streamdown>
        </>
      )}
    </div>
  )
}