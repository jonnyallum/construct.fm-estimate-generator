import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Construct FM — Estimate Generator',
  description: 'Internal estimate generator for Construct FM. Build accurate quotes from verified rate cards.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
