import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { LanguageProvider } from './context/language-context'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"], 
  variable: '--font-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#D70014',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'Rotek | Industrielle Rohrreinigung & TV-Untersuchung seit 1972',
    template: '%s | Rotek'
  },
  description: 'Zertifizierter Fachbetrieb für Kanalreinigung, TV-Untersuchung und Rohrortung in Bremen & Verden. Industrieller Standard für private & gewerbliche Abwassersysteme.',
  keywords: ['Kanalreinigung Bremen', 'TV-Untersuchung', 'Rohrreinigung', 'Rotek', 'Abwassertechnik', 'Verstopfung beseitigen', 'Bremen-Walle', 'Dichtheitsprüfung', 'Meisterbetrieb'],
  authors: [{ name: 'Rotek Industrietechnik' }],
  creator: 'Rotek Engineering',
  publisher: 'Rotek',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Rotek | Expert Industrial Wastewater Engineering',
    description: 'Instant technical pipe diagnosis and expert repair service. Available 24/7 in Bremen & Umzu.',
    url: 'https://rotek.de',
    siteName: 'Rotek',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1541888941293-1e8fbf3d12c8?w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'Rotek Industrial Engineering',
      },
    ],
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rotek | Industrial Wastewater Engineering',
    description: 'Bespoke Technical Diagnosis & Expert Engineering. Since 1972.',
    images: ['https://images.unsplash.com/photo-1541888941293-1e8fbf3d12c8?w=1200&h=630&q=80'],
    creator: '@rotek_bremen',
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
  "name": "Rotek GmbH & Co. KG",
  "image": "https://images.unsplash.com/photo-1541888941293-1e8fbf3d12c8?w=1200&h=630&q=80",
  "@id": "https://rotek.de",
  "url": "https://rotek.de",
  "telephone": "+49421391714",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Bayernstr. 172",
    "addressLocality": "Bremen",
    "postalCode": "28219",
    "addressCountry": "DE"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 53.0989,
    "longitude": 8.7845
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
    { "@type": "City", "name": "Bremen" },
    { "@type": "City", "name": "Verden" },
    { "@type": "District", "name": "Bremen-Walle" },
    { "@type": "District", "name": "Bremen-Findorff" },
    { "@type": "District", "name": "Bremen-Horn" }
  ]
}

import { AeoSchema } from '@/components/aeo-schema'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={`${inter.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased selection:bg-red-600 selection:text-white overflow-x-hidden text-base sm:text-lg bg-[#0A0B0D]">
        <LanguageProvider>
          <AeoSchema />
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
