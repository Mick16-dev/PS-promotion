import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from './context/language-context'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#0B0F14',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'Rotek Rohrreinigungsdienst | Bremen & Verden | Seit 1972',
    template: '%s | Rotek Bremen',
  },
  description:
    'Fachbetrieb für Rohrreinigung, Kanalreinigung und Kanalsanierung. 24-Stunden Notdienst. Bayernstr. 172, Bremen-Walle. Rotek Rohrreinigungsdienst GmbH.',
  keywords: [
    'Rohrreinigung',
    'Kanalreinigung',
    'Rotek',
    'Bremen',
    'Verden',
    '24h Notdienst',
    'Kanal-TV',
    'Dichtheitsprüfung',
    'Kanalsanierung',
    'Hebeanlagen',
    'Fettabscheider',
  ],
  authors: [{ name: 'Rotek Rohrreinigungsdienst GmbH' }],
  creator: 'Rotek Rohrreinigungsdienst GmbH',
  publisher: 'Rotek Rohrreinigungsdienst GmbH',
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    title: 'Rotek Rohrreinigungsdienst | Bremen & Verden | Seit 1972',
    description: 'Rohrreinigung, Kanalreinigung, Kanal-TV, Dichtheitsprüfung. 24h Notdienst. Bremen-Walle & Verden.',
    url: 'https://rotek.de',
    siteName: 'Rotek Rohrreinigungsdienst',
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rotek Rohrreinigungsdienst | Bremen & Verden',
    description: 'Rohrreinigung, Kanalreinigung, 24h Notdienst. Seit 1972.',
  },
  icons: {
    icon: [{ url: '/logo-custom.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/logo-custom.svg', sizes: '180x180', type: 'image/svg+xml' }],
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Rotek Rohrreinigungsdienst GmbH',
  image: 'https://rotek.de/wp-content/uploads/2021/04/Logo-Rotek.png',
  '@id': 'https://rotek.de',
  url: 'https://rotek.de',
  telephone: '+49 421 391714',
  priceRange: '€€',
  address: [
    {
      '@type': 'PostalAddress',
      streetAddress: 'Bayernstr. 172',
      addressLocality: 'Bremen',
      addressRegion: 'Bremen-Walle',
      postalCode: '28219',
      addressCountry: 'DE',
    },
    {
      '@type': 'PostalAddress',
      streetAddress: 'Conrad-Wode-Straße 1',
      addressLocality: 'Verden',
      postalCode: '27283',
      addressCountry: 'DE',
    },
  ],
  geo: { '@type': 'GeoCoordinates', latitude: 53.1078, longitude: 8.7953 },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  },
  areaServed: [
    { '@type': 'City', name: 'Bremen' },
    { '@type': 'AdministrativeArea', name: 'Walle' },
    { '@type': 'AdministrativeArea', name: 'Findorff' },
    { '@type': 'AdministrativeArea', name: 'Horn' },
    { '@type': 'AdministrativeArea', name: 'Neustadt' },
    { '@type': 'City', name: 'Verden' },
  ],
  foundingDate: '1972',
  numberOfEmployees: 32,
  slogan: 'Alles rund ums Rohr',
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
      <body className="font-sans antialiased selection:bg-primary/20 selection:text-primary-foreground overflow-x-hidden text-base">
        <LanguageProvider>
          <AeoSchema />
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
