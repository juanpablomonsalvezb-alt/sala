import type { Metadata } from 'next'
import DemoClient from './_components/DemoClient'

export const metadata: Metadata = {
  title: 'Demo — Así se ve Nebbuler',
  description: 'Descubre cómo funciona el editor y cómo ven tus lectores las publicaciones.',
}

export default function DemoPage() {
  return <DemoClient />
}
