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
    'header.logo': 'Marcus Plumbing',
    
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
    'gallery.subtitle': 'See the quality of our plumbing work',
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
    'features.badge': 'Why Choose Us',
    'features.title': 'Why Choose Marcus Plumbing?',
    'features.subtitle': 'We combine cutting-edge AI technology with master plumber expertise to deliver faster, more accurate, and cost-effective solutions.',
    'features.painPoint': 'The Problem',
    'features.solution': 'Our Solution',
    
    // AI Diagnosis Pillar
    'features.ai-diagnosis.title': 'AI-Powered Diagnosis',
    'features.ai-diagnosis.tagline': 'Instant issue identification with repair guidance',
    'features.ai-diagnosis.pain': 'Traditional plumbing inspections require scheduling, waiting for a technician, and paying for diagnostic visits just to understand the problem.',
    'features.ai-diagnosis.solution': 'Our AI analyzes your photo in seconds, identifies the exact issue, and provides a detailed breakdown of required repairs, tools, and parts.',
    'features.ai-diagnosis.benefit1': 'Identifies 50+ common plumbing issues from a single photo',
    'features.ai-diagnosis.benefit2': 'Lists exact parts needed (with model numbers) so you can price-compare',
    'features.ai-diagnosis.benefit3': 'Provides difficulty rating so you know if it\'s DIY or requires a pro',
    
    // Time & Cost Pillar
    'features.time-cost.title': 'Time & Cost Savings',
    'features.time-cost.tagline': 'No wasted hours or surprise invoices',
    'features.time-cost.pain': 'Emergency plumber calls average $150-300 just for showing up, plus hourly rates and markup on parts.',
    'features.time-cost.solution': 'Get an upfront estimate before any technician arrives. Know the exact cost range, timeline, and what you\'re paying for.',
    'features.time-cost.benefit1': 'Save 40% on average vs. traditional emergency call-outs',
    'features.time-cost.benefit2': 'Transparent pricing with no hidden fees or surprise charges',
    'features.time-cost.benefit3': 'Skip the diagnostic fee entirely with our AI pre-assessment',
    
    // Reliability Pillar
    'features.reliability.title': 'Reliability & Support',
    'features.reliability.tagline': '24/7 availability with guaranteed workmanship',
    'features.reliability.pain': 'Most plumbers are booked days out, and weekend or night calls cost double. Warranties are often unclear or non-existent.',
    'features.reliability.solution': 'Our network of 50+ certified technicians ensures same-day availability. Every job includes a 2-year workmanship guarantee.',
    'features.reliability.benefit1': '30-minute average response time for emergencies',
    'features.reliability.benefit2': '2-year warranty on all repairs with no fine print',
    'features.reliability.benefit3': 'Background-checked, licensed, and fully insured technicians',
    
    // AI Deep Dive
    'features.howItWorks': 'How It Works',
    'features.aiDeepDive.title': 'From Photo to Fixed in 4 Simple Steps',
    'features.aiDeepDive.step1.title': 'Snap a Photo',
    'features.aiDeepDive.step1.desc': 'Take a clear photo of the leak, clog, or damaged fixture. Our AI works with any smartphone camera.',
    'features.aiDeepDive.step2.title': 'AI Analysis',
    'features.aiDeepDive.step2.desc': 'Our trained model analyzes the image, cross-references 10,000+ plumbing cases, and identifies the issue type and severity.',
    'features.aiDeepDive.step3.title': 'Detailed Report',
    'features.aiDeepDive.step3.desc': 'Receive a breakdown of the problem, required parts (with links), estimated repair time, and cost range.',
    'features.aiDeepDive.step4.title': 'Get It Fixed',
    'features.aiDeepDive.step4.desc': 'Book a certified technician who arrives prepared with the right tools and parts, or tackle it yourself with our guidance.',
    
    // Results Stats
    'features.results.title': 'Real Results, Real Savings',
    'features.results.diagnosis': 'Avg. diagnosis time',
    'features.results.savings': 'Cost savings vs. traditional',
    'features.results.accuracy': 'Diagnosis accuracy',
    'features.results.satisfaction': 'Customer rating',
    'features.cta': 'Try AI Diagnosis Free',
    'features.ctaSubtext': 'No credit card required. Get your estimate in under 5 minutes.',
    
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
    'header.logo': 'Marcus Plumbing',
    
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
    'gallery.subtitle': 'Sehen Sie die Qualität unserer Sanitärarbeiten',
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
    'features.badge': 'Warum wir',
    'features.title': 'Warum Marcus Plumbing wählen?',
    'features.subtitle': 'Wir kombinieren KI-Technologie mit Meister-Expertise für schnellere, genauere und kostengünstigere Lösungen.',
    'features.painPoint': 'Das Problem',
    'features.solution': 'Unsere Lösung',
    
    // AI Diagnosis Pillar
    'features.ai-diagnosis.title': 'KI-gestützte Diagnose',
    'features.ai-diagnosis.tagline': 'Sofortige Problemerkennung mit Reparaturanleitung',
    'features.ai-diagnosis.pain': 'Herkömmliche Inspektionen erfordern Terminvereinbarung, Warten und Bezahlung nur für die Diagnose.',
    'features.ai-diagnosis.solution': 'Unsere KI analysiert Ihr Foto in Sekunden, identifiziert das Problem und liefert eine detaillierte Aufschlüsselung der Reparatur.',
    'features.ai-diagnosis.benefit1': 'Erkennt 50+ häufige Sanitärprobleme aus einem Foto',
    'features.ai-diagnosis.benefit2': 'Listet benötigte Teile mit Modellnummern zum Preisvergleich',
    'features.ai-diagnosis.benefit3': 'Gibt Schwierigkeitsgrad an: DIY oder Profi erforderlich',
    
    // Time & Cost Pillar
    'features.time-cost.title': 'Zeit- & Kostenersparnis',
    'features.time-cost.tagline': 'Keine verschwendete Zeit oder überraschende Rechnungen',
    'features.time-cost.pain': 'Notfall-Klempner kosten 150-300€ nur fürs Erscheinen, plus Stundensätze und Materialaufschläge.',
    'features.time-cost.solution': 'Erhalten Sie einen Kostenvoranschlag, bevor ein Techniker kommt. Keine versteckten Kosten.',
    'features.time-cost.benefit1': 'Durchschnittlich 40% günstiger als traditionelle Notrufe',
    'features.time-cost.benefit2': 'Transparente Preise ohne versteckte Gebühren',
    'features.time-cost.benefit3': 'Keine Diagnosegebühr dank KI-Voranalyse',
    
    // Reliability Pillar
    'features.reliability.title': 'Zuverlässigkeit & Support',
    'features.reliability.tagline': '24/7 Verfügbarkeit mit Arbeitsgarantie',
    'features.reliability.pain': 'Die meisten Klempner sind Tage ausgebucht, Wochenend- oder Nachteinsätze kosten das Doppelte.',
    'features.reliability.solution': 'Unser Netzwerk von 50+ zertifizierten Technikern garantiert Verfügbarkeit am selben Tag.',
    'features.reliability.benefit1': '30 Minuten durchschnittliche Reaktionszeit bei Notfällen',
    'features.reliability.benefit2': '2 Jahre Garantie auf alle Reparaturen',
    'features.reliability.benefit3': 'Überprüfte, lizenzierte und vollversicherte Techniker',
    
    // AI Deep Dive
    'features.howItWorks': 'So funktioniert\'s',
    'features.aiDeepDive.title': 'Vom Foto zur Reparatur in 4 Schritten',
    'features.aiDeepDive.step1.title': 'Foto machen',
    'features.aiDeepDive.step1.desc': 'Fotografieren Sie das Leck, die Verstopfung oder die beschädigte Armatur. Funktioniert mit jedem Smartphone.',
    'features.aiDeepDive.step2.title': 'KI-Analyse',
    'features.aiDeepDive.step2.desc': 'Unser Modell analysiert das Bild, vergleicht mit 10.000+ Fällen und identifiziert Problem und Schweregrad.',
    'features.aiDeepDive.step3.title': 'Detaillierter Bericht',
    'features.aiDeepDive.step3.desc': 'Erhalten Sie eine Aufschlüsselung des Problems, benötigte Teile, geschätzte Reparaturzeit und Kostenspanne.',
    'features.aiDeepDive.step4.title': 'Reparatur',
    'features.aiDeepDive.step4.desc': 'Buchen Sie einen Techniker, der mit den richtigen Werkzeugen ankommt, oder reparieren Sie selbst mit unserer Anleitung.',
    
    // Results Stats
    'features.results.title': 'Echte Ergebnisse, echte Ersparnisse',
    'features.results.diagnosis': 'Durchschn. Diagnosezeit',
    'features.results.savings': 'Ersparnis vs. traditionell',
    'features.results.accuracy': 'Diagnosegenauigkeit',
    'features.results.satisfaction': 'Kundenbewertung',
    'features.cta': 'KI-Diagnose kostenlos testen',
    'features.ctaSubtext': 'Keine Kreditkarte erforderlich. Schätzung in unter 5 Minuten.',
    
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
    const stored = localStorage.getItem('marcus-plumbing-lang') as Language | null
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
    localStorage.setItem('marcus-plumbing-lang', lang)
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
