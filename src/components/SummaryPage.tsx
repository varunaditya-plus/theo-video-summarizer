import { useEffect, useMemo, useState } from 'react'
import { code } from '@streamdown/code'
import { Streamdown } from 'streamdown'
import { loadSponsors, sanitizeSponsorSvgMarkup, sponsorsFromDescription, type Sponsor } from '../lib/sponsors'
import { MermaidDiagram } from './MermaidDiagram'

type SummaryPageProps = {
  videoTitle: string
  videoDescription?: string
  loading: boolean
  loadError: boolean
  summaryMarkdown: string | null
}

export function SummaryPage({ videoTitle, loading, loadError, summaryMarkdown, videoDescription = '' }: SummaryPageProps) {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  useEffect(() => {
    loadSponsors()
      .then(setSponsors)
      .catch(() => {})
  }, [])

  const sponsorCards = useMemo(
    () => sponsorsFromDescription(videoDescription, sponsors),
    [videoDescription, sponsors],
  )

  const markdown = summaryMarkdown != null ? summaryMarkdown.replace(/^(\s*)# /, '$1## ') : null

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 pb-16 text-neutral-100">
      {loading && <p className="text-neutral-500">Loading summary...</p>}
      {!loading && loadError && <p className="text-red-400">Could not load summary :(</p>}
      {!loading && !loadError && markdown != null && (
        <>
          <aside className="mb-2 border border-neutral-800 bg-neutral-900/30 px-3 py-2.5 text-sm text-neutral-100/90">
            ❕ Company or product names may be wrong as summaries are generated using video transcripts.
          </aside>
          <aside className="mb-6 border border-neutral-800 bg-neutral-900/30 px-3 py-2.5 text-sm text-neutral-100/90">
            ❕ Diagrams might show when not needed. I lowkey made the modal draw them because theo draws charts.
          </aside>
          {sponsorCards.length > 0 && (
            <div className="mb-6 space-y-3">
              {sponsorCards.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="relative block overflow-hidden border border-neutral-800 bg-neutral-900/30 text-left text-sm text-neutral-100/90 transition hover:border-neutral-700 hover:bg-neutral-900/50">
                  {s.glow && <div className="pointer-events-none absolute inset-0" style={{ background: s.glow }} />}
                  <div className="relative z-10 flex gap-3 px-3 py-2.5">
                    <div className="flex h-10 shrink-0 items-center justify-start [&_svg]:max-h-10 [&_svg]:w-auto [&_svg]:max-w-[min(120px,28vw)]" dangerouslySetInnerHTML={{ __html: sanitizeSponsorSvgMarkup(s.img) }}/>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-neutral-100">{s.h3}</div>
                      <p className="mt-0.5 text-neutral-400">{s.p}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
          <h1 className="mb-4 text-2xl font-bold leading-snug tracking-tight sm:text-3xl">{videoTitle}</h1>
          <Streamdown
            className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold"
            mode="static"
            plugins={{ code, renderers: [{ language: 'mermaid', component: MermaidDiagram }] }}
            shikiTheme={['github-dark', 'github-dark']}
          >
            {markdown}
          </Streamdown>
        </>
      )}
    </div>
  )
}