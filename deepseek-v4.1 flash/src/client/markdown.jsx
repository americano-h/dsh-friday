import React from 'react'

const SAFE_LINK = /^https?:\/\//i

function renderInline(text, keyPrefix) {
  const nodes = []
  let index = 0
  let key = 0
  const push = (node) => nodes.push(<React.Fragment key={`${keyPrefix}-${key++}`}>{node}</React.Fragment>)

  while (index < text.length) {
    const rest = text.slice(index)
    const code = /^`([^`]+)`/.exec(rest)
    if (code) {
      push(<code>{code[1]}</code>)
      index += code[0].length
      continue
    }
    const link = /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/i.exec(rest)
    if (link) {
      push(<a href={link[2]} target="_blank" rel="noreferrer noopener">{link[1]}</a>)
      index += link[0].length
      continue
    }
    const auto = /^https?:\/\/[^\s<>"]+/.exec(rest)
    if (auto) {
      const href = auto[0].replace(/[.,;:!?)]+$/, '')
      push(<a href={href} target="_blank" rel="noreferrer noopener">{href}</a>)
      index += href.length
      continue
    }
    const bold = /^(\*\*|__)(.+?)\1/.exec(rest)
    if (bold) {
      push(<strong>{renderInline(bold[2], `${keyPrefix}-b${key}`)}</strong>)
      index += bold[0].length
      continue
    }
    const italic = /^(\*|_)([^*_]+?)\1/.exec(rest)
    if (italic) {
      push(<em>{renderInline(italic[2], `${keyPrefix}-i${key}`)}</em>)
      index += italic[0].length
      continue
    }
    const strike = /^~~(.+?)~~/.exec(rest)
    if (strike) {
      push(<del>{renderInline(strike[1], `${keyPrefix}-s${key}`)}</del>)
      index += strike[0].length
      continue
    }
    const next = /[`*_~[\]\n]/.exec(rest)
    const length = next ? Math.max(1, next.index) : rest.length
    push(rest.slice(0, length))
    index += length
  }
  return nodes
}

function splitRow(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim())
}

export function Markdown({ text, className = '' }) {
  if (!text) return null
  const lines = String(text).replace(/\r\n?/g, '\n').split('\n')
  const blocks = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) {
      i += 1
      continue
    }

    const fence = /^```(\w*)\s*$/.exec(line)
    if (fence) {
      const body = []
      i += 1
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        body.push(lines[i])
        i += 1
      }
      i += 1
      blocks.push(<pre key={`pre-${key++}`}><code data-language={fence[1] || undefined}>{body.join('\n')}</code></pre>)
      continue
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(line)
    if (heading) {
      const level = heading[1].length
      const Tag = `h${level}`
      blocks.push(<Tag key={`h-${key++}`}>{renderInline(heading[2], `h${key}`)}</Tag>)
      i += 1
      continue
    }

    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push(<hr key={`hr-${key++}`} />)
      i += 1
      continue
    }

    if (/^>\s?/.test(line)) {
      const body = []
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        body.push(lines[i].replace(/^>\s?/, ''))
        i += 1
      }
      blocks.push(<blockquote key={`q-${key++}`}><Markdown text={body.join('\n')} /></blockquote>)
      continue
    }

    if (line.includes('|') && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i + 1])) {
      const head = splitRow(line)
      i += 2
      const rows = []
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
        rows.push(splitRow(lines[i]))
        i += 1
      }
      blocks.push(
        <table key={`t-${key++}`}>
          <thead><tr>{head.map((cell, n) => <th key={n}>{renderInline(cell, `th${n}`)}</th>)}</tr></thead>
          <tbody>{rows.map((row, r) => <tr key={r}>{head.map((_, c) => <td key={c}>{renderInline(row[c] || '', `td${r}-${c}`)}</td>)}</tr>)}</tbody>
        </table>,
      )
      continue
    }

    const listMatch = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(line)
    if (listMatch) {
      const ordered = /\d/.test(listMatch[2])
      const items = []
      const baseIndent = listMatch[1].length
      while (i < lines.length) {
        const m = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(lines[i])
        if (!m || m[1].length < baseIndent) break
        if (m[1].length > baseIndent) {
          items[items.length - 1] = `${items[items.length - 1]}\n${lines[i].trim()}`
          i += 1
          continue
        }
        items.push(m[3])
        i += 1
      }
      const Tag = ordered ? 'ol' : 'ul'
      blocks.push(
        <Tag key={`list-${key++}`}>
          {items.map((item, n) => {
            const [first, ...rest] = item.split('\n')
            return <li key={n}>{renderInline(first, `li${n}`)}{rest.length ? <Markdown text={rest.join('\n')} /> : null}</li>
          })}
        </Tag>,
      )
      continue
    }

    const paragraph = [line]
    i += 1
    while (i < lines.length && lines[i].trim() && !/^(```|#{1,4}\s|>\s?|[-*+]\s|\d+[.)]\s)/.test(lines[i])) {
      paragraph.push(lines[i])
      i += 1
    }
    blocks.push(<p key={`p-${key++}`}>{renderInline(paragraph.join('\n'), `p${key}`).map((node, n) => <React.Fragment key={n}>{node}{n < paragraph.length - 1 ? ' ' : ''}</React.Fragment>)}</p>)
  }

  return <div className={`df-md ${className}`}>{blocks}</div>
}

export function safeLink(url) {
  return typeof url === 'string' && SAFE_LINK.test(url)
}
