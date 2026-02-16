import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Threat Engine | Geopolitical Monitor',
  description: 'Real-time geopolitical risk analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, padding: 0, backgroundColor: 'black' }}>
        {children}
      </body>
    </html>
  )
}
