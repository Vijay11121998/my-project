// Turns a mock node output into a real downloadable file in the browser.
// No backend — we build a Blob client-side and trigger a save via an anchor.

function slug(s) {
  return (s || 'output').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// Returns { filename, mime, content } for a given output, or null if nothing
// sensible to download.
export function buildDownload(output) {
  if (!output) return null
  const base = slug(output.title)

  switch (output.type) {
    case 'report': {
      const body = output.sections.map((s) => `## ${s.heading}\n\n${s.body}`).join('\n\n')
      return {
        filename: `${base}.md`,
        mime: 'text/markdown',
        content: `# ${output.title}\n\n_${output.wordCount.toLocaleString()} words_\n\n${body}\n`,
      }
    }
    case 'grid': {
      const esc = (c) => (/[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)
      const rows = [output.columns, ...output.rows].map((r) => r.map(esc).join(','))
      return { filename: `${base}.csv`, mime: 'text/csv', content: rows.join('\n') + '\n' }
    }
    case 'artifact': {
      // Mock binary file — we ship a text outline standing in for the deck.
      const outline = output.slides.map((s, i) => `${i + 1}. ${s}`).join('\n')
      return {
        filename: output.fileName?.replace(/\.[^.]+$/, '.txt') || `${base}.txt`,
        mime: 'text/plain',
        content: `${output.title}\n${output.format} · ${output.slides.length} slides\n\n${outline}\n`,
      }
    }
    case 'chat': {
      const transcript = output.messages
        .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
        .join('\n\n')
      const ctx = output.contextSources?.length ? `Context: ${output.contextSources.join(', ')}\n\n` : ''
      return { filename: `${base}-thread.txt`, mime: 'text/plain', content: ctx + transcript + '\n' }
    }
    case 'instruction':
      return { filename: `${base}.txt`, mime: 'text/plain', content: `${output.text}\n` }
    default:
      return null
  }
}

export function downloadOutput(output) {
  const file = buildDownload(output)
  if (!file) return
  const blob = new Blob([file.content], { type: file.mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = file.filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
