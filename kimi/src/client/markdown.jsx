import React from 'react'

export function safeHref(value) {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null
  } catch { return null }
}

function Inline({ text }) {
  const nodes = []
  const pattern = /(`[^`\n]+`|\*\*[^*\n]+\*\*|\*[^*\n]+\*|\[[^\]\n]+\]\([^\s)]+\))/g
  let cursor = 0
  let match
  let key = 0
  while ((match = pattern.exec(text))) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index))
    const token = match[0]
    if (token.startsWith('`')) nodes.push(<code key={key++}>{token.slice(1, -1)}</code>)
    else if (token.startsWith('**')) nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>)
    else if (token.startsWith('*')) nodes.push(<em key={key++}>{token.slice(1, -1)}</em>)
    else {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token)
      const href = safeHref(link?.[2] || '')
      nodes.push(href
        ? <a key={key++} href={href} target="_blank" rel="noreferrer noopener">{link[1]}</a>
        : token)
    }
    cursor = match.index + token.length
  }
  if (cursor < text.length) nodes.push(text.slice(cursor))
  return <>{nodes}</>
}

function Table({ lines }) {
  const rows = lines.map((line) => line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim()))
  const head = rows[0] || []
  const body = rows.slice(2)
  return (
    <div className="df-table-scroll">
      <table>
        <thead><tr>{head.map((cell, index) => <th key={index}><Inline text={cell} /></th>)}</tr></thead>
        <tbody>{body.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, index) => <td key={index}><Inline text={cell} /></td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}

export function Markdown({ text = '' }) {
  const lines = String(text).replace(/\r\n/g, '\n').split('\n')
  const blocks = []
  let index = 0
  let key = 0
  while (index < lines.length) {
    const line = lines[index]
    if (!line.trim()) { index += 1; continue }
    if (line.trimStart().startsWith('```')) {
      const language = line.trim().slice(3)
      const code = []
      index += 1
      while (index < lines.length && !lines[index].trimStart().startsWith('```')) code.push(lines[index++])
      if (index < lines.length) index += 1
      blocks.push(<pre key={key++} data-language={language || undefined}><code>{code.join('\n')}</code></pre>)
      continue
    }
    if (/^\s*\|.+\|\s*$/.test(line) && /^\s*\|?\s*:?-{3,}/.test(lines[index + 1] || '')) {
      const table = [line, lines[index + 1]]
      index += 2
      while (index < lines.length && /^\s*\|.+\|\s*$/.test(lines[index])) table.push(lines[index++])
      blocks.push(<Table key={key++} lines={table} />)
      continue
    }
    const heading = /^(#{1,4})\s+(.+)$/.exec(line)
    if (heading) {
      const Tag = `h${Math.min(4, heading[1].length + 1)}`
      blocks.push(<Tag key={key++}><Inline text={heading[2]} /></Tag>)
      index += 1
      continue
    }
    if (/^\s*>\s?/.test(line)) {
      const quote = []
      while (index < lines.length && /^\s*>\s?/.test(lines[index])) quote.push(lines[index++].replace(/^\s*>\s?/, ''))
      blocks.push(<blockquote key={key++}><Inline text={quote.join('\n')} /></blockquote>)
      continue
    }
    if (/^\s*(?:[-*+]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line)
      const items = []
      const itemPattern = ordered ? /^\s*\d+\.\s+/ : /^\s*[-*+]\s+/
      while (index < lines.length && itemPattern.test(lines[index])) items.push(lines[index++].replace(itemPattern, ''))
      const Tag = ordered ? 'ol' : 'ul'
      blocks.push(<Tag key={key++}>{items.map((item, itemIndex) => <li key={itemIndex}><Inline text={item} /></li>)}</Tag>)
      continue
    }
    const paragraph = [line]
    index += 1
    while (index < lines.length && lines[index].trim() && !/^(?:\s*```|\s*#{1,4}\s|\s*>\s?|\s*(?:[-*+]|\d+\.)\s+|\s*\|.+\|\s*)$/.test(lines[index])) {
      paragraph.push(lines[index++])
    }
    blocks.push(<p key={key++}><Inline text={paragraph.join('\n')} /></p>)
  }
  return <div className="df-markdown">{blocks}</div>
}
