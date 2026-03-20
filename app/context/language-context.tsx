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
    'nav.overview': 'Overview',
    'nav.services': 'Services',
    'nav.testimonials': 'Cases',
    'nav.pricing': 'Pricing',
    'nav.faq': 'FAQ',
    'nav.emergency': 'Emergency Protocol',
    'nav.about': 'About Us',
    'nav.team': 'The Team',
    'nav.contact': 'Contact',

    // Header
    'header.logo': 'Rotek',
    'header.emergency': 'Emergency Protocol',
    'header.allServices': 'All Services →',

    // Hero Section
    'hero.badge': 'Industrial Precision Since 1972',
    'hero.title': 'MASTER VISUAL SERVICE',
    'hero.subtitle': 'Bespoke Technical Diagnosis & Expert Engineering. Submit your disruption for immediate master-led verification at Central Walle.',
    'hero.cta': 'Initiate Master Visual Review',
    'hero.calculate': 'Initiate Master Visual Review',
    'hero.diagnosisInProgress': 'Master Protocol Verification',
    'hero.diagnosing': 'Synchronizing with Central Walle Dispatch...',
    'hero.encrypted': 'AES-256 Encrypted',
    'hero.gdpr': 'GDPR Data Compliance',
    'hero.masterEstimate': 'Master Technical Estimate',
    'hero.masterCertified': 'Master Certified',
    'hero.priority': '24/7 Priority',
    'hero.nationwide': 'Region Wide',

    // Trust
    'trust.title': 'Industrial Excellence',
    'trust.response': '30 min average response',
    'trust.certified': 'Certified Technicians',
    'trust.guarantee': 'Satisfaction Guarantee',
    'trust.insurance': 'Fully Insured',
    'trust.badge': 'The Gold Standard',
    'trust.foundingYear': 'Founding Year',
    'trust.specializedTrucks': 'Specialized Trucks',
    'trust.technicalDefect': 'Technical Defect',
    'trust.rotekProtocol': 'Rotek Protocol',

    // Footer
    'footer.readyFor': 'Ready for Rotek ',
    'footer.goldStandard': 'Industry Standard',
    'footer.fix': ' Restoration?',
    'footer.experience': 'Experience the future of pipe technology with professional master diagnostics.',
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
    'footer.address.walle': 'Zentrale Bremen-Walle',
    'footer.address.verden': 'Büro Verden',

    // Pricing
    'pricing.popular': 'Industry Standard',
    'pricing.description.basic': 'Essential technical support for localized pipe issues.',
    'pricing.description.standard': 'Standard industrial package for residential & commercial.',
    'pricing.description.premium': 'Maximum precision for complex sewer infrastructure.',
    'pricing.guarantee': 'Your Safety, Our Mission.',
    'pricing.guarantee.desc': 'All prices are binding fixed prices after technical diagnosis. No hidden fees. Certified according to Rotek standards.',

    // Differentiator
    'diff.title': 'The Rotek Standard.',
    'diff.subtitle': 'Why we are the industrial market leader in Bremen and Verden. Quality is no coincidence.',
    'diff.zeroRisk': 'Zero Risk',
    'diff.zeroRisk.desc': 'Full insurance coverage for every operation.',
    'diff.expertise': 'Real Expertise',
    'diff.expertise.desc': 'No subcontractors. Only permanent professionals.',
    'diff.table.feature': 'Feature / Protocol',
    'diff.table.rotek': 'Rotek Standard',
    'diff.table.industry': 'Industry Average',

    // Master Expert
    'master.title': 'Industrial Engineering.',
    'master.subtitle': 'Certified Validation',
    'master.desc': 'Behind every mission stand our operations leads. Every diagnosis is validated by our technicians before the team dispatches – for 100% precision.',
    'master.pill.meister': 'Master Certified',
    'master.pill.vetted': 'Vetted Technicians',
    'master.pill.camera': 'Precision Systems',
    'master.pill.sewer': 'Sewer Experts',

    // Services General
    'services.badge': 'INDUSTRIAL PRECISION SINCE 1972',
    'services.title': 'Rotek Lumnar Series',
    'services.subtitle': 'The gold standard for wastewater and pipe engineering in Bremen, Verden, and surroundings.',
    'services.meisterCheck': 'Digital Master Check',
    'services.meisterCheck.desc': 'Activate the "Rotek Master Visual Service" for technical remote diagnosis.',
    'services.diagnoseProtocol': 'Diagnostic Protocol',

    // Issues
    'issue.leaking': 'Pipe Leak / Burst',
    'issue.clogged': 'Clogged Drain',
    'issue.broken': 'Broken Fixture',
    'issue.installation': 'New Installation',

    // FAQ
    'faq.title': 'Technical FAQ.',
    'faq.badge': 'Rotek Knowledge Base',
    'faq.complex': 'Complex System Issue?',
    'faq.complex.desc': 'Contact our operations lead for individual technical consulting.',
    'faq.cta': 'Contact Operations Lead',

  },
  de: {
    // Navigation
    'nav.overview': 'Übersicht',
    'nav.services': 'Leistungen',
    'nav.testimonials': 'Einsätze',
    'nav.pricing': 'Preise',
    'nav.faq': 'FAQ',
    'nav.emergency': 'Notfall-Protokoll',
    'nav.about': 'Über uns',
    'nav.team': 'Das Team',
    'nav.contact': 'Kontakt',

    // Header
    'header.logo': 'Rotek',
    'header.emergency': 'Havariemanagement',
    'header.allServices': 'Alle Leistungen →',

    // Hero Section
    'hero.badge': 'Industrielle Präzision seit 1972',
    'hero.title': 'ROTEK MASTER VISUAL SERVICE',
    'hero.subtitle': 'Technische Diagnose & Experten-Engineering. Übermitteln Sie Ihre Störung für eine sofortige Meister-Validierung in der Zentrale Walle.',
    'hero.cta': 'Meister-Video-Diagnose starten',
    'hero.calculate': 'Meister-Video-Diagnose starten',
    'hero.diagnosisInProgress': 'Meister-Protokoll-Verifizierung',
    'hero.diagnosing': 'Synchronisierung mit Zentrale Walle...',
    'hero.encrypted': 'AES-256 Verschlüsselt',
    'hero.gdpr': 'DSGVO-Datenschutz',
    'hero.masterEstimate': 'Technisches Meister-Angebot',
    'hero.masterCertified': 'Meister-Zertifiziert',
    'hero.priority': '24/7 Priorität',
    'hero.nationwide': 'Region Bremen & Umzu',

    // Trust
    'trust.title': 'Industrielle Exzellenz',
    'trust.response': '30 Min. Reaktionszeit',
    'trust.certified': 'Zertifizierte Techniker',
    'trust.guarantee': 'Zufriedenheitsgarantie',
    'trust.insurance': 'Vollversichert',
    'trust.badge': 'Der Goldstandard',
    'trust.foundingYear': 'Gegründet in',
    'trust.specializedTrucks': 'Spezial-Fahrzeuge',
    'trust.technicalDefect': 'Technischer Defekt',
    'trust.rotekProtocol': 'Rotek Protokoll',

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
    'footer.address.walle': 'Zentrale Bremen-Walle',
    'footer.address.verden': 'Büro Verden',

    // Pricing
    'pricing.popular': 'Industrie-Standard',
    'pricing.description.basic': 'Grundlegende Unterstützung für lokale Rohrprobleme.',
    'pricing.description.standard': 'Der industrielle Standard für Privat & Gewerbe.',
    'pricing.description.premium': 'Maximale Präzision für komplexe Infrastruktur.',
    'pricing.guarantee': 'Ihre Sicherheit, unser Auftrag.',
    'pricing.guarantee.desc': 'Alle Preise sind verbindliche Festpreise nach technischer Diagnose. Keine versteckten Gebühren. Zertifiziert nach Rotek-Standard.',

    // Differentiator
    'diff.title': 'Der Rotek Standard.',
    'diff.subtitle': 'Warum wir der industrielle Marktführer in Bremen und Verden sind. Qualität ist kein Zufall.',
    'diff.zeroRisk': 'Null Risiko',
    'diff.zeroRisk.desc': 'Vollständiger Versicherungsschutz bei jedem Einsatz.',
    'diff.expertise': 'Echte Expertise',
    'diff.expertise.desc': 'Keine Subunternehmer. Nur festangestellte Profis.',
    'diff.table.feature': 'Feature / Protokoll',
    'diff.table.rotek': 'Rotek Standard',
    'diff.table.industry': 'Branchendurchschnitt',

    // Master Expert
    'master.title': 'Ingenieurs-Expertise.',
    'master.subtitle': 'Zertifizierte Validierung',
    'master.desc': 'Hinter jedem Einsatz stehen unsere Einsatzleiter. Jede Diagnose wird von unseren Technikern validiert, bevor das Team ausrückt – für 100%ige Präzision.',
    'master.pill.meister': 'Meisterbetrieb',
    'master.pill.vetted': 'Geprüfte Techniker',
    'master.pill.camera': 'Präzisions-Systeme',
    'master.pill.sewer': 'Siel-Experten',

    // Services General
    'services.badge': 'INDUSTRIELLE PRÄZISION SEIT 1972',
    'services.title': 'Rotek Lumnar-Serie',
    'services.subtitle': 'Der Goldstandard für Abwasser- & Rohrsystemtechnik in Bremen, Verden und Umzu.',
    'services.meisterCheck': 'Digitaler Meister-Check',
    'services.meisterCheck.desc': 'Starten Sie den "Rotek Master Visual Service" für eine technische Ferndiagnose.',
    'services.diagnoseProtocol': 'Diagnose Protokoll',

    // Issues
    'issue.leaking': 'Rohrbruch / Undichtheit',
    'issue.clogged': 'Verstopfter Abfluss',
    'issue.broken': 'Kanal-Defekt',
    'issue.installation': 'Sanierung/Neuinstallation',

    // FAQ
    'faq.title': 'Technische Klärung.',
    'faq.badge': 'Rotek Wissensbasis',
    'faq.complex': 'Komplexere Fragestellung?',
    'faq.complex.desc': 'Kontaktieren Sie unsere Einsatzleitung für eine individuelle Fachberatung.',
    'faq.cta': 'Einsatzleitung kontaktieren',� 2026 Rotek Rohrreinigungsdienst GmbH. Industrielle Exzellenz seit 1972.',

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
