import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { LanguageProvider } from './context/language-context'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
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
    default: 'ShowTime | Production Control',
    template: '%s | ShowTime'
  },
  description: 'Pro-grade music promotion dashboard for artist advancement, material tracking, and show logistics management.',
  icons: {
    icon: '/icon.svg',
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
        
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <LanguageProvider>
            <main className="relative z-10 flex min-h-screen flex-col">
              {children}
            </main>
          </LanguageProvider>
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
}

