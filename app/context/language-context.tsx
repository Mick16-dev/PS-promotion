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
    'nav.team': 'Team',
    'nav.contact': 'Contact',

    // Hero
    'hero.badge': 'Master Plumber Assessment',
    'hero.title': 'Professional Plumbing Assessment & Emergency Repairs',
    'hero.subtitle': 'Get an instant preliminary estimate and schedule a certified German Master Technician. Direct, transparent, and available 24/7 across major hubs.',

    // Precision Quote Engine (Replacement for Diagnosis)
    'funnel.step1.title': 'Digital Site Survey',
    'funnel.step1.desc': 'Upload a photo for Master Vision identification & fixed-price quoting.',
    'funnel.step1.formats': 'High-resolution JPG or PNG preferred',
    'funnel.step2.title': 'System Optimization',
    'funnel.step3.title': 'Access & Complexity',
    'funnel.step3.desc': 'Is the area easily accessible for a technician?',
    'funnel.step4.title': 'Verify Specifications',
    'funnel.cta': 'Generate Precision Quote',
    'funnel.success.title': 'Precision Quote Locked!',
    'funnel.success.desc': 'Your fixed-price guarantee is reserved. A technician will arrive with the identified parts.',
    'funnel.success.eta': 'Guaranteed arrival window',

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
    'features.badge': 'Why Choose Us',
    'features.title': 'Why Choose Rohr-Blitz?',
    'features.subtitle': 'We combine expert craftsmanship with modern diagnostic tools to deliver faster, more accurate, and cost-effective solutions.',
    'features.painPoint': 'The Problem',
    'features.solution': 'Our Solution',

    // Master Review Pillar
    'features.expert-diagnosis.title': 'Precision Site Survey',
    'features.expert-diagnosis.tagline': 'Digital hardware identification & labor path calculation',
    'features.expert-diagnosis.pain': 'Most plumbers give "estimates" over the phone that double in price once they see the actual job complexity.',
    'features.expert-diagnosis.solution': 'Our Master Vision Engine identifies the exact part and environmental constraints (access, piping material) to lock in a fixed price before arrival.',
    'features.expert-diagnosis.benefit1': 'Identifies exact model numbers from visual data',
    'features.expert-diagnosis.benefit2': 'Calculates precise 15-minute labor increments',
    'features.expert-diagnosis.benefit3': 'Eliminated "Part Trips" - Technician arrives 100% prepared',

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
    'features.howItWorks': 'The Precision Process',
    'features.learnMore': 'Learn more',
    'features.step': 'Step',
    'features.masterDeepDive.title': 'From Photo to Fixed in 4 Simple Steps',
    'features.masterDeepDive.step1.title': 'Digital Capture',
    'features.masterDeepDive.step1.desc': 'Capture a high-fidelity image of the disruption. Our Vision Engine isolates hardware and failure points.',
    'features.masterDeepDive.step2.title': 'Labor Calculation',
    'features.masterDeepDive.step2.desc': 'Our engine assesses accessibility and technical depth to calculate exact labor hours required.',
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
    'hero.calculate': 'Start Digital Survey',
    'hero.diagnosisInProgress': 'Technical Site Survey',
    'hero.diagnosing': 'Analyzing visual data & part matching...',
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

    // Team Page
    'team.title': 'The Masters of Rohr-Blitz',
    'team.subtitle': 'Our precision-driven technicians are the heartbeat of our operation. Certified, disciplined, and ready to resolve any plumbing disruption.',
    'team.story.title': 'The Rohr-Blitz Story',
    'team.story.tagline': 'From a Local Workshop to a Master-Led Network',
    'team.story.desc': 'Founded in 2008 by Master Plumber Stefan Krause, Rohr-Blitz was born from a simple observation: plumbing is missing precision and transparency. Stefan envisioned a service where engineering-grade diagnostics meet traditional craftsmanship. Today, we are a network of 50+ hand-picked Master Technicians across Germany.',
    'team.coverage.title': 'Our Service Hubs',
    'team.coverage.desc': 'We currently deploy masters across Berlin, Munich, Hamburg, and Frankfurt, with local response teams available 24/7.',
    'team.expertise.title': 'The 4 Pillars of Mastery',
    'team.expertise.1': 'Certified Master Business',
    'team.expertise.1.desc': 'Officially registered with the Handwerkskammer as a certified "Meisterbetrieb".',
    'team.expertise.2': 'Regulated Qualifications',
    'team.expertise.2.desc': 'Every technician holds valid state licenses and internal "Master Expert" certification.',
    'team.expertise.3': 'Precision Assessment',
    'team.expertise.3.desc': 'Our diagnosis isn\'t a guess; it\'s an engineering calculation validated by 20+ years of data.',
    'team.expertise.4': 'Liability Guaranteed',
    'team.expertise.4.desc': 'We stand behind every weld, every seal, and every repair with comprehensive insurance coverage.',
    'team.member.role.master': 'Master Plumber',
    'team.member.role.diagnostic': 'Diagnostic Specialist',
    'team.member.role.emergency': 'Emergency Lead',
    'team.member.role.install': 'Installation Expert',

    // Services
    'services.leak-detection.title': 'Leak Detection & Repair',
    'services.leak-detection.desc': 'Professional repair of leaking pipes, protecting your property from water damage. We use advanced diagnostic tools to pinpoint the exact location of the leak rapidly.',
    'services.drain-cleaning.title': 'Drain Unclogging',
    'services.drain-cleaning.desc': 'Comprehensive drain cleaning services using safe, effective motorized snakes and hydro-jetting to remove blockages deep within your plumbing system.',
    'services.fixture-replacement.title': 'Fixture Replacement',
    'services.fixture-replacement.desc': 'Expert installation and replacement of faucets, toilets, showerheads, and other household fixtures. Ensuring perfect seals and optimal water flow.',
    'services.water-heater.title': 'Water Heater Services',
    'services.water-heater.desc': 'Diagnostic and repair services for all conventional and tankless water heaters. We restore hot water supply efficiently and conduct safety checks.',
    'services.sewer-line.title': 'Sewer Line Repair',
    'services.sewer-line.desc': 'Non-invasive visual inspection of underground sewer lines and pipes to determine condition, locate roots, or find collapsed sections without digging.'
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
    'nav.team': 'Team',
    'nav.contact': 'Kontakt',

    // Hero
    'hero.badge': 'Meister-Einschätzung',
    'hero.title': 'Professionelle Sanitär-Analyse & Notfall-Reparatur',
    'hero.subtitle': 'Erhalten Sie eine sofortige Kostenschätzung und buchen Sie einen zertifizierten deutschen Handwerksmeister. Direkt, transparent und 24/7 verfügbar.',

    // Precision Quote Engine (Ersatz für Diagnose)
    'funnel.step1.title': 'Digitaler Standort-Check',
    'funnel.step1.desc': 'Laden Sie ein Foto hoch für die präzise Teileidentifikation & Festpreis-Angebot.',
    'funnel.step1.formats': 'Hochauflösende JPG oder PNG bevorzugt',
    'funnel.step2.title': 'System-Optimierung',
    'funnel.step3.title': 'Zugang & Komplexität',
    'funnel.step3.desc': 'Ist der Arbeitsbereich leicht zugänglich?',
    'funnel.step4.title': 'Spezifikationen prüfen',
    'funnel.cta': 'Präzisions-Angebot erstellen',
    'funnel.success.title': 'Angebot Gesichert!',
    'funnel.success.desc': 'Ihre Festpreis-Garantie ist reserviert. Ein Techniker wird mit den identifizierten Teilen eintreffen.',
    'funnel.success.eta': 'Garantiertes Zeitfenster',

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
    'features.title': 'Warum Rohr-Blitz wählen?',
    'features.subtitle': 'Wir kombinieren echtes Handwerk mit modernen Diagnose-Tools für schnellere, genauere und kostengünstigere Lösungen.',
    'features.painPoint': 'Das Problem',
    'features.solution': 'Unsere Lösung',

    // Master Review Pillar
    'features.expert-diagnosis.title': 'Präzisions-Standort-Check',
    'features.expert-diagnosis.tagline': 'Digitale Hardware-Erkennung & Arbeitsweg-Berechnung',
    'features.expert-diagnosis.pain': 'Die meisten Klempner geben am Telefon Schätzungen ab, die sich verdoppeln, sobald sie die tatsächliche Komplexität sehen.',
    'features.expert-diagnosis.solution': 'Unsere Master Vision-Engine identifiziert das exakte Teil und die Umgebungsvorgaben (Zugang, Material), um einen Festpreis vor der Ankunft zu garantieren.',
    'features.expert-diagnosis.benefit1': 'Identifiziert exakte Modellnummern aus Bilddaten',
    'features.expert-diagnosis.benefit2': 'Berechnet präzise 15-Minuten-Arbeitsintervalle',
    'features.expert-diagnosis.benefit3': 'Keine Zweitanfahrten - Techniker kommt 100% vorbereitet',

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
    'features.howItWorks': 'Der Präzisions-Prozess',
    'features.learnMore': 'Mehr erfahren',
    'features.step': 'Schritt',
    'features.masterDeepDive.title': 'Vom Foto zum Fix in 4 Schritten',
    'features.masterDeepDive.step1.title': 'Digitale Aufnahme',
    'features.masterDeepDive.step1.desc': 'Machen Sie ein Foto der Störung. Unsere Vision-Engine isoliert Hardware und Fehlerstellen.',
    'features.masterDeepDive.step2.title': 'Aufwands-Check',
    'features.masterDeepDive.step2.desc': 'Unsere Engine bewertet Zugänglichkeit und technische Tiefe, um die exakten Arbeitsstunden zu berechnen.',
    'features.masterDeepDive.step3.title': 'Festpreis-Garantie',
    'features.masterDeepDive.step3.desc': 'Erhalten Sie ein technisches Angebot mit identifizierten Teilen und Festpreis. Keine Überraschungen.',
    'features.masterDeepDive.step4.title': 'Präzisions-Reparatur',
    'features.masterDeepDive.step4.desc': 'Ein Techniker wird mit dem exakten Inventar entsandt und schließt die Reparatur in einem Besuch ab.',

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
    'hero.calculate': 'Check starten',
    'hero.diagnosisInProgress': 'Technische Standort-Analyse',
    'hero.diagnosing': 'Analysiere Bilddaten & Teile...',
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

    // Team Page
    'team.title': 'Die Meister von Rohr-Blitz',
    'team.subtitle': 'Unsere präzisen Techniker sind das Herzstück unseres Betriebs. Zertifiziert, diszipliniert und bereit für jede Herausforderung.',
    'team.story.title': 'Die Rohr-Blitz Geschichte',
    'team.story.tagline': 'Vom lokalen Betrieb zum meistergeführten Netzwerk',
    'team.story.desc': 'Gegründet 2008 von Sanitärmeister Stefan Krause, entstand Rohr-Blitz aus einer einfachen Beobachtung: Dem Handwerk fehlte es an Präzision und Transparenz. Stefan visionierte einen Service, bei dem Ingenieursdiagnostik auf traditionelles Handwerk trifft. Heute sind wir ein Netzwerk von über 50 Handwerksmeistern in ganz Deutschland.',
    'team.coverage.title': 'Unsere Einsatzgebiete',
    'team.coverage.desc': 'Wir sind derzeit mit festen Teams in Berlin, München, Hamburg und Frankfurt vertreten, mit lokalen Notdiensten rund um die Uhr.',
    'team.expertise.title': 'Die 4 Säulen der Meisterschaft',
    'team.expertise.1': 'Zertifizierter Meisterbetrieb',
    'team.expertise.1.desc': 'Offiziell bei der Handwerkskammer als zertifizierter Meisterbetrieb eingetragen.',
    'team.expertise.2': 'Regulierte Qualifikationen',
    'team.expertise.2.desc': 'Jeder Techniker verfügt über staatliche Zulassungen und unsere interne Experten-Zertifizierung.',
    'team.expertise.3': 'Präzisions-Diagnostik',
    'team.expertise.3.desc': 'Unsere Diagnose ist keine Schätzung, sondern eine validierte Ingenieursrechnung.',
    'team.expertise.4': 'Haftungs-Garantie',
    'team.expertise.4.desc': 'Wir stehen für jede Schweißnaht und jede Dichtung mit umfassendem Versicherungsschutz gerade.',
    'team.member.role.master': 'Sanitär-Meister',
    'team.member.role.diagnostic': 'Diagnose-Spezialist',
    'team.member.role.emergency': 'Notfall-Leitung',
    'team.member.role.install': 'Installations-Profi',

    // Services
    'services.leak-detection.title': 'Leckortung & Reparatur',
    'services.leak-detection.desc': 'Professionelle Reparatur von undichten Rohren zum Schutz Ihrer Immobilie vor Wasserschäden. Wir nutzen fortschrittliche Diagnosewerkzeuge zur genauen Ortung.',
    'services.drain-cleaning.title': 'Abfluss-Entstopfung',
    'services.drain-cleaning.desc': 'Umfassende Abflussreinigung mit sicheren, effektiven motorisierten Spiralen und Hochdruckreinigung zur Entfernung tiefliegender Verstopfungen.',
    'services.fixture-replacement.title': 'Armatur-Austausch',
    'services.fixture-replacement.desc': 'Fachgerechte Installation und Austausch von Wasserhähnen, Toiletten, Duschköpfen und anderen Haushaltsarmaturen. Minimierung von Wasserverlusten.',
    'services.water-heater.title': 'Warmwasserbereiter Reparatur',
    'services.water-heater.desc': 'Diagnose und Reparaturservices für herkömmliche und Durchlauferhitzer. Wir stellen die Warmwasserversorgung effizient wieder her.',
    'services.sewer-line.title': 'Kanalreparatur',
    'services.sewer-line.desc': 'Zerstörungsfreie visuelle Inspektion von unterirdischen Kanalisationsleitungen und Rohren zur Zustandsermittlung ohne Grabungen.'
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
