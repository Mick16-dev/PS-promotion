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
    'nav.overview': 'Overview',
    'nav.services': 'Services',
    'nav.pricing': 'Pricing',
    'nav.about': 'About',
    'nav.reviews': 'Reviews',
    'nav.howItWorks': 'How It Works',
    'nav.questions': 'Questions',
    'nav.contact': 'Contact',

    // Hero
    'hero.badge': 'Master Expert Diagnosis',
    'hero.title': 'Bespoke Plumbing Diagnosis & Expert Engineering',
    'hero.subtitle': 'Experience the future of home maintenance. Instant visual diagnostic analysis by certified German Master Technicians. Transparent, elite, and available 24/7.',

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
    'gallery.badge': 'Visual Excellence',

    // Testimonials
    'testimonials.title': 'What Our Customers Say',
    'testimonials.verified': 'Verified Customer',

    // Trust
    'trust.title': 'Trusted by Thousands',
    'trust.response': '30 min average response',
    'trust.certified': 'Certified Technicians',
    'trust.guarantee': 'Satisfaction Guarantee',
    'trust.insurance': 'Fully Insured',
    'trust.badge': 'The Gold Standard',

    // Features Section
    'features.badge': 'Why Choose Us',
    'features.title': 'Why Choose Rohr-Blitz?',
    'features.subtitle': 'We combine expert craftsmanship with modern diagnostic tools to deliver faster, more accurate, and cost-effective solutions.',
    'features.painPoint': 'The Problem',
    'features.solution': 'Our Solution',

    // Master Diagnosis Pillar
    'features.expert-diagnosis.title': 'Master Visual Diagnosis',
    'features.expert-diagnosis.tagline': 'Instant issue identification with repair guidance',
    'features.expert-diagnosis.pain': 'Traditional plumbing inspections require scheduling, waiting for a technician, and paying for diagnostic visits just to understand the problem.',
    'features.expert-diagnosis.solution': 'Our master technicians analyze your photo in seconds, identify the exact issue, and provide a detailed breakdown of required repairs, tools, and parts.',
    'features.expert-diagnosis.benefit1': 'Identifies 50+ common plumbing issues from a single photo',
    'features.expert-diagnosis.benefit2': 'Lists exact parts needed (with model numbers) so you can price-compare',
    'features.expert-diagnosis.benefit3': 'Provides difficulty rating so you know if it\'s DIY or requires a pro',

    // Time & Cost Pillar
    'features.time-cost.title': 'Time & Cost Savings',
    'features.time-cost.tagline': 'No wasted hours or surprise invoices',
    'features.time-cost.pain': 'Emergency plumber calls average $150-300 just for showing up, plus hourly rates and markup on parts.',
    'features.time-cost.solution': 'Get an upfront estimate before any technician arrives. Know the exact cost range, timeline, and what you\'re paying for.',
    'features.time-cost.benefit1': 'Save 40% on average vs. traditional emergency call-outs',
    'features.time-cost.benefit2': 'Transparent pricing with no hidden fees or surprise charges',
    'features.time-cost.benefit3': 'Skip the diagnostic fee entirely with our remote pre-assessment',

    // Reliability Pillar
    'features.reliability.title': 'Reliability & Support',
    'features.reliability.tagline': '24/7 availability with guaranteed workmanship',
    'features.reliability.pain': 'Most plumbers are booked days out, and weekend or night calls cost double. Warranties are often unclear or non-existent.',
    'features.reliability.solution': 'Our network of 50+ certified technicians ensures same-day availability. Every job includes a 2-year workmanship guarantee.',
    'features.reliability.benefit1': '30-minute average response time for emergencies',
    'features.reliability.benefit2': '2-year warranty on all repairs with no fine print',
    'features.reliability.benefit3': 'Background-checked, licensed, and fully insured technicians',

    // Master Deep Dive
    'features.howItWorks': 'How It Works',
    'features.learnMore': 'Learn more',
    'features.step': 'Step',
    'features.masterDeepDive.title': 'From Photo to Fixed in 4 Simple Steps',
    'features.masterDeepDive.step1.title': 'Visual Capture',
    'features.masterDeepDive.step1.desc': 'Capture a high-fidelity image of the disruption. Our expert technicians process the details of the issue instantly.',
    'features.masterDeepDive.step2.title': 'Master Validation',
    'features.masterDeepDive.step2.desc': 'Our Master Technicians validate the diagnostic data, ensuring engineering-grade accuracy and localized compliance.',
    'features.masterDeepDive.step3.title': 'Detailed Report',
    'features.masterDeepDive.step3.desc': 'Receive a breakdown of the problem, required parts, estimated repair time, and cost range.',
    'features.masterDeepDive.step4.title': 'Elite Resolution',
    'features.masterDeepDive.step4.desc': 'Deploy a certified Master Technician who arrives fully equipped to solve the disruption with surgical precision.',

    // Results Stats
    'features.results.title': 'Real Results, Real Savings',
    'features.results.diagnosis': 'Avg. diagnosis time',
    'features.results.savings': 'Cost savings vs. traditional',
    'features.results.accuracy': 'Diagnosis accuracy',
    'features.results.satisfaction': 'Customer rating',
    'features.cta': 'Try Master Diagnosis Free',
    'features.ctaSubtext': 'No credit card required. Get your estimate in under 5 minutes.',

    // Pricing
    'pricing.title': 'Transparent Pricing',
    'pricing.subtitle': 'No hidden fees, no surprises',
    'pricing.basic': 'Basic',
    'pricing.standard': 'Standard',
    'pricing.premium': 'Premium',
    'pricing.cta': 'Choose Plan',
    'pricing.popular': 'Most Popular',
    'pricing.month': 'month',

    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.badge': 'Clear Answers',
    'faq.stillHaveQuestions': 'Still have questions? Chat with our support expert.',
    'faq.cantFind': 'Cant find what you need?',
    'faq.supportTeam': 'Our support team is available 24/7 to assist with ANY plumbing emergency or technical query.',
    'faq.requestSupport': 'Request VIP Support',

    // Testimonials Additional
    'testimonials.verifiedTitle': 'Verified Elite Reviews',
    'testimonials.globalScore': 'Global Satisfaction Score',
    'testimonials.casesResolved': 'Verified Cases Resolved',
    'testimonials.verifiedIntervention': 'Verified Professional Intervention',
    'testimonials.videoTitle': 'Case #892: Professional Restoration',
    'testimonials.videoLoading': 'Cinematic Testimonial Loading...',

    // Hero Additional
    'hero.verifiedExperts': 'Verified Experts',
    'hero.response': '15m Response',
    'hero.calculate': 'Calculate Assessment',
    'hero.masterDiagnostic': 'Master Diagnostic',
    'hero.analyzing': 'Analyzing Blueprint & Pressure Points...',
    'hero.encrypted': 'Encrypted',
    'hero.gdpr': 'GDPR Ready',
    'hero.masterEstimate': 'Master Estimate',

    // Pricing
    'pricing.badge': 'Pricing & Protection Plans',

    // Footer
    'footer.cta': 'Get Started Now',
    'footer.contact': 'Contact Us',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.imprint': 'Imprint',
    'footer.readyFor': 'Ready for a ',
    'footer.goldStandard': 'Gold Standard',
    'footer.fix': ' Fix?',
    'footer.experience': 'Experience the future of plumbing with expert master diagnostics and 24/7 elite response.',
    'footer.premiumPlumbing': 'Premium Plumbing',
    'footer.redefining': 'Redefining residential restoration through expert diagnostic tools and elite craftsmanship. Available 24/7 across every major German hub.',
    'footer.accreditations': 'Accreditations',
    'footer.certifiedMeister': 'Certified Meister',
    'footer.emergency': '24/7 Emergency',
    'footer.copyright': '© 2026 Rohr-Blitz. Crafted for Master Excellence.',
  },
  de: {
    // Header
    'header.emergency': 'Notdienst 24/7',
    'header.logo': 'Rohr-Blitz',
    'nav.overview': 'Übersicht',
    'nav.services': 'Leistungen',
    'nav.pricing': 'Preise',
    'nav.about': 'Über uns',
    'nav.reviews': 'Bewertungen',
    'nav.howItWorks': 'Ablauf',
    'nav.questions': 'Fragen',
    'nav.contact': 'Kontakt',

    // Hero
    'hero.badge': 'Meister-Diagnose',
    'hero.title': 'Meisterhafte Präzision & Digitale Sanitär-Diagnostik',
    'hero.subtitle': 'Erleben Sie die Zukunft der Haustechnik. Visuelle Sofort-Analyse durch zertifizierte deutsche Handwerksmeister. Transparent, exzellent und 24/7 verfügbar.',

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
    'gallery.badge': 'Visuelle Exzellenz',

    // Testimonials
    'testimonials.title': 'Kundenstimmen',
    'testimonials.verified': 'Verifizierter Kunde',

    // Trust
    'trust.title': 'Von Tausenden vertraut',
    'trust.response': '30 Min. durchschnittliche Reaktionszeit',
    'trust.certified': 'Zertifizierte Techniker',
    'trust.guarantee': 'Zufriedenheitsgarantie',
    'trust.insurance': 'Vollversichert',
    'trust.badge': 'Der Goldstandard',

    // Features Section
    'features.badge': 'Warum wir',
    'features.title': 'Warum Rohr-Blitz wählen?',
    'features.subtitle': 'Wir kombinieren echtes Handwerk mit modernen Diagnose-Tools für schnellere, genauere und kostengünstigere Lösungen.',
    'features.painPoint': 'Das Problem',
    'features.solution': 'Unsere Lösung',

    // Master Diagnosis Pillar
    'features.expert-diagnosis.title': 'Visuelle Meister-Diagnose',
    'features.expert-diagnosis.tagline': 'Sofortige Problemerkennung mit Reparaturanleitung',
    'features.expert-diagnosis.pain': 'Herkömmliche Inspektionen erfordern Terminvereinbarung, Warten und Bezahlung nur für die Diagnose.',
    'features.expert-diagnosis.solution': 'Unsere Meister analysieren Ihr Foto in Sekunden, identifizieren das Problem und liefern eine detaillierte Aufschlüsselung der Reparatur.',
    'features.expert-diagnosis.benefit1': 'Erkennt 50+ häufige Sanitärprobleme aus einem Foto',
    'features.expert-diagnosis.benefit2': 'Listet benötigte Teile mit Modellnummern zum Preisvergleich',
    'features.expert-diagnosis.benefit3': 'Gibt Schwierigkeitsgrad an: DIY oder Profi erforderlich',

    // Time & Cost Pillar
    'features.time-cost.title': 'Zeit- & Kostenersparnis',
    'features.time-cost.tagline': 'Keine verschwendete Zeit oder überraschende Rechnungen',
    'features.time-cost.pain': 'Notfall-Klempner kosten 150-300€ nur fürs Erscheinen, plus Stundensätze und Materialaufschläge.',
    'features.time-cost.solution': 'Erhalten Sie einen Kostenvoranschlag, bevor ein Techniker kommt. Keine versteckten Kosten.',
    'features.time-cost.benefit1': 'Durchschnittlich 40% günstiger als traditionelle Notrufe',
    'features.time-cost.benefit2': 'Transparente Preise ohne versteckte Gebühren',
    'features.time-cost.benefit3': 'Keine Diagnosegebühr dank Remote-Voranalyse',

    // Reliability Pillar
    'features.reliability.title': 'Zuverlässigkeit & Support',
    'features.reliability.tagline': '24/7 Verfügbarkeit mit Arbeitsgarantie',
    'features.reliability.pain': 'Die meisten Klempner sind Tage ausgebucht, Wochenend- oder Nachteinsätze kosten das Doppelte.',
    'features.reliability.solution': 'Unser Netzwerk von 50+ zertifizierten Technikern garantiert Verfügbarkeit am selben Tag.',
    'features.reliability.benefit1': '30 Minuten durchschnittliche Reaktionszeit bei Notfällen',
    'features.reliability.benefit2': '2 Jahre Garantie auf alle Reparaturen',
    'features.reliability.benefit3': 'Überprüfte, lizenzierte und vollversicherte Techniker',

    // Master Deep Dive
    'features.howItWorks': 'So funktioniert\'s',
    'features.learnMore': 'Mehr erfahren',
    'features.step': 'Schritt',
    'features.masterDeepDive.title': 'Vom Foto zur Reparatur in 4 Schritten',
    'features.masterDeepDive.step1.title': 'Foto machen',
    'features.masterDeepDive.step1.desc': 'Fotografieren Sie das Leck, die Verstopfung oder die beschädigte Armatur. Funktioniert mit jedem Smartphone.',
    'features.masterDeepDive.step2.title': 'Meister-Analyse',
    'features.masterDeepDive.step2.desc': 'Unsere Meister analysieren das Bild, vergleichen mit tausenden Fällen und identifizieren Problem und Schweregrad.',
    'features.masterDeepDive.step3.title': 'Detaillierter Bericht',
    'features.masterDeepDive.step3.desc': 'Erhalten Sie eine Aufschlüsselung des Problems, benötigte Teile, geschätzte Reparaturzeit und Kostenspanne.',
    'features.masterDeepDive.step4.title': 'Reparatur',
    'features.masterDeepDive.step4.desc': 'Buchen Sie einen Techniker, der mit den richtigen Werkzeugen ankommt, oder reparieren Sie selbst mit unserer Anleitung.',

    // Results Stats
    'features.results.title': 'Echte Ergebnisse, echte Ersparnisse',
    'features.results.diagnosis': 'Durchschn. Diagnosezeit',
    'features.results.savings': 'Ersparnis vs. traditionell',
    'features.results.accuracy': 'Diagnosegenauigkeit',
    'features.results.satisfaction': 'Kundenbewertung',
    'features.cta': 'Meister-Diagnose kostenlos testen',
    'features.ctaSubtext': 'Keine Kreditkarte erforderlich. Schätzung in unter 5 Minuten.',

    // Pricing
    'pricing.title': 'Transparente Preise',
    'pricing.subtitle': 'Keine versteckten Gebühren',
    'pricing.basic': 'Basis',
    'pricing.standard': 'Standard',
    'pricing.premium': 'Premium',
    'pricing.cta': 'Plan wählen',
    'pricing.popular': 'Beliebteste',
    'pricing.month': 'Monat',

    // FAQ
    'faq.title': 'Häufig gestellte Fragen',
    'faq.badge': 'Klare Antworten',
    'faq.stillHaveQuestions': 'Noch Fragen? Chatten Sie mit unserem Support-Experten.',
    'faq.cantFind': 'Nicht gefunden, was Sie suchen?',
    'faq.supportTeam': 'Unser Support-Team steht Ihnen 24/7 für JEDEN Sanitärnotfall oder jede technische Anfrage zur Verfügung.',
    'faq.requestSupport': 'VIP-Support anfordern',

    // Testimonials Additional
    'testimonials.verifiedTitle': 'Verifizierte Elite-Bewertungen',
    'testimonials.globalScore': 'Globale Zufriedenheitsbewertung',
    'testimonials.casesResolved': 'Verifizierte gelöste Fälle',
    'testimonials.verifiedIntervention': 'Verifizierter professioneller Einsatz',
    'testimonials.videoTitle': 'Fall #892: Professionelle Reparatur',
    'testimonials.videoLoading': 'Kino-Testimonial lädt...',

    // Hero Additional
    'hero.verifiedExperts': 'Verifizierte Experten',
    'hero.response': '15 Min. Reaktionszeit',
    'hero.calculate': 'Einschätzung berechnen',
    'hero.masterDiagnostic': 'Meister-Diagnose',
    'hero.analyzing': 'Analysiere Bauplan & Druckpunkte...',
    'hero.encrypted': 'Verschlüsselt',
    'hero.gdpr': 'DSGVO-konform',
    'hero.masterEstimate': 'Meister-Schätzung',

    // Pricing
    'pricing.badge': 'Preise & Schutzpläne',

    // Footer
    'footer.cta': 'Jetzt starten',
    'footer.contact': 'Kontakt',
    'footer.legal': 'Rechtliches',
    'footer.privacy': 'Datenschutz',
    'footer.terms': 'AGB',
    'footer.imprint': 'Impressum',
    'footer.readyFor': 'Bereit für eine ',
    'footer.goldStandard': 'Goldstandard',
    'footer.fix': '-Reparatur?',
    'footer.experience': 'Erleben Sie die Zukunft der Sanitärtechnik mit professioneller Meisterdiagnostik und 24/7 Elite-Reaktion.',
    'footer.premiumPlumbing': 'Premium-Sanitär',
    'footer.redefining': 'Neudefinition der Wohnhaussanierung durch fachkundige Diagnosewerkzeuge und elitäre Handwerkskunst. 24/7 in jedem großen deutschen Zentrum verfügbar.',
    'footer.accreditations': 'Akkreditierungen',
    'footer.certifiedMeister': 'Zertifizierter Meister',
    'footer.emergency': '24/7 Notfall',
    'footer.copyright': '© 2026 Rohr-Blitz. Für meisterhafte Exzellenz gefertigt.',
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
