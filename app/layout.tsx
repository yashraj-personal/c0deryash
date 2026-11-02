import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, Caveat, DM_Serif_Display, Geist, Playfair_Display, Space_Mono } from 'next/font/google'
import './globals.css'
import { ActivityLogger } from '@/components/activity-logger'

const serif = DM_Serif_Display({ subsets: ['latin'], weight: '400', variable: '--font-dm-serif' })
const sans = Geist({ subsets: ['latin'], variable: '--font-geist' })
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
})
const caveat = Caveat({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-caveat' })
const bebas = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--font-bebas' })
const mono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-space-mono' })

export const metadata: Metadata = {
  metadataBase: new URL('https://c0deryash.vercel.app'),
  title: 'type garden — type anything, watch it bloom',
  description: 'A playful typographic garden and text motion studio by YASH RAJ. Grow words, design posters, and export animated match cuts.',
  authors: [{ name: 'YASH RAJ', url: 'https://www.instagram.com/c0deryash/' }],
  creator: 'YASH RAJ',
  keywords: ['type garden', 'typography tool', 'text animation', 'match cut', 'YASH RAJ'],
  openGraph: { title: 'type garden — write c0de ryash', description: 'Grow words into flowers and make expressive text motion.', type: 'website', siteName: 'type garden' },
  twitter: { card: 'summary_large_image', title: 'type garden — write c0de ryash', description: 'A playful typographic garden and text motion studio.' },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#f3d4d9',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${playfair.variable} ${caveat.variable} ${bebas.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">{children}<ActivityLogger /></body>
    </html>
  )
}
