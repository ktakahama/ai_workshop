import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AIタスクジェネレーター',
  description: 'Next.jsで作成したAIタスク生成アプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-gradient-metallic">
        {children}
      </body>
    </html>
  )
}
