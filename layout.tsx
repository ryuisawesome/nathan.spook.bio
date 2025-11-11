import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'nathan',
  description: 'profile page for me',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
