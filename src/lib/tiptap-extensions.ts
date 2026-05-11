import { Node, mergeAttributes } from '@tiptap/core'

// ─── AudioPlayer — reproduce audio inline con controles ───────────────────────

export const AudioPlayer = Node.create({
  name: 'audioPlayer',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      title: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-audio-player]' }]
  },

  renderHTML({ HTMLAttributes }) {
    const { src, title } = HTMLAttributes
    return [
      'div',
      mergeAttributes({ 'data-audio-player': '', class: 'nebbuler-audio-block' }),
      [
        'div',
        { class: 'nebbuler-audio-inner' },
        [
          'div',
          { class: 'nebbuler-audio-header' },
          ['span', { class: 'nebbuler-audio-icon' }, '▶'],
          ['span', { class: 'nebbuler-audio-title' }, title ?? 'Audio'],
        ],
        ['audio', { src, controls: '', preload: 'metadata', class: 'nebbuler-audio-player' }],
      ],
    ]
  },
})

// ─── PdfEmbed — muestra PDF con viewer nativo + botón descarga ────────────────

export const PdfEmbed = Node.create({
  name: 'pdfEmbed',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      name: { default: 'documento.pdf' },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-pdf-embed]' }]
  },

  renderHTML({ HTMLAttributes }) {
    const { src, name } = HTMLAttributes
    return [
      'div',
      mergeAttributes({ 'data-pdf-embed': '', class: 'nebbuler-pdf-block' }),
      [
        'div',
        { class: 'nebbuler-pdf-inner' },
        [
          'div',
          { class: 'nebbuler-pdf-header' },
          ['span', { class: 'nebbuler-pdf-icon' }, '📄'],
          ['span', { class: 'nebbuler-pdf-name' }, name],
          [
            'a',
            { href: src, download: name, class: 'nebbuler-pdf-download', target: '_blank', rel: 'noopener' },
            'Descargar',
          ],
        ],
        ['iframe', { src: `${src}#toolbar=0`, class: 'nebbuler-pdf-frame', title: name }],
      ],
    ]
  },
})

// ─── FileAttachment — tarjeta de descarga para XLSX / DOCX / PPTX ─────────────

export const FileAttachment = Node.create({
  name: 'fileAttachment',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      name: { default: 'archivo' },
      type: { default: 'file' },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-file-attachment]' }]
  },

  renderHTML({ HTMLAttributes }) {
    const { src, name, type } = HTMLAttributes
    const icons: Record<string, string> = {
      xlsx: '📊',
      xls: '📊',
      docx: '📝',
      doc: '📝',
      pptx: '📋',
      ppt: '📋',
      file: '📎',
    }
    const ext = (name as string).split('.').pop()?.toLowerCase() ?? 'file'
    const icon = icons[ext] ?? icons.file

    return [
      'div',
      mergeAttributes({ 'data-file-attachment': '', class: 'nebbuler-file-block' }),
      [
        'a',
        { href: src, download: name, class: 'nebbuler-file-inner', target: '_blank', rel: 'noopener' },
        ['span', { class: 'nebbuler-file-icon' }, icon],
        [
          'div',
          { class: 'nebbuler-file-info' },
          ['span', { class: 'nebbuler-file-name' }, name],
          ['span', { class: 'nebbuler-file-type' }, ext.toUpperCase()],
        ],
        ['span', { class: 'nebbuler-file-action' }, '↓ Descargar'],
      ],
    ]
  },
})
