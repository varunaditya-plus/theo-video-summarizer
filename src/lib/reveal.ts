function collectRevealGroups(root: HTMLElement): HTMLElement[][] {
  const groups: HTMLElement[][] = []
  const pushSingle = (el: HTMLElement) => {
    groups.push([el])
  }

  const title = root.querySelector(':scope > h1')
  if (title instanceof HTMLElement) pushSingle(title)

  const prose = root.querySelector<HTMLElement>('.prose')
  if (!prose) return groups

  const candidates = Array.from(
    prose.querySelectorAll<HTMLElement>(
      ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote', 'pre', 'hr', '[data-streamdown="table-wrapper"]', 'table', '[data-streamdown="code-block"]', '.summary-mermaid-block'].join(', '),
    ),
  )

  const filtered = candidates.filter((el) => {
    if (el.tagName === 'P' && el.closest('td, th')) return false
    if (el.tagName === 'PRE' && el.closest('[data-streamdown="code-block"]')) return false
    if (el.tagName === 'TABLE' && el.closest('[data-streamdown="table-wrapper"]')) return false
    if (el.tagName === 'LI' && el.querySelector(':scope > p')) return false
    if (el.tagName === 'BLOCKQUOTE' && el.querySelector('p')) return false
    if (el.tagName === 'P' && el.closest('li')) return false
    if (el.tagName === 'P' && el.closest('blockquote')) return false
    return true
  })

  filtered.sort((a, b) => {
    const pos = a.compareDocumentPosition(b)
    if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1
    if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1
    return 0
  })

  filtered.forEach((el) => pushSingle(el))
  return groups
}

export function applyReveal(root: HTMLElement, staggerMs: number) {
  const groups = collectRevealGroups(root)
  groups.forEach((els, gIdx) => {
    const delay = `${gIdx * staggerMs}ms`
    els.forEach((el) => {
      el.style.setProperty('--ai-stagger', delay)
      el.classList.add('summary-ai-reveal')
    })
  })
}
