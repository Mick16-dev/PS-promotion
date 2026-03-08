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
    'hero.badge': 'AI-Powered Diagnosis',
    'hero.title': 'Get Your Plumbing Issue Diagnosed in Minutes',
    'hero.subtitle': 'Upload a photo of your problem, answer a few questions, and receive an instant estimate from our certified technicians.',
    
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
    'gallery.subtitle': 'See the quality of our work',
    'gallery.cta': 'Start Your Diagnosis',
    
    // Testimonials
    'testimonials.title': 'What Our Customers Say',
    'testimonials.verified': 'Verified Customer',
    
    // Trust
    'trust.title': 'Why Choose Rohr-Blitz',
    'trust.response': '30 min average response',
    'trust.certified': 'Certified Technicians',
    'trust.guarantee': 'Satisfaction Guarantee',
    'trust.insurance': 'Fully Insured',
    
    // Pricing
    'pricing.title': 'Transparent Pricing',
    'pricing.subtitle': 'No hidden fees, no surprises',
    'pricing.basic': 'Basic',
    'pricing.standard': 'Standard',
    'pricing.premium': 'Premium',
    'pricing.cta': 'Choose Plan',
    'pricing.popular': 'Most Popular',
    
    // FAQ
    'faq.title': 'Frequently Asked Questions',
    
    // Footer
    'footer.cta': 'Get Started Now',
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
    'hero.badge': 'KI-gestützte Diagnose',
    'hero.title': 'Ihr Sanitärproblem in Minuten diagnostiziert',
    'hero.subtitle': 'Laden Sie ein Foto Ihres Problems hoch, beantworten Sie einige Fragen und erhalten Sie sofort einen Kostenvoranschlag.',
    
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
    'gallery.subtitle': 'Sehen Sie die Qualität unserer Arbeit',
    'gallery.cta': 'Diagnose starten',
    
    // Testimonials
    'testimonials.title': 'Kundenstimmen',
    'testimonials.verified': 'Verifizierter Kunde',
    
    // Trust
    'trust.title': 'Warum Rohr-Blitz',
    'trust.response': '30 Min. durchschnittliche Reaktionszeit',
    'trust.certified': 'Zertifizierte Techniker',
    'trust.guarantee': 'Zufriedenheitsgarantie',
    'trust.insurance': 'Vollversichert',
    
    // Pricing
    'pricing.title': 'Transparente Preise',
    'pricing.subtitle': 'Keine versteckten Gebühren',
    'pricing.basic': 'Basis',
    'pricing.standard': 'Standard',
    'pricing.premium': 'Premium',
    'pricing.cta': 'Plan wählen',
    'pricing.popular': 'Beliebteste',
    
    // FAQ
    'faq.title': 'Häufig gestellte Fragen',
    
    // Footer
    'footer.cta': 'Jetzt starten',
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
