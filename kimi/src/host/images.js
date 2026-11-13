const DATA_URL = /^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/]+={0,2})$/

export function decodeImage(value) {
  if (typeof value !== 'string') throw new Error('Image payload must be a data URL')
  const match = DATA_URL.exec(value)
  if (!match) throw new Error('Only PNG, JPEG, WebP, and GIF data URLs are supported')
  const data = Buffer.from(match[2], 'base64')
  if (!data.length) throw new Error('Image payload is empty')
  return { mediaType: match[1], data: new Uint8Array(data) }
}

export async function saveImages(ctx, images) {
  if (!Array.isArray(images) || !images.length) return []
  const limits = ctx.attachments.imageLimits
  if (images.length > limits.maxImagesPerMessage) {
    throw new Error(`A message accepts at most ${limits.maxImagesPerMessage} images`)
  }
  const inputs = images.map((image, index) => {
    const decoded = decodeImage(image?.dataUrl)
    return {
      ...decoded,
      name: typeof image?.name === 'string' && image.name.trim() ? image.name.slice(0, 180) : `image-${index + 1}`,
    }
  })
  return ctx.attachments.saveImages(inputs)
}
