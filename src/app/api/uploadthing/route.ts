import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { createRouteHandler } from 'uploadthing/next'
import { createClient } from '@/lib/supabase/server'

const f = createUploadthing()

async function getAuthenticatedUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const nebbulerFileRouter = {
  imageUploader: f({ image: { maxFileSize: '8MB', maxFileCount: 10 } })
    .middleware(async () => {
      const user = await getAuthenticatedUser()
      if (!user) throw new Error('Unauthorized')
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url, userId: metadata.userId }
    }),

  pdfUploader: f({ pdf: { maxFileSize: '4MB', maxFileCount: 3 } })
    .middleware(async () => {
      const user = await getAuthenticatedUser()
      if (!user) throw new Error('Unauthorized')
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url, name: file.name, userId: metadata.userId }
    }),

  audioUploader: f({ audio: { maxFileSize: '64MB', maxFileCount: 3 } })
    .middleware(async () => {
      const user = await getAuthenticatedUser()
      if (!user) throw new Error('Unauthorized')
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url, name: file.name, userId: metadata.userId }
    }),

  documentUploader: f({
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { maxFileSize: '16MB', maxFileCount: 3 },
    'application/vnd.ms-excel': { maxFileSize: '16MB', maxFileCount: 3 },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { maxFileSize: '16MB', maxFileCount: 3 },
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': { maxFileSize: '32MB', maxFileCount: 3 },
  })
    .middleware(async () => {
      const user = await getAuthenticatedUser()
      if (!user) throw new Error('Unauthorized')
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url, name: file.name, userId: metadata.userId }
    }),
} satisfies FileRouter

export type NebbulerFileRouter = typeof nebbulerFileRouter

export const { GET, POST } = createRouteHandler({ router: nebbulerFileRouter })
