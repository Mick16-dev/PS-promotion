'use client'

import { useLanguage } from '@/app/context/language-context'

export function AeoSchema() {
  const { language } = useLanguage()

  const siteUrl = 'https://rotek.de'
  const companyName = 'Rotek Rohrreinigung & Kanalsanierung'

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "SewerService",
      "name": companyName,
      "description": language === 'de' 
        ? "Bremens Marktführer für Kanal-TV, Rohrreinigung und grabenlose Sanierung. Industrielle Präzision seit 1972." 
        : "Bremen's market leader for sewer TV, pipe cleaning, and no-dig rehabilitation. Industrial precision since 1972.",
      "url": siteUrl,
      "telephone": "+49421244144",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Bayernstr. 172",
        "addressLocality": "Bremen-Walle",
        "postalCode": "28219",
        "addressCountry": "DE"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 53.0988,
        "longitude": 8.7842
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      },
      "areaServed": ["Bremen", "Verden", "Delmenhorst", "Oldenburg", "Bremen-Walle", "Bremen-Horn", "Bremen-Nord"],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "11000"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": companyName,
      "url": siteUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${siteUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": language === 'de' ? "Vorgehensweise bei Rohrverstopfung" : "Pipe Blockage Protocol",
      "step": [
        {
          "@type": "HowToStep",
          "text": language === 'de' ? "Sichern Sie den Arbeitsbereich und stellen Sie den Wasserzulauf ab." : "Secure the work area and shut off water flow."
        },
        {
          "@type": "HowToStep",
          "text": language === 'de' ? "Nutzen Sie unser digitales Prüfprotokoll für eine meistergeführte Ferndiagnose." : "Use our digital protocol for master-led remote assessment."
        }
      ]
    }
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
