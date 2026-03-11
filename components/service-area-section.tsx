'use client'

import { useLanguage } from '@/app/context/language-context'

export function ServiceAreaSection() {
  const { language } = useLanguage()

  const areas =
    language === 'de'
      ? ['Berlin-Mitte', 'Prenzlauer Berg', 'Friedrichshain / Kreuzberg', 'Neukölln', 'Charlottenburg / Wilmersdorf', 'Umgebung nach Absprache']
      : ['Berlin-Mitte', 'Prenzlauer Berg', 'Friedrichshain / Kreuzberg', 'Neukölln', 'Charlottenburg / Wilmersdorf', 'Surrounding area on request']

  return (
    <section id="areas" className="py-24 px-4 bg-muted/20">
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
          {language === 'de' ? 'Unser Einsatzgebiet' : 'Where we work'}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {language === 'de'
            ? 'Wir sind hauptsächlich in Berlin und der direkten Umgebung unterwegs. Für größere Projekte fahren wir nach Absprache auch ein Stück weiter.'
            : 'We mainly work in Berlin and the nearby surroundings. For larger projects we are happy to drive a bit further after a quick call.'}
        </p>
        <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-sm text-foreground">
          {areas.map((area) => (
            <li key={area}>- {area}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

