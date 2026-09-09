import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'My Learning | Srinatha Yoga School',
  description: 'Access your yoga courses, track progress, and continue your learning journey.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#264020',
  viewportFit: 'cover',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
