import sanitizeHtmlLib from 'sanitize-html'

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 's', 'blockquote', 'code', 'pre',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'a', 'img', 'figure', 'figcaption',
  'hr', 'span', 'div',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'iframe',
]

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ['href', 'target', 'rel'],
  img: ['src', 'alt', 'title', 'width', 'height'],
  iframe: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen', 'title'],
  '*': [
    'class', 'data-audio-player', 'data-pdf-embed', 'data-file-attachment',
    'data-youtube-video', 'controls', 'preload', 'download',
  ],
}

const ALLOWED_SCHEMES = ['http', 'https', 'mailto', 'tel']
const ALLOWED_IFRAME_HOSTNAMES = [
  'www.youtube.com', 'youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com',
  'player.vimeo.com', 'vimeo.com',
]

export function sanitizeHtml(html: string): string {
  if (!html) return ''
  return sanitizeHtmlLib(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ALLOWED_SCHEMES,
    allowedIframeHostnames: ALLOWED_IFRAME_HOSTNAMES,
    disallowedTagsMode: 'discard',
    transformTags: {
      a: sanitizeHtmlLib.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }),
    },
  })
}

export function stripHtml(html: string): string {
  if (!html) return ''
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}
