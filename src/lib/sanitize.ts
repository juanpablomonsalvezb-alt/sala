import DOMPurify from 'isomorphic-dompurify'

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 's', 'blockquote', 'code', 'pre',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'a', 'img', 'figure', 'figcaption',
  'hr', 'span', 'div',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'iframe',
]

const ALLOWED_ATTR = [
  'href', 'target', 'rel',
  'src', 'alt', 'title', 'width', 'height',
  'class', 'data-audio-player', 'data-pdf-embed', 'data-file-attachment',
  'data-youtube-video', 'controls', 'preload', 'download',
  'frameborder', 'allow', 'allowfullscreen',
]

const ALLOWED_URI_REGEXP = /^(?:https?:|mailto:|tel:|#|\/)/i

export function sanitizeHtml(html: string): string {
  if (!html) return ''
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP,
    FORBID_TAGS: ['script', 'style', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'style'],
    KEEP_CONTENT: true,
  })
}

export function stripHtml(html: string): string {
  if (!html) return ''
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}
