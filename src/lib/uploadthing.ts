import { generateUploadButton, generateUploadDropzone, generateReactHelpers } from '@uploadthing/react'
import type { NebbulerFileRouter } from '@/app/api/uploadthing/route'

export const UploadButton = generateUploadButton<NebbulerFileRouter>()
export const UploadDropzone = generateUploadDropzone<NebbulerFileRouter>()
export const { useUploadThing } = generateReactHelpers<NebbulerFileRouter>()
