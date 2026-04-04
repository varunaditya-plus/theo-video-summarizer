import { useEffect, useRef } from 'react'

let configured = false

export function MermaidBlock({ children }) {
  const ref = useRef(null)

  useEffect(() => {
    const definition = String(children).trim()
    const el = ref.current
    if (!definition || !el) return

    let cancelled = false
    const renderId = `mermaid-${Math.random().toString(36).slice(2)}`

    import('mermaid')
      .then(({ default: mermaid }) => {
        if (cancelled) return
        if (!configured) {
          mermaid.initialize({ startOnLoad: false, theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'neutral', securityLevel: 'loose' })
          configured = true
        }
        return mermaid.render(renderId, definition)
      })
      .then((result) => { if (!cancelled && el && result) el.innerHTML = result.svg })
      .catch((err) => { if (!cancelled && el) el.innerHTML = `<pre class="text-xs text-red-500">${err}</pre>` })

    return () => { cancelled = true }
  }, [children])

  return <div ref={ref} className="not-prose my-4 flex justify-center overflow-x-auto [&_svg]:max-w-full" />
}