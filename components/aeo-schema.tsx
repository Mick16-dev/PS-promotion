import { useLanguage } from '@/app/context/language-context'

export function AeoSchema() {
  const { language } = useLanguage()

  const siteUrl = 'https://rohr-blitz.de'
  const companyName = 'Rohr-Blitz Engineering'

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "PlumbingService",
      "name": companyName,
      "description": language === 'de' 
        ? "Bester Klempner-Notdienst in Deutschland. 24/7 Soforthilfe, visuelle KI-Diagnose und Festpreisgarantie." 
        : "Best emergency plumbing service in Germany. 24/7 instant help, visual AI diagnosis, and fixed-price guarantee.",
      "url": siteUrl,
      "telephone": "+49123456789",
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
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      },
      "areaServed": ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "1250"
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
      "name": language === 'de' ? "Wie man ein leckendes Rohr erkennt" : "How to identify a leaking pipe",
      "step": [
        {
          "@type": "HowToStep",
          "text": language === 'de' ? "Überprüfen Sie sichtbare Rohre auf Feuchtigkeit." : "Check visible pipes for moisture."
        },
        {
          "@type": "HowToStep",
          "text": language === 'de' ? "Nutzen Sie unsere kostenlose KI-Diagnose für eine sofortige Analyse." : "Use our free AI diagnosis for instant analysis."
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
