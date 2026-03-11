'use client'

import { useLanguage } from '@/app/context/language-context'

export function AboutSection() {
  const { language } = useLanguage()

  return (
    <section id="about" className="py-24 px-4 bg-background">
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
          {language === 'de'
            ? 'Wer hinter Rohr-Blitz steckt'
            : 'Who is behind Rohr-Blitz'}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {language === 'de'
            ? 'Rohr-Blitz ist ein kleiner Sanitärbetrieb aus der Region, kein anonymer Online-Vermittler. Wir kennen unsere Kunden oft seit vielen Jahren und werden häufig im Freundes- und Bekanntenkreis weiterempfohlen.'
            : 'Rohr-Blitz is a small local plumbing business, not an anonymous online platform. Many of our customers have known us for years and recommend us to friends and neighbours.'}
        </p>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {language === 'de'
            ? 'Uns ist wichtig, dass Sie wissen, wer zu Ihnen nach Hause kommt. Deshalb sprechen Sie direkt mit uns, nicht mit einem Callcenter. Wir sagen offen, was möglich ist, was es ungefähr kostet und wann wir bei Ihnen sein können.'
            : 'We think it is important that you know who comes into your home. That is why you speak directly to us, not to a call centre. We are open about what is possible, what it will roughly cost and when we can be with you.'}
        </p>
      </div>
    </section>
  )
}

