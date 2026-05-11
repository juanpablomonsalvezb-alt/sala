import { permanentRedirect } from 'next/navigation'

// /explorar canibalizaba con /directorio — mismo contenido, mismas keywords.
// 308 redirect consolida la autoridad SEO en /directorio.
export default function ExplorarRedirect() {
  permanentRedirect('/directorio')
}
