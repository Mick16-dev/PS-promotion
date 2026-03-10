'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'de'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'header.emergency': 'Emergency 24/7',
    'header.logo': 'Rohr-Blitz',

    // Hero
    'hero.badge': 'Local emergency plumber',
    'hero.title': 'Burst pipe? Blocked drain? We fix it today.',
    'hero.subtitle': 'A small team of experienced plumbers for Berlin and surrounding areas. We arrive quickly, give clear prices before we start, and leave your home clean again.',

    // Diagnostic Funnel
    'funnel.step1.title': 'Upload Photo',
    'funnel.step1.desc': 'Drag & drop or click to upload',
    'funnel.step1.formats': 'JPG, PNG up to 10MB',
    'funnel.step2.title': 'Select Issue Type',
    'funnel.step3.title': 'Severity Level',
    'funnel.step3.desc': 'How urgent is your issue?',
    'funnel.step4.title': 'Your Information',
    'funnel.cta': 'Get Free Estimate',
    'funnel.success.title': 'Estimate Submitted!',
    'funnel.success.desc': 'A certified technician is reviewing your case.',
    'funnel.success.eta': 'Expected callback within',

    // Issue Categories
    'issue.leaking': 'Leaking Pipe',
    'issue.clogged': 'Clogged Drain',
    'issue.broken': 'Broken Fixture',
    'issue.installation': 'New Installation',

    // Severity
    'severity.1': 'Minor',
    'severity.2': 'Moderate',
    'severity.3': 'Significant',
    'severity.4': 'Severe',
    'severity.5': 'Emergency',

    // Form
    'form.name': 'Full Name',
    'form.phone': 'Phone Number',
    'form.email': 'Email Address',
    'form.address': 'Address',

    // Gallery
    'gallery.title': 'Before & After Transformations',
    'gallery.subtitle': 'See the quality of our master plumbing work',
    'gallery.cta': 'Start Your Diagnosis',

    // Testimonials
    'testimonials.title': 'What Our Customers Say',
    'testimonials.verified': 'Verified Customer',

    // Trust
    'trust.title': 'Trusted by Thousands',
    'trust.response': '30 min average response',
    'trust.certified': 'Certified Technicians',
    'trust.guarantee': 'Satisfaction Guarantee',
    'trust.insurance': 'Fully Insured',

    // Features Section
    'features.badge': 'Our services',
    'features.title': 'What we help you with',
    'features.subtitle': 'From leaking pipes to complete bathroom repairs – we solve everyday plumbing problems quickly and without drama.',
    'features.painPoint': 'The Problem',
    'features.solution': 'Our Solution',

    // Services Pillars (renamed but keep keys)
    'features.expert-diagnosis.title': 'Typical emergencies we handle',
    'features.expert-diagnosis.tagline': 'Quick help when something suddenly breaks',
    'features.expert-diagnosis.pain': 'Water running where it should not, toilet not flushing, or a drain that simply will not empty – most problems start small and suddenly become urgent.',
    'features.expert-diagnosis.solution': 'You call us, tell us in a few words what happened, and we send a plumber who is used to exactly these everyday emergencies.',
    'features.expert-diagnosis.benefit1': 'Leaking pipes, dripping taps and burst flexible hoses',
    'features.expert-diagnosis.benefit2': 'Blocked toilets, showers and kitchen sinks',
    'features.expert-diagnosis.benefit3': 'No water pressure, cold water only or strange noises',

    'features.time-cost.title': 'Clear prices before we start',
    'features.time-cost.tagline': 'You always know what it will roughly cost',
    'features.time-cost.pain': 'Many people are afraid of calling a plumber because they have heard stories about huge bills after the work is done.',
    'features.time-cost.solution': 'On the phone we ask a few simple questions and give you a realistic price range. On site we explain again what we plan to do and what it will cost.',
    'features.time-cost.benefit1': 'Arrival, labour and material explained in plain language',
    'features.time-cost.benefit2': 'No work without your agreement to the price range',
    'features.time-cost.benefit3': 'If something unexpected appears, we talk to you first',

    'features.reliability.title': 'Reliable small team',
    'features.reliability.tagline': 'The same faces, not a call centre',
    'features.reliability.pain': 'Online platforms often send changing subcontractors that you never see again.',
    'features.reliability.solution': 'With Rohr-Blitz you speak directly to our own plumbers. We plan the jobs ourselves and come with our own tools and materials.',
    'features.reliability.benefit1': 'Fixed contact persons who know your flat or house',
    'features.reliability.benefit2': 'We arrive on time or call if we are running late',
    'features.reliability.benefit3': 'We protect floors and furniture and clean up afterwards',

    // Simple process explanation
    'features.howItWorks': 'How a visit works',
    'features.learnMore': 'More about our team',
    'features.masterDeepDive.title': 'From phone call to finished job',
    'features.masterDeepDive.step1.title': 'You call or send a message',
    'features.masterDeepDive.step1.desc': 'You briefly describe the problem and, if you like, send us a photo via email or messenger.',
    'features.masterDeepDive.step2.title': 'We give you a time and price frame',
    'features.masterDeepDive.step2.desc': 'We tell you when we can come and what it will roughly cost, including arrival and material.',
    'features.masterDeepDive.step3.title': 'We repair on site',
    'features.masterDeepDive.step3.desc': 'Our plumber checks everything again, explains the options and then repairs the damage.',
    'features.masterDeepDive.step4.title': 'You get a clean bathroom back',
    'features.masterDeepDive.step4.desc': 'We test everything with you, write the invoice and take the rubbish with us.',

    // Results Stats
    'features.results.title': 'Real Results, Real Savings',
    'features.results.diagnosis': 'Avg. diagnosis time',
    'features.results.savings': 'Cost savings vs. traditional',
    'features.results.accuracy': 'Diagnosis accuracy',
    'features.results.satisfaction': 'Customer rating',
    'features.cta': 'Try Master Diagnosis Free',
    'features.ctaSubtext': 'No credit card required. Get your estimate in under 5 minutes.',

    // Pricing
    'pricing.title': 'Prices that make sense',
    'pricing.subtitle': 'Fair, clear and explained before we start',
    'pricing.basic': 'Basic',
    'pricing.standard': 'Standard',
    'pricing.premium': 'Premium',
    'pricing.cta': 'Choose Plan',
    'pricing.popular': 'Most Popular',
    'pricing.month': 'month',

    // Services helper text
    'services.commonIssues': 'Typical plumbing problems',
    'services.leaks': 'Leaking pipes, taps and radiators',
    'services.blocks': 'Blocked toilets, showers and kitchen sinks',
    'services.heating': 'Problems with hot water and heating',
    'services.emergency': 'Emergency water damage and burst pipes',
    'services.projects': 'Planned work and renovations',
    'services.bathroom': 'Bathroom modernisation and new fittings',
    'services.kitchen': 'Kitchen sinks, dishwashers and washing machines',
    'services.replacement': 'Replacement of old pipe sections and fittings',
    'services.checks': 'Checking existing installations before buying or renting',

    // FAQ
    'faq.title': 'Questions we hear a lot',
    'faq.cta': 'Ask a question',
    'faq.moreHelpTitle': "Can't find what you need?",

    // Footer
    'footer.cta': 'Request a plumber now',
    'footer.contact': 'Contact Us',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.imprint': 'Imprint',
  },
  de: {
    // Header
    'header.emergency': 'Notdienst 24/7',
    'header.logo': 'Rohr-Blitz',

    // Hero
    'hero.badge': 'Lokaler Sanitär-Notdienst',
    'hero.title': 'Rohrbruch? Toilette verstopft? Wir kommen heute noch.',
    'hero.subtitle': 'Kleines eingespieltes Team aus erfahrenen Installateuren in Berlin und Umgebung. Wir kommen schnell, sprechen Preise offen an und hinterlassen alles sauber.',

    // Diagnostic Funnel
    'funnel.step1.title': 'Foto hochladen',
    'funnel.step1.desc': 'Ziehen & ablegen oder klicken',
    'funnel.step1.formats': 'JPG, PNG bis 10MB',
    'funnel.step2.title': 'Problemart wählen',
    'funnel.step3.title': 'Dringlichkeitsstufe',
    'funnel.step3.desc': 'Wie dringend ist Ihr Problem?',
    'funnel.step4.title': 'Ihre Daten',
    'funnel.cta': 'Kostenlose Schätzung',
    'funnel.success.title': 'Anfrage gesendet!',
    'funnel.success.desc': 'Ein zertifizierter Techniker prüft Ihren Fall.',
    'funnel.success.eta': 'Erwarteter Rückruf innerhalb',

    // Issue Categories
    'issue.leaking': 'Undichtes Rohr',
    'issue.clogged': 'Verstopfter Abfluss',
    'issue.broken': 'Defekte Armatur',
    'issue.installation': 'Neuinstallation',

    // Severity
    'severity.1': 'Gering',
    'severity.2': 'Mäßig',
    'severity.3': 'Erheblich',
    'severity.4': 'Schwer',
    'severity.5': 'Notfall',

    // Form
    'form.name': 'Vollständiger Name',
    'form.phone': 'Telefonnummer',
    'form.email': 'E-Mail-Adresse',
    'form.address': 'Adresse',

    // Gallery
    'gallery.title': 'Vorher & Nachher',
    'gallery.subtitle': 'Sehen Sie die Qualität unserer Meisterarbeit',
    'gallery.cta': 'Diagnose starten',

    // Testimonials
    'testimonials.title': 'Kundenstimmen',
    'testimonials.verified': 'Verifizierter Kunde',

    // Trust
    'trust.title': 'Von Tausenden vertraut',
    'trust.response': '30 Min. durchschnittliche Reaktionszeit',
    'trust.certified': 'Zertifizierte Techniker',
    'trust.guarantee': 'Zufriedenheitsgarantie',
    'trust.insurance': 'Vollversichert',

    // Features Section
    'features.badge': 'Unsere Leistungen',
    'features.title': 'Wobei wir Ihnen helfen',
    'features.subtitle': 'Von der tropfenden Armatur bis zum vollgelaufenen Keller – wir lösen typische Sanitärprobleme zuverlässig und ohne großes Theater.',
    'features.painPoint': 'Das Problem',
    'features.solution': 'Unsere Lösung',

    // Services Pillars (renamed but keep keys)
    'features.expert-diagnosis.title': 'Typische Notfälle, die wir lösen',
    'features.expert-diagnosis.tagline': 'Schnelle Hilfe, wenn etwas plötzlich kaputtgeht',
    'features.expert-diagnosis.pain': 'Wasser läuft, wo es nicht soll, die Toilette spült nicht mehr oder der Abfluss ist komplett dicht – die meisten Probleme kommen plötzlich.',
    'features.expert-diagnosis.solution': 'Sie rufen an, schildern kurz die Situation, und wir schicken einen Monteur, der diese Alltagseinsätze gewohnt ist.',
    'features.expert-diagnosis.benefit1': 'Undichte Leitungen, tropfende Hähne und geplatzte Schläuche',
    'features.expert-diagnosis.benefit2': 'Verstopfte Toiletten, Duschen und Spülen',
    'features.expert-diagnosis.benefit3': 'Probleme mit Wasserdruck, Temperatur oder Geräuschen',

    'features.time-cost.title': 'Klare Preise vor Arbeitsbeginn',
    'features.time-cost.tagline': 'Sie wissen vorher, womit Sie rechnen müssen',
    'features.time-cost.pain': 'Viele trauen sich nicht, den Klempner zu rufen, weil sie Angst vor einer hohen Rechnung im Nachhinein haben.',
    'features.time-cost.solution': 'Am Telefon stellen wir ein paar einfache Fragen und nennen eine realistische Preisspanne. Vor Ort erklären wir noch einmal, was gemacht wird und was es kostet.',
    'features.time-cost.benefit1': 'Anfahrt, Arbeit und Material verständlich erklärt',
    'features.time-cost.benefit2': 'Keine Arbeiten ohne Ihr Okay zum Kostenrahmen',
    'features.time-cost.benefit3': 'Bei unerwarteten Zusatzarbeiten sprechen wir zuerst mit Ihnen',

    'features.reliability.title': 'Zuverlässiges kleines Team',
    'features.reliability.tagline': 'Bekannte Gesichter statt Callcenter',
    'features.reliability.pain': 'Online-Plattformen schicken oft ständig wechselnde Subunternehmer, die man nie wieder sieht.',
    'features.reliability.solution': 'Bei Rohr-Blitz sprechen Sie direkt mit unseren eigenen Monteuren. Wir planen die Einsätze selbst und kommen mit eigenem Werkzeug und Material.',
    'features.reliability.benefit1': 'Feste Ansprechpartner, die Ihre Wohnung oder Ihr Haus kennen',
    'features.reliability.benefit2': 'Wir kommen pünktlich oder melden uns bei Verzögerung',
    'features.reliability.benefit3': 'Wir schützen Böden und Möbel und räumen danach auf',

    // Simple process explanation
    'features.howItWorks': 'So läuft ein Einsatz ab',
    'features.learnMore': 'Mehr über unser Team',
    'features.masterDeepDive.title': 'Vom Anruf bis zur sauberen Übergabe',
    'features.masterDeepDive.step1.title': 'Sie rufen an oder schreiben',
    'features.masterDeepDive.step1.desc': 'Sie schildern kurz das Problem und können uns auf Wunsch ein Foto schicken.',
    'features.masterDeepDive.step2.title': 'Wir nennen Zeit und groben Preis',
    'features.masterDeepDive.step2.desc': 'Wir sagen, wann wir kommen können und mit welchen Kosten Sie ungefähr rechnen müssen – inklusive Anfahrt.',
    'features.masterDeepDive.step3.title': 'Reparatur vor Ort',
    'features.masterDeepDive.step3.desc': 'Unser Monteur prüft alles, erklärt Ihnen die Schritte und behebt den Schaden.',
    'features.masterDeepDive.step4.title': 'Gemeinsame Kontrolle & Rechnung',
    'features.masterDeepDive.step4.desc': 'Wir testen alles gemeinsam, stellen die Rechnung aus und nehmen Verpackung und Altteile mit.',

    // Results Stats
    'features.results.title': 'Echte Ergebnisse, echte Ersparnisse',
    'features.results.diagnosis': 'Durchschn. Diagnosezeit',
    'features.results.savings': 'Ersparnis vs. traditionell',
    'features.results.accuracy': 'Diagnosegenauigkeit',
    'features.results.satisfaction': 'Kundenbewertung',
    'features.cta': 'Meister-Diagnose kostenlos testen',
    'features.ctaSubtext': 'Keine Kreditkarte erforderlich. Schätzung in unter 5 Minuten.',

    // Pricing
    'pricing.title': 'Preise, die nachvollziehbar sind',
    'pricing.subtitle': 'Fair, offen kommuniziert und ohne versteckte Kosten',
    'pricing.basic': 'Basis',
    'pricing.standard': 'Standard',
    'pricing.premium': 'Premium',
    'pricing.cta': 'Plan wählen',
    'pricing.popular': 'Beliebteste',
    'pricing.month': 'Monat',

    // Services helper text
    'services.commonIssues': 'Typische Sanitärprobleme',
    'services.leaks': 'Undichte Leitungen, tropfende Hähne und Heizkörper',
    'services.blocks': 'Verstopfte Toiletten, Duschen und Küchenspülen',
    'services.heating': 'Probleme mit Warmwasser und Heizung',
    'services.emergency': 'Wasserschäden und Rohrbrüche im Notfall',
    'services.projects': 'Geplante Arbeiten und Renovierungen',
    'services.bathroom': 'Badmodernisierung und neue Armaturen',
    'services.kitchen': 'Küchenspülen, Geschirrspüler und Waschmaschinen',
    'services.replacement': 'Erneuerung alter Rohrabschnitte und Armaturen',
    'services.checks': 'Überprüfung bestehender Anlagen vor Kauf oder Miete',

    // FAQ
    'faq.title': 'Fragen, die uns oft gestellt werden',
    'faq.cta': 'Frage stellen',
    'faq.moreHelpTitle': 'Nicht das Richtige gefunden?',

    // Footer
    'footer.cta': 'Jetzt Klempner anfragen',
    'footer.contact': 'Kontakt',
    'footer.legal': 'Rechtliches',
    'footer.privacy': 'Datenschutz',
    'footer.terms': 'AGB',
    'footer.imprint': 'Impressum',
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const stored = localStorage.getItem('rohr-blitz-lang') as Language | null
    if (stored && (stored === 'en' || stored === 'de')) {
      setLanguageState(stored)
    } else {
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith('de')) {
        setLanguageState('de')
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('rohr-blitz-lang', lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
