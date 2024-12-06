import Head from 'next/head'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>My Next.js App</title>
        <meta name="description" content="Next.jsで作成したアプリケーション" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Next.jsへようこそ！
        </h1>
        <p className="text-gray-600">
          このアプリケーションはNext.js、TypeScript、Tailwind CSSで構築されています。
        </p>
      </main>
    </div>
  )
} 