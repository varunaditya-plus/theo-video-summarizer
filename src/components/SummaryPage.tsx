import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { code } from '@streamdown/code'
import { Streamdown } from 'streamdown'
import type { CustomRendererProps } from 'streamdown'
import { applyReveal } from '../lib/reveal'
import { loadSponsors, sanitizeSponsorSvgMarkup, sponsorsFromDescription, type Sponsor } from '../lib/sponsors'

const MermaidDiagramLazy = lazy(() =>
  import('./MermaidDiagram').then((m) => ({ default: m.MermaidDiagram })),
)

function MermaidDiagramWithSuspense(props: CustomRendererProps) {
  return (
    <Suspense fallback={<div className="my-4 min-h-[100px] rounded border border-neutral-800 bg-neutral-900/30 px-3 py-3 text-sm text-neutral-500">Loading diagram…</div>}>
      <MermaidDiagramLazy {...props} />
    </Suspense>
  )
}

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

  const sponsorTopRef = useRef<HTMLDivElement>(null)
  const [sponsorTopOffScreen, setSponsorTopOffScreen] = useState(false)

  const markdown = summaryMarkdown != null ? summaryMarkdown.replace(/^(\s*)# /, '$1## ') : null
  const sponsorBlockMounted = !loading && markdown != null && sponsorCards.length > 0

  useLayoutEffect(() => {
    if (!sponsorBlockMounted) {
      setSponsorTopOffScreen(false)
      return
    }
    const el = sponsorTopRef.current
    if (!el) return

    const io = new IntersectionObserver(
      ([e]) => setSponsorTopOffScreen(!e.isIntersecting),
      { root: null, threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [sponsorBlockMounted, sponsorCards.length])

  const floatEligible =
    !loading && !loadError && markdown != null && sponsorCards.length > 0
  const showFloatingDock = floatEligible && sponsorTopOffScreen

  const [floatDockMounted, setFloatDockMounted] = useState(false)
  const [floatDockOpen, setFloatDockOpen] = useState(false)

  useEffect(() => {
    if (showFloatingDock) {
      setFloatDockMounted(true)
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setFloatDockOpen(true))
      })
      return () => cancelAnimationFrame(id)
    }
    setFloatDockOpen(false)
    const t = window.setTimeout(() => setFloatDockMounted(false), 300)
    return () => clearTimeout(t)
  }, [showFloatingDock])

  const revealRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (loading || markdown == null) return
    const root = revealRef.current
    if (!root) return

    const staggerMs = 36
    const apply = () => applyReveal(root, staggerMs)

    apply()
    const timeouts = [150, 450].map((ms) => window.setTimeout(apply, ms))

    let debounce: ReturnType<typeof setTimeout> | null = null
    const mo = new MutationObserver(() => {
      if (debounce) clearTimeout(debounce)
      debounce = window.setTimeout(() => { apply(); debounce = null }, 280)
    })
    mo.observe(root, { childList: true, subtree: true })
    const disconnectMo = window.setTimeout(() => mo.disconnect(), 6000)

    return () => {
      timeouts.forEach(clearTimeout)
      clearTimeout(disconnectMo)
      if (debounce) clearTimeout(debounce)
      mo.disconnect()
    }
  }, [loading, markdown])

  const showHeaderStrip = !loadError && (loading || markdown != null)

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 pb-16 text-neutral-100">
      {loadError && <p className="text-red-400">Could not load summary :(</p>}
      {showHeaderStrip && (
        <>
          <aside className="mb-2 border border-neutral-800 bg-neutral-900/30 px-3 py-2.5 text-sm text-neutral-100/90">
            ❕ Company or product names may be wrong as summaries are generated using video transcripts.
          </aside>
          <aside className="mb-6 border border-neutral-800 bg-neutral-900/30 px-3 py-2.5 text-sm text-neutral-100/90">
            ❕ Diagrams might show when not needed. I lowkey made the modal draw them because theo draws charts.
          </aside>
          {loading && (
            <div className="pointer-events-none mb-6 flex items-center gap-2 border border-neutral-800 bg-neutral-900/30 px-3 py-2.5 text-left text-sm select-none">
              <div className="flex w-fit max-w-[min(120px,28vw)] shrink-0 items-center justify-start">
                <span className="text-[length:clamp(1.875rem,5vw,2.5rem)] leading-none tracking-tight text-white">
                  idk
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-neutral-100">sponsor</div>
                <p className="mt-0.5 text-neutral-400">woah what a cool sponsor</p>
              </div>
            </div>
          )}
          {!loading && markdown != null && sponsorCards.length > 0 && (
            <div ref={sponsorTopRef} className="summary-reveal-sponsors mb-6 space-y-3">
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
        </>
      )}
      {!loading && !loadError && markdown != null && (
        <div ref={revealRef} className="summary-ai-root">
          <h1 className="mb-4 text-2xl font-bold leading-snug tracking-tight sm:text-3xl">{videoTitle}</h1>
          <Streamdown
            className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold"
            mode="static"
            plugins={{ code, renderers: [{ language: 'mermaid', component: MermaidDiagramWithSuspense }] }}
            shikiTheme={['github-dark', 'github-dark']}
          >
            {markdown}
          </Streamdown>
        </div>
      )}
      {floatDockMounted &&
        createPortal(
          <div className={`fixed bottom-4 right-4 z-50 max-h-[min(40vh,320px)] w-[min(280px,85vw)] space-y-2 motion-safe:transition-opacity motion-safe:duration-200 ${floatDockOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
            {sponsorCards.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="relative block overflow-hidden border border-neutral-800 bg-neutral-900/50 text-left text-xs text-neutral-100/90 transition hover:border-neutral-700 hover:bg-neutral-900/70">
                {s.glow && <div className="pointer-events-none absolute inset-0 opacity-80" style={{ background: s.glow }} />}
                <div className="relative z-10 flex gap-2 px-2 py-2">
                  <div className="flex h-8 shrink-0 items-center justify-start [&_svg]:max-h-8 [&_svg]:w-auto [&_svg]:max-w-[min(96px,22vw)]" dangerouslySetInnerHTML={{ __html: sanitizeSponsorSvgMarkup(s.img) }}/>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-neutral-100">{s.h3}</div>
                    <p className="mt-0.5 text-[11px] leading-snug text-neutral-400">{s.p}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>,
          document.body,
        )}
    </div>
  )
}