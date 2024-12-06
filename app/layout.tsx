import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'メタリックToDo',
  description: 'Next.jsで作成したToDoアプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
