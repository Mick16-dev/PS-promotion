import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"], 
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'PS-promotion | ShowReady Dashboard',
    template: '%s | PS-promotion'
  },
  description: 'Professional music promoter dashboard for managing artists, shows, and materials with high-performance tracking.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} scroll-smooth dark`}>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen selection:bg-primary/30 selection:text-white">
        {/* Ambient Lumina Effect Layer */}
        <div className="fixed inset-0 pointer-events-none lumina-glow opacity-50 z-0" />
        
        <main className="relative z-10 flex min-h-screen flex-col">
          {children}
        </main>
      </body>
    </html>
  )
}

