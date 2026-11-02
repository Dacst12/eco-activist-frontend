import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
})

export const metadata: Metadata = {
  title: 'Эко Активист',
  description: 'Экологические мероприятия рядом с вами',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={manrope.variable}>
      <body className="bg-page text-foreground font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
