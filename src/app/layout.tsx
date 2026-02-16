import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'THREAT_ENGINE | v1.0',
  description: 'Geopolitical Risk Analysis Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="bg-black text-green-500">{children}</body>
    </html>
  )
}
