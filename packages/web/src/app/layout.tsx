import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'L1sload Oracle',
  description: 'Layer 1 blockchain data oracle and token staking platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-purple-900 p-4">
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="text-white hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/staking" className="text-white hover:text-gray-300">
                Staking
              </Link>
            </li>
          </ul>
        </nav>
        {children}
      </body>
    </html>
  )
}