import { actionMatches } from './hotkey.js'
import { defaultShortcuts } from '../shared/preferences.js'
import React, { useCallback, useRef, useState } from 'react'
import { Icon } from './messages.jsx'

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error(`Could not read ${file.name || 'image'}`))
    reader.readAsDataURL(file)
  })
}

export function useImageDrafts(config, setError) {
  const [images, setImages] = useState([])
  const addFiles = useCallback(async (files) => {
    if (!config) return
    const limits = config.imageLimits || {}
    const allowed = limits.mediaTypes || ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
    const candidates = [...files].filter((file) => file.type.startsWith('image/'))
    if (!candidates.length) return
    setError(null)
    try {
      if (images.length + candidates.length > (limits.maxImagesPerMessage || 4)) {
        throw new Error(`At most ${limits.maxImagesPerMessage || 4} images are allowed per message`)
      }
      let total = images.reduce((sum, image) => sum + image.bytes, 0)
      const added = []
      for (const file of candidates) {
        if (!allowed.includes(file.type)) throw new Error(`${file.name || 'Image'} has an unsupported format`)
        if (file.size > (limits.maxImageBytes || 10 * 1024 * 1024)) throw new Error(`${file.name || 'Image'} is too large`)
        total += file.size
        if (total > (limits.maxMessageImageBytes || 20 * 1024 * 1024)) throw new Error('The combined image size is too large')
        added.push({ name: file.name || `pasted-${Date.now()}.png`, bytes: file.size, dataUrl: await readFile(file) })
      }
      setImages((current) => [...current, ...added])
    } catch (fileError) {
      setError(fileError.message)
    }
  }, [config, images, setError])
  return { images, setImages, addFiles }
}

export function ImageDrafts({ images, setImages }) {
  if (!images.length) return null
  return (
    <div className="df-image-drafts">
      {images.map((image, index) => (
        <div className="df-image-draft" key={`${image.name}-${index}`}>
          <img src={image.dataUrl} alt={image.name} />
          <button type="button" onClick={() => setImages((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label="Remove image"><Icon name="close" size={13} /></button>
        </div>
      ))}
    </div>
  )
}

export function ConversationComposer({
  t, draft, setDraft, images, addFiles, generating, archived, imageEnabled,
  onSubmit, onStop, shortcuts = defaultShortcuts, inputRef, className = '',
}) {
  const fileRef = useRef(null)
  return (
    <div className={`df-composer ${className}`}>
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple hidden
        onChange={(event) => { void addFiles(event.target.files); event.target.value = '' }} />
      <button className="df-icon-btn df-composer-attach" type="button" disabled={!imageEnabled || generating || archived}
        title={imageEnabled ? t('quick.attach') : t('settings.visionHint')} aria-label={t('quick.attach')}
        onClick={() => fileRef.current?.click()}><Icon name="plus" /></button>
      <textarea ref={inputRef} rows="1" value={draft} disabled={generating || archived} placeholder={t('quick.placeholder')}
        onChange={(event) => setDraft(event.target.value)}
        onPaste={(event) => {
          const files = [...event.clipboardData.files]
          if (files.length) { event.preventDefault(); void addFiles(files) }
        }}
        onKeyDown={(event) => {
          if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) return
          if (actionMatches(event, shortcuts.send)) {
            event.preventDefault()
            if (!event.repeat) void onSubmit()
          } else if (actionMatches(event, shortcuts.newline)) {
            event.preventDefault()
            const field = event.currentTarget
            const at = field.selectionStart
            setDraft(draft.slice(0, at) + '\n' + draft.slice(field.selectionEnd))
            requestAnimationFrame(() => field.setSelectionRange(at + 1, at + 1))
          }
        }} />
      <button className="df-send" type="button" disabled={generating ? false : archived || (!draft.trim() && !images.length)}
        onClick={generating ? onStop : () => void onSubmit()} aria-label={generating ? t('quick.stop') : t('quick.send')}>
        <Icon name={generating ? 'stop' : 'send'} />
      </button>
    </div>
  )
}
