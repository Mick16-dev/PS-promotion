import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Outfit } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from './context/language-context'
import './globals.css'

const bricolage = Bricolage_Grotesque({ 
  subsets: ["latin"], 
  variable: '--font-heading',
  display: 'swap',
});

const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: '--font-body',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#1E3A5F',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'Rohr-Blitz | Master Expert Plumbing Diagnosis & Repair',
    template: '%s | Rohr-Blitz'
  },
  description: 'Experience the future of home maintenance. Instant visual diagnosis, 24/7 premium emergency service, and transparent estimates in seconds with Rohr-Blitz Master Technicians.',
  keywords: ['plumbing', 'master diagnosis', 'emergency plumber', 'Germany', 'home repair', 'Rohr-Blitz', 'leak detection', 'clogged drain repair', 'pipe burst service', 'Meisterbetrieb'],
  authors: [{ name: 'Rohr-Blitz Engineering' }],
  creator: 'Rohr-Blitz Engineering',
  publisher: 'Rohr-Blitz',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Rohr-Blitz | Expert Master Plumbing',
    description: 'Instant visual plumbing diagnosis and expert repair service. Available 24/7.',
    url: 'https://rohr-blitz.de',
    siteName: 'Rohr-Blitz',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200&h=630',
        width: 1200,
        height: 630,
        alt: 'Rohr-Blitz Master Expert Engineering',
      },
    ],
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rohr-Blitz | Master Expert Plumbing',
    description: 'Bespoke Plumbing Diagnosis & Expert Engineering. Instant estimates, 24/7 service.',
    images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200&h=630'],
    creator: '@rohrblitz',
  },
  icons: {
    icon: [
      { url: '/logo-custom.svg', type: 'image/svg+xml' },
      { url: '/logo-custom.svg', sizes: '32x32', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/logo-custom.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "PlumbingService",
  "name": "Rohr-Blitz",
  "image": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200&h=630",
  "@id": "https://rohr-blitz.de",
  "url": "https://rohr-blitz.de",
  "telephone": "+49123456789",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Musterstraße 1",
    "addressLocality": "Berlin",
    "postalCode": "10115",
    "addressCountry": "DE"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 52.5200,
    "longitude": 13.4050
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ],
    "opens": "00:00",
    "closes": "23:59"
  },
  "areaServed": [
    { "@type": "City", "name": "Berlin" },
    { "@type": "City", "name": "Munich" },
    { "@type": "City", "name": "Hamburg" },
    { "@type": "City", "name": "Frankfurt" },
    { "@type": "City", "name": "Cologne" }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Plumbing Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Emergency Leak Repair"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Pipe Diagnostic Analysis"
        }
      }
    ]
  }
}

import { AeoSchema } from '@/components/aeo-schema'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={`${bricolage.variable} ${outfit.variable} scroll-smooth`}>
      <head>
        <AeoSchema />
      </head>
      <body className="font-body antialiased selection:bg-secondary/30 selection:text-secondary-foreground overflow-x-hidden text-base sm:text-lg">
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
