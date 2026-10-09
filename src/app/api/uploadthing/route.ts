import { createRouteHandler } from 'uploadthing/next'
import { nebbulerFileRouter } from '@/lib/uploadthing-router'

export const { GET, POST } = createRouteHandler({ router: nebbulerFileRouter })
