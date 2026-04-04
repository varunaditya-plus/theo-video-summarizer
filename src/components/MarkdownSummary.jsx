import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { MermaidBlock } from './MermaidBlock'

function Code({ className, children, ...props }) {
  const match = /language-(\w+)/.exec(className || '')

  if (match?.[1] === 'mermaid') return <MermaidBlock>{String(children).replace(/\n$/, '')}</MermaidBlock>
  if (match) return <code className={className} {...props}>{children}</code>

  return (
    <code className="rounded bg-neutral-200 px-1.5 py-0.5 text-[0.9em] dark:bg-neutral-800" {...props}>
      {children}
    </code>
  )
}

export function MarkdownSummary({ markdown }) {
  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code: Code }}>
        {markdown}
      </ReactMarkdown>
    </div>
  )
}