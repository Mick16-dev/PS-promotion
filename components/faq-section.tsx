'use client'

import { useLanguage } from '@/app/context/language-context'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Magnetic } from '@/components/ui/magnetic'
import { motion } from 'framer-motion'
import { HelpCircle, MessageSquare } from 'lucide-react'

const faqs = [
  {
    questionEn: 'How does the Master visual diagnostic tool work?',
    questionDe: 'Wie funktioniert das visuelle Meister-Diagnose-Tool?',
    answerEn: 'Simply upload a photo of your plumbing issue, and our master technicians analyze the image to provide an instant preliminary estimate. A certified expert then reviews your case and contacts you within 30 minutes.',
    answerDe: 'Laden Sie einfach ein Foto Ihres Sanitärproblems hoch, und unsere Sanitärmeister analysieren das Bild, um sofort eine vorläufige Schätzung zu liefern. Ein zertifizierter Experte prüft dann Ihren Fall und kontaktiert Sie innerhalb von 30 Minuten.'
  },
  {
    questionEn: 'What is your emergency response time?',
    questionDe: 'Wie schnell reagieren Sie bei Notfällen?',
    answerEn: 'Our average emergency response time is under 30 minutes for Premium plan members. Standard plans receive priority response within 1-2 hours. We operate 24/7, 365 days a year.',
    answerDe: 'Unsere durchschnittliche Notfall-Reaktionszeit liegt für Premium-Mitglieder unter 30 Minuten. Standardpläne erhalten eine Prioritätsreaktion innerhalb von 1-2 Stunden. Wir arbeiten 24/7, 365 Tage im Jahr.'
  },
  {
    questionEn: 'Are your technicians certified?',
    questionDe: 'Sind Ihre Techniker zertifiziert?',
    answerEn: 'Yes, all our technicians are fully certified, licensed, and insured. They undergo regular training and background checks. We maintain the highest standards in the industry.',
    answerDe: 'Ja, alle unsere Techniker sind vollständig zertifiziert, lizenziert und versichert. Sie werden regelmäßig geschult und überprüft. Wir halten die höchsten Standards der Branche ein.'
  },
  {
    questionEn: 'What areas do you service?',
    questionDe: 'Welche Gebiete bedienen Sie?',
    answerEn: 'We currently service all major German cities including Berlin, Munich, Hamburg, Frankfurt, Cologne, and their surrounding areas. Enter your postal code during booking to confirm coverage.',
    answerDe: 'Wir bedienen derzeit alle großen deutschen Städte, darunter Berlin, München, Hamburg, Frankfurt, Köln und deren Umgebung. Geben Sie bei der Buchung Ihre Postleitzahl ein, um die Abdeckung zu bestätigen.'
  },
  {
    questionEn: 'What payment methods do you accept?',
    questionDe: 'Welche Zahlungsmethoden akzeptieren Sie?',
    answerEn: 'We accept all major credit cards, PayPal, bank transfers, and cash. For subscription plans, we offer monthly or annual billing with a 15% discount on annual payments.',
    answerDe: 'Wir akzeptieren alle gängigen Kreditkarten, PayPal, Banküberweisungen und Bargeld. Für Abonnementpläne bieten wir monatliche oder jährliche Abrechnung mit 15% Rabatt bei jährlicher Zahlung.'
  },
  {
    questionEn: 'Is the estimate guaranteed?',
    questionDe: 'Ist die Schätzung garantiert?',
    answerEn: 'Our expert-generated estimates are preliminary and based on the information provided. The final price is confirmed after on-site inspection. We guarantee no surprise charges beyond the quoted range without your approval.',
    answerDe: 'Unsere expertengestützten Schätzungen sind vorläufig und basieren auf den bereitgestellten Informationen. Der endgültige Preis wird nach der Vor-Ort-Inspektion bestätigt. Wir garantieren keine Überraschungskosten über den genannten Bereich hinaus ohne Ihre Zustimmung.'
  }
]

export function FaqSection() {
  const { language, t } = useLanguage()

  // SEO: FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": language === 'de' ? faq.questionDe : faq.questionEn,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": language === 'de' ? faq.answerDe : faq.answerEn
      }
    }))
  }

  return (
    <section className="py-16 sm:py-20 px-4 relative overflow-hidden bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-secondary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[120px]" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >

          <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight uppercase">
            {t('faq.title')}
          </h2>
          <div className="flex items-center justify-center gap-2 text-muted-foreground font-medium text-xs">
            <MessageSquare className="w-3.5 h-3.5 text-secondary" />
            {t('faq.stillHaveQuestions')}
          </div>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <AccordionItem
                value={`item-${index}`}
                className="group border border-border/50 rounded-xl px-5 bg-white shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden"
              >
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  <span className="text-sm font-bold text-foreground uppercase tracking-tight group-hover:text-primary transition-colors pr-4">
                    {language === 'de' ? faq.questionDe : faq.questionEn}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm text-muted-foreground leading-relaxed pr-8">
                  <div className="flex gap-4">
                    <div className="w-1 h-auto bg-secondary/30 rounded-full shrink-0" />
                    <div>{language === 'de' ? faq.answerDe : faq.answerEn}</div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 p-8 bg-white rounded-xl border border-slate-200 flex flex-col items-center text-center"
        >
          <HelpCircle className="w-7 h-7 text-secondary mb-4" />
          <h3 className="text-lg font-bold uppercase tracking-tight text-foreground mb-2">
            {t('faq.cantFind')}
          </h3>
          <p className="text-sm text-muted-foreground font-medium mb-6 max-w-md">
            {t('faq.supportTeam')}
          </p>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-wider h-10 px-6 rounded-lg text-xs transition-all active:scale-95">
              {t('faq.requestSupport')}
            </Button>
        </motion.div>
      </div>
    </section>
  )
}
