'use client'

import { useLanguage } from '@/app/context/language-context'

export function AeoSchema() {
  const { language } = useLanguage()

  const siteUrl = 'https://rotek.de'
  const companyName = 'Rotek Rohrreinigungsdienst GmbH'

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: companyName,
      description:
        language === 'de'
          ? 'Rohrreinigung, Kanalreinigung, Kanal-TV, Dichtheitsprüfung, Kanalsanierung. Seit 1972. 24-Stunden Notdienst. Bremen & Verden.'
          : 'Pipe cleaning, sewer cleaning, CCTV inspection, tightness testing, sewer rehabilitation. Since 1972. 24-hour emergency service. Bremen & Verden.',
      url: siteUrl,
      telephone: '+49 421 391714',
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
      areaServed: ['Bremen', 'Verden', 'Walle', 'Findorff', 'Horn', 'Neustadt'],
      foundingDate: '1972',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: companyName,
      url: siteUrl,
    },
  ]

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
