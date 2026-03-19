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
    'header.logo': 'Rotek',
    'nav.overview': 'Overview',
    'nav.services': 'Services',
    'nav.pricing': 'Pricing',
    'nav.about': 'About',
    'nav.reviews': 'Reviews',
    'nav.howItWorks': 'How It Works',
    'nav.questions': 'Questions',
    'nav.team': 'Team',
    'nav.contact': 'Contact',

    // Hero
    'hero.badge': 'Industrial Maintenance Since 1972',
    'hero.title': 'High-End Sewer & Pipe Diagnostics',
    'hero.subtitle': 'Bremen\'s technical leader for sewer TV inspection, cleaning, and grabenlose rehabilitation. 32 specialists, 11 high-tech trucks, 100% human engineered.',

    // Rotek Master Visual Service (Replacement for Funnel)
    'funnel.step1.title': 'Master Visual Terminal',
    'funnel.step1.desc': 'Submit a photo or video of your disruption. Our masters at Central Walle will perform a remote diagnosis and create a technical protocol – free of charge.',
    'funnel.step1.formats': 'Industrial standards ISYBAU/ATV applied.',
    'funnel.step2.title': 'Technical Validation',
    'funnel.step3.title': 'Bremen Land Registry Check',
    'funnel.step3.desc': 'Coordinating with local municipal data for precise routing.',
    'funnel.step4.title': 'Technical Protocol',
    'funnel.cta': 'Initiate Master Review',
    'funnel.success.title': 'Protocol Transmitted',
    'funnel.success.desc': 'Technical assessment completed. Transmitted to Central Walle. Fleet Commander Andreas is preparing Truck 4.',
    'funnel.success.eta': 'Standard Response Window',

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

    // Precision Report & Workflow
    'diagnosis.title': 'Precision Quote Analysis',
    'diagnosis.problem': 'Identified Hardware/Issue',
    'diagnosis.action': 'Projected Solution',
    'diagnosis.tools': 'Parts/Inventory Required',
    'diagnosis.price': 'Fixed-Price Guarantee',
    'diagnosis.book': 'Lock-in Quote & Book',
    'diagnosis.complexity': 'Complexity Rating',
    'diagnosis.labor': 'Estimated Labor Depth',
    
    'diagnosis.leaking.problem': 'Burst or Leaking Pipe',
    'diagnosis.leaking.action': 'Shut off main water valve immediately. Place a bucket underneath.',
    'diagnosis.leaking.tools': 'Pipe wrench, replacement piping, sealant.',
    'diagnosis.clogged.problem': 'Severe Blockage / Clog',
    'diagnosis.clogged.action': 'Stop running water. Do not use chemical drain cleaners.',
    'diagnosis.clogged.tools': 'Motorized plumbing snake, hydro-jetting equipment.',
    'diagnosis.broken.problem': 'Damaged Fixture',
    'diagnosis.broken.action': 'Shut off local water valve under the affected fixture.',
    'diagnosis.broken.tools': 'Adjustable wrench, replacement fixture hardware.',
    'diagnosis.installation.problem': 'New Component Installation',
    'diagnosis.installation.action': 'Please clear the surrounding area for secure access.',
    'diagnosis.installation.tools': 'Measuring tape, level, associated fittings.',

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
    'testimonials.videoLoading': 'Technical Testimonial Loading...',

    // Hero Additional
    'hero.verifiedExperts': 'Verified Experts',
    'hero.response': '15m Response',
    'hero.calculate': 'Initiate Master Visual Review',
    'hero.diagnosisInProgress': 'Master Protocol Verification',
    'hero.diagnosing': 'Synchronizing with Central Walle Dispatch...',
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
    'footer.redefining': 'Redefining residential restoration through expert diagnostic tools and elite craftsmanship. Available 24/7 across Bremen and Verden.',
    'footer.accreditations': 'Accreditations',
    'footer.certifiedMeister': 'Certified Meister',
    'footer.emergency': '24/7 Emergency',
    'footer.copyright': '© 2026 Rotek Rohrreinigungsdienst GmbH. Industrial Excellence since 1972.',

    // Team Page
    'team.title': 'The Masters of Rotek',
    'team.subtitle': 'Our precision-driven technicians are the heartbeat of our operation. Certified, disciplined, and ready to resolve any pipe disruption.',
    'team.story.title': 'The Rotek Story',
    'team.story.tagline': 'Industrial Excellence Since 1972',
    'team.story.desc': 'Founded in 1972 in Bremen, Rotek was born from a simple observation: large-scale infrastructure requires industrial-grade precision. We transitioned from traditional plumbing to master-led engineering. Today, we manage some of the most complex sewer networks in Northern Germany.',
    'team.coverage.title': 'Our Service Hubs',
    'team.coverage.desc': 'We deploy our specialized fleet from our central hubs in Bremen-Walle and Verden.',
    'team.expertise.title': 'The 4 Pillars of Mastery',
    'team.expertise.1': 'Certified Master Business',
    'team.expertise.1.desc': 'Officially registered as a master-led engineering firm for pipe and sewer technology.',
    'team.expertise.2': 'Regulated Qualifications',
    'team.expertise.2.desc': 'Every technician holds valid state licenses for Sielsanierung and TV-inspection.',
    'team.expertise.3': 'Precision Assessment',
    'team.expertise.3.desc': 'Our diagnosis isn\'t a guess; it\'s a technical calculation validated by 50+ years of site data.',
    'team.expertise.4': 'Liability Guaranteed',
    'team.expertise.4.desc': 'We stand behind every weld, every seal, and every repair with comprehensive industrial insurance.',
    'team.member.role.master': 'Master of Pipe Engineering',
    'team.member.role.diagnostic': 'Diagnostic Specialist',
    'team.member.role.emergency': 'Emergency Lead',
    'team.member.role.install': 'Installation Expert',

    // Services
    'services.kanal-tv.title': '3D Sewer TV Inspection',
    'services.kanal-tv.desc': 'High-definition 360° diagnostics for pipes from DN 40 to DN 2000. Digital data tracking included.',
    'services.rohrreinigung.title': 'Pipe Cleaning (24/7)',
    'services.rohrreinigung.desc': 'Professional mechanical or hydrodynamic blockage removal available around the clock.',
    'services.fettabscheider.title': 'Grease Trap Service',
    'services.fettabscheider.desc': 'Mandatory cleaning and maintenance for commercial kitchens. Legal disposal certificates provided.',
    'services.kanalsanierung.title': 'Sewer Rehabilitation',
    'services.kanalsanierung.desc': 'Sustainable no-dig repairs. Fixing damaged sections without excavating your property.',
    'services.hebeanlagen.title': 'Leak Testing & Pumping',
    'services.hebeanlagen.desc': 'Official functional safety checks and pumping station maintenance according to DIN standards.'
  },
  de: {
    // Header
    'header.emergency': 'Notdienst 24/7',
    'header.logo': 'Rotek',
    'nav.overview': 'Übersicht',
    'nav.services': 'Leistungen',
    'nav.pricing': 'Preise',
    'nav.about': 'Über uns',
    'nav.reviews': 'Bewertungen',
    'nav.howItWorks': 'Ablauf',
    'nav.questions': 'Fragen',
    'nav.team': 'Team',
    'nav.contact': 'Kontakt',

    // Hero
    'hero.badge': 'Meisterbetrieb seit 1972',
    'hero.title': 'High-End Kanal- & Rohrsystem-Diagnostik',
    'hero.subtitle': 'Bremens technischer Marktführer für Kanal-TV, Reinigung und grabenlose Sanierung. 32 Spezialisten, 11 Hightech-Fahrzeuge, 100% deutsche Handwerksqualität.',

    // Rotek Master Visual Service (Digitaler Meister-Check)
    'funnel.step1.title': 'Meister-Video-Terminal',
    'funnel.step1.desc': 'Senden Sie uns ein Foto oder Video Ihrer Störung. Unsere Meister in der Zentrale Walle führen eine Fern-Diagnose durch und erstellen ein technisches Protokoll – kostenlos.',
    'funnel.step1.formats': 'Industrie-Standards ISYBAU/ATV werden angewendet.',
    'funnel.step2.title': 'Technische Validierung',
    'funnel.step3.title': 'Abgleich Bremer Katasteramt',
    'funnel.step3.desc': 'Synchronisation mit städtischen Leitungsdaten für Präzisions-Anfahrt.',
    'funnel.step4.title': 'Technisches Protokoll',
    'funnel.cta': 'Meister-Überprüfung starten',
    'funnel.success.title': 'Protokoll Übermittelt',
    'funnel.success.desc': 'Technische Einschätzung abgeschlossen. Übermittelt an Zentrale Walle. Einsatzleiter Andreas bereitet Fahrzeug 4 vor.',
    'funnel.success.eta': 'Standard-Anfahrtsfenster',

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

    // Precision Report & Workflow
    'diagnosis.title': 'Präzisions-Angebotsanalyse',
    'diagnosis.problem': 'Identifizierte Hardware/Problem',
    'diagnosis.action': 'Projektierte Lösung',
    'diagnosis.tools': 'Benötigte Teile/Inventar',
    'diagnosis.price': 'Festpreis-Garantie',
    'diagnosis.book': 'Angebot sichern & Buchen',
    'diagnosis.complexity': 'Komplexitätsgrad',
    'diagnosis.labor': 'Geschätzter Arbeitsaufwand',
    
    'diagnosis.leaking.problem': 'Rohrbruch oder Undichtes Rohr',
    'diagnosis.leaking.action': 'Hauptwasserhahn sofort abstellen. Eimer unterstellen.',
    'diagnosis.leaking.tools': 'Rohrzange, Ersatzrohre, Dichtmittel.',
    'diagnosis.clogged.problem': 'Schwere Verstopfung',
    'diagnosis.clogged.action': 'Wasserzulauf stoppen. Keine chemischen Reiniger verwenden.',
    'diagnosis.clogged.tools': 'Motorisierte Rohrreinigungsspirale, Hochdruck-Spülgerät.',
    'diagnosis.broken.problem': 'Beschädigte Armatur',
    'diagnosis.broken.action': 'Eckventil unter dem betroffenen Becken abstellen.',
    'diagnosis.broken.tools': 'Verstellbarer Schraubenschlüssel, Ersatzarmatur.',
    'diagnosis.installation.problem': 'Neue Sanitärinstallation',
    'diagnosis.installation.action': 'Bitte Arbeitsbereich für sicheren Zugang freiräumen.',
    'diagnosis.installation.tools': 'Maßband, Wasserwaage, entsprechende Anschlüsse.',

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
    'features.title': 'Warum Rotek wählen?',
    'features.subtitle': 'Wir kombinieren 50 Jahre Erfahrung mit modernsten Diagnose-Werkzeugen für eine präzise Umsetzung.',
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

    // Results Stats
    'features.results.title': 'Echte Ergebnisse, echte Ersparnisse',
    'features.results.diagnosis': 'Durchschn. Diagnosezeit',
    'features.results.savings': 'Ersparnis vs. traditionell',
    'features.results.accuracy': 'Diagnosegenauigkeit',
    'features.results.satisfaction': 'Kundenbewertung',
    'features.cta': 'Meister-Diagnose starten',
    'features.ctaSubtext': 'Fachgerechte Einschätzung. Schätzung in unter 5 Minuten.',

    // Pricing
    'pricing.title': 'Transparente Preise',
    'pricing.subtitle': 'Keine versteckten Gebühren',
    'pricing.basic': 'Basis',
    'pricing.standard': 'Standard',
    'pricing.premium': 'Premium',
    'pricing.cta': 'Plan wählen',
    'pricing.popular': 'Industrie-Standard',
    'pricing.month': 'Monat',

    // FAQ
    'faq.title': 'Häufig gestellte Fragen',
    'faq.badge': 'Klare Antworten',
    'faq.stillHaveQuestions': 'Noch Fragen? Chatten Sie mit unserem Experten-Team.',
    'faq.cantFind': 'Nicht gefunden, was Sie suchen?',
    'faq.supportTeam': 'Unser Team steht Ihnen 24/7 für JEDEN Notfall oder jede technische Anfrage zur Verfügung.',
    'faq.requestSupport': 'Einsatzleitung kontaktieren',

    // Testimonials Additional
    'testimonials.verifiedTitle': 'Verifizierte Referenzen',
    'testimonials.globalScore': 'Zufriedenheits-Index',
    'testimonials.casesResolved': 'Gelöste Einsätze',
    'testimonials.verifiedIntervention': 'Verifizierter technischer Einsatz',
    'testimonials.videoTitle': 'Fall #892: Professionelle Sanierung',
    'testimonials.videoLoading': 'Technisches Video lädt...',

    // Hero Additional
    'hero.verifiedExperts': 'Geprüfte Techniker',
    'hero.response': '15 Min. Reaktionszeit',
    'hero.calculate': 'Meister-Video-Diagnose starten',
    'hero.diagnosisInProgress': 'Meister-Protokoll-Verifizierung',
    'hero.diagnosing': 'Synchronisierung mit Zentrale Walle...',
    'hero.encrypted': 'Verschlüsselt',
    'hero.gdpr': 'DSGVO-konform',
    'hero.masterEstimate': 'Meister-Schätzung',

    // Pricing
    'pricing.badge': 'Preise & Sanierungspläne',

    // Footer
    'footer.cta': 'Jetzt starten',
    'footer.contact': 'Kontakt',
    'footer.legal': 'Rechtliches',
    'footer.privacy': 'Datenschutz',
    'footer.terms': 'AGB',
    'footer.imprint': 'Impressum',
    'footer.readyFor': 'Bereit für Rotek ',
    'footer.goldStandard': 'Präzision',
    'footer.fix': '?',
    'footer.experience': 'Erleben Sie die Zukunft der Rohrtechnik mit professioneller Meisterdiagnostik.',
    'footer.premiumPlumbing': 'Premium-Rohrtechnik',
    'footer.redefining': 'Spezialisten für Sielsanierung und TV-Untersuchung. Seit über 50 Jahren in Bremen und Verden.',
    'footer.accreditations': 'Zertifizierungen',
    'footer.certifiedMeister': 'Eingetragener Meisterbetrieb',
    'footer.emergency': '24/7 Havariendienst',
    'footer.copyright': '© 2026 Rotek Rohrreinigungsdienst GmbH. Industrielle Exzellenz seit 1972.',

    // Team Page
    'team.title': 'Das Team von Rotek',
    'team.subtitle': 'Unsere Techniker sind Experten für komplexe Leitungsnetze. Zertifiziert, diszipliniert und erfahren.',
    'team.story.title': 'Die Rotek Geschichte',
    'team.story.tagline': 'Industrielle Exzellenz seit 1972',
    'team.story.desc': 'Gegründet 1972 in Bremen, entstand Rotek aus der Notwendigkeit für industrielle Präzision in der Entwässerungstechnik. Wir haben uns vom klassischen Handwerk zum meistergeführten Ingenieurbetrieb entwickelt. Heute betreuen wir die komplexesten Kanalnetze Norddeutschlands.',
    'team.coverage.title': 'Unsere Einsatzzentralen',
    'team.coverage.desc': 'Wir operieren von unseren Standorten in Bremen-Walle und Verden (Aller).',
    'team.expertise.title': 'Die 4 Säulen von Rotek',
    'team.expertise.1': 'Eingetragener Meisterbetrieb',
    'team.expertise.1.desc': 'Zertifiziertes Fachunternehmen für Rohr- und Kanaltechnik.',
    'team.expertise.2': 'Staatliche Qualifikationen',
    'team.expertise.2.desc': 'Jeder Techniker verfügt über Zulassungen für Sielsanierung und TV-Inspektion.',
    'team.expertise.3': 'Technische Validierung',
    'team.expertise.3.desc': 'Unsere Diagnose basiert auf 50 Jahren Erfahrung und modernster Messtechnik.',
    'team.expertise.4': 'Vollversichert',
    'team.expertise.4.desc': 'Umfassender Versicherungsschutz für alle industriellen und privaten Einsätze.',
    'team.member.role.master': 'Einsatzleiter / Meister',
    'team.member.role.diagnostic': 'Diagnose-Techniker',
    'team.member.role.emergency': 'Havariemanagement',
    'team.member.role.install': 'Sanierungs-Profi',

    // Services
    'services.kanal-tv.title': '3D Kanal-TV-Untersuchung',
    'services.kanal-tv.desc': 'Hochauflösende 360° Diagnostik für Rohre von DN 40 bis DN 2000. "Wir machen schmutzige Filme".',
    'services.rohrreinigung.title': 'Hochdruckspülarbeiten (24/7)',
    'services.rohrreinigung.desc': 'Mechanische oder hydrodynamische Reinigung von Entwässerungsleitungen rund um die Uhr.',
    'services.fettabscheider.title': 'Fettabscheider-Service',
    'services.fettabscheider.desc': 'Vorgeschriebene Entleerung und Wartung für Industrie & Gastronomie.',
    'services.kanalsanierung.title': 'Inliner-Sanierung',
    'services.kanalsanierung.desc': 'Nachhaltige grabenlose Sanierung. Defekte Stellen reparieren ohne Aufgraben.',
    'services.hebeanlagen.title': 'Dichtheitsprüfung',
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
