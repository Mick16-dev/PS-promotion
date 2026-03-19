'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

type Language = 'en' | 'de'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.services': 'Services',
    'nav.testimonials': 'Cases',
    'nav.pricing': 'Pricing',
    'nav.faq': 'FAQ',
    'nav.emergency': 'Emergency Protocol',
    'nav.about': 'About Us',

    // Hero Section
    'hero.badge': 'Industrial Precision Since 1972',
    'hero.title': 'MASTER VISUAL SERVICE',
    'hero.subtitle': 'Bespoke Technical Diagnosis & Expert Engineering. Submit your disruption for immediate master-led verification at Central Walle.',
    'hero.cta': 'Initiate Master Visual Review',
    'hero.emergency': 'Emergency Protocol',
    'hero.diagnose': 'Analyze Disruption',
    'hero.calculate': 'Initiate Master Visual Review',
    'hero.diagnosisInProgress': 'Master Protocol Verification',
    'hero.diagnosing': 'Synchronizing with Central Walle Dispatch...',
    'hero.encrypted': 'AES-256 Encrypted',
    'hero.gdpr': 'GDPR Data Compliance',
    'hero.masterEstimate': 'Master Technical Estimate',

    // Trust
    'trust.title': 'Industrial Excellence',
    'trust.response': '30 min average response',
    'trust.certified': 'Certified Technicians',
    'trust.guarantee': 'Satisfaction Guarantee',
    'trust.insurance': 'Fully Insured',
    'trust.badge': 'The Gold Standard',

    // Features Section
    'features.badge': 'Why Choose Rotek',
    'features.title': 'Why Choose Rotek Industrial?',
    'features.subtitle': '50 years of German engineering in wastewater management. No subcontractors, no compromises. Only where Rotek is written on the truck, Rotek quality is inside.',
    'features.painPoint': 'The Problem',
    'features.solution': 'Our Solution',

    // Master Review Pillar
    'features.expert-diagnosis.title': '3D Sewer TV Inspection',
    'features.expert-diagnosis.tagline': 'Wir machen schmutzige Filme',
    'features.expert-diagnosis.pain': 'Traditional inspections often miss hairline fractures or root intrusions that cause recurring blockages.',
    'features.expert-diagnosis.solution': 'Our high-tech 360° panorama cameras provide digital 3D data acquisition according to ISYBAU standards for a complete technical view.',
    'features.expert-diagnosis.benefit1': 'Full 3D digital mapping of your pipe system',
    'features.expert-diagnosis.benefit2': 'Satellite cameras for branch/lateral inspection',
    'features.expert-diagnosis.benefit3': 'Official documentation for municipal/insurance use',

    // Time & Cost Pillar
    'features.time-cost.title': 'Time & Cost Savings',
    'features.time-cost.tagline': 'No wasted hours or surprise invoices',
    'features.time-cost.pain': 'Emergency plumber calls average €150-300 just for showing up, plus hourly rates and markup on parts.',
    'features.time-cost.solution': 'Get an upfront estimate before any technician arrives. Know the exact cost range, timeline, and what you\'re paying for.',
    'features.time-cost.benefit1': 'Save 40% on average vs. traditional emergency call-outs',
    'features.time-cost.benefit2': 'Transparent pricing with no hidden fees or surprise charges',
    'features.time-cost.benefit3': 'Skip the diagnostic fee entirely with our remote pre-assessment',

    // Reliability Pillar
    'features.reliability.title': 'Reliability & Support',
    'features.reliability.tagline': '24/7 availability with guaranteed workmanship',
    'features.reliability.pain': 'Most plumbers are booked days out, and weekend or night calls cost double. Warranties are often unclear or non-existent.',
    'features.reliability.solution': 'Our team of 32 certified technicians ensures same-day availability. Every job includes a multi-year workmanship guarantee.',
    'features.reliability.benefit1': '30-minute average response time for emergencies',
    'features.reliability.benefit2': 'Multi-year warranty on all repairs with no fine print',
    'features.reliability.benefit3': 'Background-checked, licensed, and fully insured technicians',

    // Master Deep Dive
    'features.howItWorks': 'The Precision Process',
    'features.learnMore': 'Learn more',
    'features.step': 'Step',
    'features.masterDeepDive.title': 'From Photo to Fixed in 4 Simple Steps',
    'features.masterDeepDive.step1.title': 'Technical Capture',
    'features.masterDeepDive.step1.desc': 'Capture a high-fidelity image of the disruption for our master review protocol.',
    'features.masterDeepDive.step2.title': 'Labor Calculation',
    'features.masterDeepDive.step2.desc': 'Our experts assess accessibility and technical depth to calculate exact labor requirements.',
    'features.masterDeepDive.step3.title': 'Fixed-Price Lock',
    'features.masterDeepDive.step3.desc': 'Receive a technical brief with identified parts and a guaranteed price. No surprises.',
    'features.masterDeepDive.step4.title': 'Precision Execution',
    'features.masterDeepDive.step4.desc': 'A technician is deployed with the exact inventory needed, completing the repair in a single visit.',

    // Results Stats
    'features.results.title': 'Real Results, Real Savings',
    'features.results.diagnosis': 'Avg. diagnosis time',
    'features.results.savings': 'Cost savings vs. traditional',
    'features.results.accuracy': 'Diagnosis accuracy',
    'features.results.satisfaction': 'Customer rating',
    'features.cta': 'Try Master Diagnosis Free',
    'features.ctaSubtext': 'Professional assessment. Get your estimate in under 5 minutes.',

    // Pricing
    'pricing.title': 'Transparent Pricing',
    'pricing.subtitle': 'No hidden fees, no surprises',
    'pricing.basic': 'Basic',
    'pricing.standard': 'Standard',
    'pricing.premium': 'Premium',
    'pricing.cta': 'Choose Plan',
    'pricing.popular': 'Industrial Standard',
    'pricing.month': 'month',
    'pricing.badge': 'Service Plans',

    // Funnel / Contact
    'funnel.step1.title': 'Initiate Master Visual Review',
    'funnel.step1.desc': 'Submit a photo or video of your disruption. Our masters at Central Walle will perform a remote diagnosis and create a technical protocol.',
    'funnel.step2.title': 'Technical Details',
    'funnel.step2.desc': 'Specify the technical scope of the disruption.',
    'funnel.step3.title': 'Contact Info',
    'funnel.step3.desc': 'Where should we deploy our master protocol?',
    'funnel.next': 'Next Phase',
    'funnel.back': 'Previous Phase',
    'funnel.submit': 'Transmit Protocol to Dispatch',
    'funnel.success.title': 'Protocol Transmitted',
    'funnel.success.desc': 'Technical assessment complete. Transmitted to Central Walle. Operations Manager Andreas is preparing Vehicle 4.',
    'funnel.success.eta': 'Standard Deployment Window',

    // Issues
    'issue.leaking': 'Pipe Leak / Burst',
    'issue.clogged': 'Clogged Drain',
    'issue.broken': 'Broken Fixture',
    'issue.installation': 'New Installation',

    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.badge': 'Clear Answers',
    'faq.stillHaveQuestions': 'Still have questions? Chat with our support expert.',

    // Team Page
    'team.title': 'The Rotek Team',
    'team.subtitle': 'Our technicians are experts for complex pipeline networks. Certified, disciplined, and experienced.',
    'team.story.title': 'The Rotek Story',
    'team.story.tagline': 'Industrial Excellence since 1972',
    'team.story.desc': 'Founded 1972 in Bremen, Rotek arose from the necessity for industrial precision in drainage technology. We evolved from classic craftsmanship to a master-led engineering enterprise. Today, we manage the most complex sewer networks in Northern Germany.',
    'team.expertise.title': 'The 4 Pillars of Rotek',
    'team.expertise.1': 'Registered Master Enterprise',
    'team.expertise.2': 'State-Certified Qualifications',
    'team.expertise.3': 'Technical Validation',
    'team.expertise.4': 'Fully Insured',

    // Footer
    'footer.readyFor': 'Ready for Rotek ',
    'footer.goldStandard': 'Industrial Standard',
    'footer.fix': ' Restoration?',
    'footer.experience': 'Experience the future of pipe engineering with professional master diagnostics.',
    'footer.cta': 'Initiate Master Review',
    'footer.premiumPlumbing': 'Premium Pipe Engineering',
    'footer.redefining': 'Specialists for sewer restoration and TV inspection. For over 50 years in Bremen and Verden.',
    'footer.legal': 'LEGAL INFORMATION',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.imprint': 'Imprint / Legal Notice',
    'footer.accreditations': 'ACCREDITATIONS',
    'footer.certifiedMeister': 'MASTER CERTIFIED',
    'footer.emergency': '24/7 EMERGENCY',
    'footer.copyright': '© 2026 Rotek Rohrreinigungsdienst GmbH. Industrial Excellence since 1972.',

    // Services
    'services.kanal-tv.title': '3D Sewer TV Inspection',
    'services.kanal-tv.desc': 'High-resolution 360° diagnostics for pipes from DN 40 to DN 2000. "Wir machen schmutzige Filme".',
    'services.rohrreinigung.title': 'High-Pressure Jetting (24/7)',
    'services.rohrreinigung.desc': 'Mechanical or hydrodynamic cleaning of drainage lines around the clock.',
    'services.fettabscheider.title': 'Grease Trap Service',
    'services.fettabscheider.desc': 'Mandatory emptying and maintenance for industry and gastronomy.',
    'services.kanalsanierung.title': 'Inliner Rehabilitation',
    'services.kanalsanierung.desc': 'Sustainable trenchless restoration. Repair defects without excavation.',
    'services.hebeanlagen.title': 'Lifting Stations / Leak Test',
    'services.hebeanlagen.desc': 'Official function testing and maintenance according to DIN EN 1610 / 1986-30.'
  },
  de: {
    // Navigation
    'nav.services': 'Leistungen',
    'nav.testimonials': 'Einsätze',
    'nav.pricing': 'Preise',
    'nav.faq': 'FAQ',
    'nav.emergency': 'Havariemanagement',
    'nav.about': 'Über uns',

    // Hero Section
    'hero.badge': 'Industrielle Präzision seit 1972',
    'hero.title': 'ROTEK MASTER VISUAL SERVICE',
    'hero.subtitle': 'Bespoke Technische Diagnose & Experten-Engineering. Übermitteln Sie Ihre Störung für eine sofortige Meister-Validierung in der Zentrale Walle.',
    'hero.cta': 'Meister-Video-Diagnose starten',
    'hero.emergency': 'Havariemanagement',
    'hero.diagnose': 'Störung analysieren',
    'hero.calculate': 'Meister-Video-Diagnose starten',
    'hero.diagnosisInProgress': 'Meister-Protokoll-Verifizierung',
    'hero.diagnosing': 'Synchronisierung mit Zentrale Walle...',
    'hero.encrypted': 'AES-256 Verschlüsselt',
    'hero.gdpr': 'DSGVO-Datenschutz',
    'hero.masterEstimate': 'Technisches Meister-Angebot',

    // Trust
    'trust.title': 'Industrielle Exzellenz',
    'trust.response': '30 Min. Reaktionszeit',
    'trust.certified': 'Zertifizierte Techniker',
    'trust.guarantee': 'Zufriedenheitsgarantie',
    'trust.insurance': 'Vollversichert',
    'trust.badge': 'Der Goldstandard',

    // Features Section
    'features.badge': 'Warum Rotek',
    'features.title': 'Warum Rotek Industrietechnik?',
    'features.subtitle': '50 Jahre deutsche Ingenieurskunst in der Abwassertechnik. Keine Subunternehmer, keine Kompromisse. Nur wo Rotek auf dem LKW steht, ist Rotek Qualität drin.',
    'features.painPoint': 'Das Problem',
    'features.solution': 'Unsere Lösung',

    // Master Review Pillar
    'features.expert-diagnosis.title': '3D Kanal-TV-Untersuchung',
    'features.expert-diagnosis.tagline': 'Wir machen schmutzige Filme',
    'features.expert-diagnosis.pain': 'Traditionelle Prüfungen übersehen oft Haarrisse oder Wurzeleinwüchse, die zu wiederkehrenden Verstopfungen führen.',
    'features.expert-diagnosis.solution': 'Unsere 360°-Panoramakameras nach ISYBAU-Standard sorgen für eine vollständige digitale Erfassung des Leitungszustands.',
    'features.expert-diagnosis.benefit1': 'Vollständige digitale 3D-Erfassung des Rohrsystems',
    'features.expert-diagnosis.benefit2': 'Satellitenkameras für Hausanschlussleitungen',
    'features.expert-diagnosis.benefit3': 'Gerichtsfeste Dokumentation für Versicherungen',

    // Time & Cost Pillar
    'features.time-cost.title': 'Zeit- & Kostenersparnis',
    'features.time-cost.tagline': 'Keine verschwendete Zeit oder überraschende Rechnungen',
    'features.time-cost.pain': 'Notfall-Klempner kosten oft unverhältnismäßig viel, nur fürs Erscheinen, plus intransparente Materialaufschläge.',
    'features.time-cost.solution': 'Erhalten Sie eine präzise Einschätzung, bevor ein Techniker kommt. Volle Transparenz über den Arbeitsaufwand.',
    'features.time-cost.benefit1': 'Durchschnittlich 40% Kostenersparnis durch Effizienz',
    'features.time-cost.benefit2': 'Festpreis-Garantie ohne versteckte Gebühren',
    'features.time-cost.benefit3': 'Protokollgestützte Voranalyse spart unnötige Anfahrten',

    // Reliability Pillar
    'features.reliability.title': 'Zuverlässigkeit & Support',
    'features.reliability.tagline': '24/7 Verfügbarkeit mit Arbeitsgarantie',
    'features.reliability.pain': 'Die meisten Betriebe sind tagelang ausgebucht, Garantien sind oft unklar oder gar nicht erst vorhanden.',
    'features.reliability.solution': 'Unser Team von 32 festangestellten Technikern garantiert Einsatzbereitschaft am selben Tag.',
    'features.reliability.benefit1': '30 Minuten durchschnittliche Reaktionszeit bei Notfällen',
    'features.reliability.benefit2': 'Mehrjährige Garantie auf alle Sanierungsleistungen',
    'features.reliability.benefit3': 'Vollversicherte, festangestellte Handwerksmeister',

    // Master Deep Dive
    'features.howItWorks': 'Der Präzisions-Prozess',
    'features.learnMore': 'Mehr erfahren',
    'features.step': 'Schritt',
    'features.masterDeepDive.title': 'Vom Foto zum Fix in 4 Schritten',
    'features.masterDeepDive.step1.title': 'Technische Dokumentation',
    'features.masterDeepDive.step1.desc': 'Dokumentieren Sie die Störung für unser meistergestütztes Prüfprotokoll.',
    'features.masterDeepDive.step2.title': 'Aufwands-Check',
    'features.masterDeepDive.step2.desc': 'Unsere Experten bewerten die Komplexität und berechnen den exakten Arbeitsaufwand.',
    'features.masterDeepDive.step3.title': 'Festpreis-Sicherung',
    'features.masterDeepDive.step3.desc': 'Erhalten Sie ein technisches Angebot mit Ersatzteilliste und Festpreis. Keine Überraschungen.',
    'features.masterDeepDive.step4.title': 'Präzisions-Einsatz',
    'features.masterDeepDive.step4.desc': 'Ein Techniker wird mit dem exakten Inventar entsandt und löst das Problem in einem Besuch.',

    // Pricing
    'pricing.title': 'Kalkulierbare Präzision',
    'pricing.subtitle': 'Transparente Preisgestaltung für zertifizierte Abwasser-Dienstleistungen.',
    'pricing.basic': 'Basis',
    'pricing.standard': 'Standard',
    'pricing.premium': 'Premium',
    'pricing.cta': 'Plan wählen',
    'pricing.popular': 'Industrie-Standard',
    'pricing.month': 'Monat',
    'pricing.badge': 'Sanierungspläne',

    // Funnel / Contact
    'funnel.step1.title': 'Meister-Video-Diagnose starten',
    'funnel.step1.desc': 'Übermitteln Sie ein Foto oder Video Ihrer Störung. Unsere Meister in der Zentrale Walle führen eine Ferndiagnose durch.',
    'funnel.step2.title': 'Technische Details',
    'funnel.step2.desc': 'Spezifizieren Sie das technische Ausmaß der Störung.',
    'funnel.step3.title': 'Kontaktdaten',
    'funnel.step3.desc': 'Wohin sollen wir unser Meister-Protokoll senden?',
    'funnel.next': 'Nächste Phase',
    'funnel.back': 'Vorherige Phase',
    'funnel.submit': 'Protokoll an Einsatzleitung senden',
    'funnel.success.title': 'Protokoll übermittelt',
    'funnel.success.desc': 'Technische Einschätzung abgeschlossen. Übermittelt an Zentrale Walle. Einsatzleiter Andreas bereitet Fahrzeug 4 vor.',
    'funnel.success.eta': 'Standard-Anfahrtsfenster',

    // Issues
    'issue.leaking': 'Rohrbruch / Undichtheit',
    'issue.clogged': 'Verstopfter Abfluss',
    'issue.broken': 'Kanal-Defekt',
    'issue.installation': 'Sanierung/Neuinstallation',

    // FAQ
    'faq.title': 'Häufig gestellte Fragen',
    'faq.badge': 'Klare Antworten',
    'faq.stillHaveQuestions': 'Noch Fragen? Chatten Sie mit unserem Experten-Team.',

    // Team Page
    'team.title': 'Das Team von Rotek',
    'team.subtitle': 'Unsere Techniker sind Experten für komplexe Leitungsnetze. Zertifiziert, diszipliniert und erfahren.',
    'team.story.title': 'Die Rotek Geschichte',
    'team.story.tagline': 'Industrielle Exzellenz seit 1972',
    'team.story.desc': 'Gegründet 1972 in Bremen, entstand Rotek aus der Notwendigkeit für industrielle Präzision in der Entwässerungstechnik. Heute betreuen wir die komplexesten Kanalnetze Norddeutschlands.',
    'team.expertise.title': 'Die 4 Säulen von Rotek',
    'team.expertise.1': 'Eingetragener Meisterbetrieb',
    'team.expertise.2': 'Staatliche Qualifikationen',
    'team.expertise.3': 'Technische Validierung',
    'team.expertise.4': 'Vollversichert',

    // Footer
    'footer.readyFor': 'Bereit für Rotek ',
    'footer.goldStandard': 'Industrie-Standard',
    'footer.fix': ' Sanierung?',
    'footer.experience': 'Erleben Sie die Zukunft der Rohrtechnik mit professioneller Meisterdiagnostik.',
    'footer.cta': 'Analyse starten',
    'footer.premiumPlumbing': 'Premium-Rohrtechnik',
    'footer.redefining': 'Spezialisten für Sielsanierung und TV-Untersuchung. Seit über 50 Jahren in Bremen und Verden.',
    'footer.legal': 'RECHTLICHES',
    'footer.privacy': 'Datenschutzerklärung',
    'footer.terms': 'AGB / Nutzungsbedingungen',
    'footer.imprint': 'Impressum',
    'footer.accreditations': 'ZERTIFIZIERUNGEN',
    'footer.certifiedMeister': 'ZERTIFIZIERTER MEISTER',
    'footer.emergency': '24/7 NOTDIENST',
    'footer.copyright': '© 2026 Rotek Rohrreinigungsdienst GmbH. Industrielle Exzellenz seit 1972.',

    // Services
    'services.kanal-tv.title': '3D Kanal-TV-Untersuchung',
    'services.kanal-tv.desc': 'Hochauflösende 360° Diagnostik für Rohre von DN 40 bis DN 2000. "Wir machen schmutzige Filme".',
    'services.rohrreinigung.title': 'Hochdruckspülarbeiten (24/7)',
    'services.rohrreinigung.desc': 'Mechanische oder hydrodynamische Reinigung von Entwässerungsleitungen rund um die Uhr.',
    'services.fettabscheider.title': 'Fettabscheider-Service',
    'services.fettabscheider.desc': 'Vorgeschriebene Entleerung und Wartung für Industrie & Gastronomie.',
    'services.kanalsanierung.title': 'Inliner-Sanierung',
    'services.kanalsanierung.desc': 'Nachhaltige grabenlose Sanierung. Defekte Stellen reparieren ohne Aufgraben.',
    'services.hebeanlagen.title': 'Hebeanlagen / Dichtheitsprüfung',
    'services.hebeanlagen.desc': 'Amtliche Funktionsprüfung und Wartung nach DIN EN 1610 / 1986-30.'
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const stored = localStorage.getItem('rotek-industrial-lang') as Language | null
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
    localStorage.setItem('rotek-industrial-lang', lang)
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
