import React, { useEffect, useState } from 'react'

export function domainOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function MessageImages({ images, sessionId }) {
  const [urls, setUrls] = useState({})
  useEffect(() => {
    let cancelled = false
    for (const image of images || []) {
      if (image.dataUrl || !image.attachment) continue
      const id = image.attachment.attachmentId
      if (!id || urls[id]) continue
      fetch(`/dsh-friday/api/v1/attachment/${encodeURIComponent(sessionId)}/${encodeURIComponent(id)}`, { credentials: 'same-origin', headers: { 'X-DSH-Friday': '1' } })
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          if (!cancelled && data?.dataUrl) setUrls((prev) => ({ ...prev, [id]: data.dataUrl }))
        })
        .catch(() => {})
    }
    return () => { cancelled = true }
  }, [images, sessionId, urls])

  if (!images?.length) return null
  return (
    <div className="df-images" style={{ padding: '4px 0 0' }}>
      {images.map((image, index) => {
        const id = image.attachment?.attachmentId
        const src = image.dataUrl || (id ? urls[id] : null)
        return (
          <div className="df-thumb" key={id || index} style={{ width: 64, height: 64 }}>
            {src ? <img src={src} alt={image.attachment?.name || ''} /> : <span className="df-subtle" style={{ fontSize: 10, display: 'grid', placeItems: 'center', height: '100%' }}>image</span>}
          </div>
        )
      })}
    </div>
  )
}

export function References({ citations }) {
  if (!citations?.length) return null
  return (
    <div className="df-refs">
      {citations.slice(0, 6).map((citation, index) => (
        <a className="df-ref" key={`${citation.url}-${index}`} href={citation.url} target="_blank" rel="noreferrer noopener" title={citation.title || citation.url}>
          <span>{index + 1}</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{citation.title || domainOf(citation.url)}</span>
        </a>
      ))}
    </div>
  )
}
