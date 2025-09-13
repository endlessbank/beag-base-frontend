import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Layout/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'My SaaS App',
  description: 'Built with Beag.io',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Beag script tag - MUST be in head */}
        <script type="module" src="/beag.js" defer></script>
      </head>
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  )
}