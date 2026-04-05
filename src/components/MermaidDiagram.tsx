import { renderMermaidSVG, THEMES } from 'beautiful-mermaid'
import { useMemo } from 'react'
import type { CustomRendererProps } from 'streamdown'

function normalizeFlowchartTopDown(source: string): string {
  const lines = source.split('\n')
  const i = lines.findIndex((l) => l.trim().length > 0)
  if (i === -1) return source

  const line = lines[i]
  const trimmed = line.trimStart()
  const next = trimmed.replace(/^(graph|flowchart)\s+(BT|LR|RL)\b/i, (_m, kind: string) => `${kind} TD`)
  if (next === trimmed) return source

  const leading = line.slice(0, line.length - trimmed.length)
  lines[i] = leading + next
  return lines.join('\n')
}

export function MermaidDiagram({ code }: CustomRendererProps) {
  const { svg, error } = useMemo(() => {
    const diagram = normalizeFlowchartTopDown(code.trim())
    try {
      return {
        svg: renderMermaidSVG(diagram, {
          ...THEMES['zinc-dark'],
          line: '#a1a1aa',
          accent: '#e4e4e7',
          muted: '#a1a1aa',
          surface: '#27272a',
          border: '#3f3f46',
          transparent: true,
        }),
        error: null,
      }
    } catch (err) {
      return { svg: null, error: err instanceof Error ? err : new Error(String(err)) }
    }
  }, [code])

  return (
    <div className="summary-mermaid-block my-4 overflow-x-auto [&_svg]:h-auto [&_svg]:max-w-full">
      {error != null && <p className="mb-2 text-sm text-red-400">{error.message}</p>}
      {svg != null && <div className="flex justify-center" data-streamdown="mermaid-block" dangerouslySetInnerHTML={{ __html: svg }} />}
    </div>
  )
}