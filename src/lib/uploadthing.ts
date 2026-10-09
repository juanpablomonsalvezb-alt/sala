import { generateUploadButton, generateUploadDropzone, generateReactHelpers } from '@uploadthing/react'
import type { NebbulerFileRouter } from '@/lib/uploadthing-router'

export const UploadButton = generateUploadButton<NebbulerFileRouter>()
export const UploadDropzone = generateUploadDropzone<NebbulerFileRouter>()
export const { useUploadThing } = generateReactHelpers<NebbulerFileRouter>()
