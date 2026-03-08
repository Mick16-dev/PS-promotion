'use client'

import { useLanguage } from '@/app/context/language-context'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { HelpCircle, Sparkles, MessageSquare } from 'lucide-react'

const faqs = [
  {
    questionEn: 'How does the AI diagnostic tool work?',
    questionDe: 'Wie funktioniert das KI-Diagnose-Tool?',
    answerEn: 'Simply upload a photo of your plumbing issue, select the category and severity, and our AI analyzes the image to provide an instant preliminary estimate. A certified technician then reviews your case and contacts you within 30 minutes.',
    answerDe: 'Laden Sie einfach ein Foto Ihres Sanitärproblems hoch, wählen Sie Kategorie und Schweregrad, und unsere KI analysiert das Bild, um sofort eine vorläufige Schätzung zu liefern. Ein zertifizierter Techniker prüft dann Ihren Fall und kontaktiert Sie innerhalb von 30 Minuten.'
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
    answerEn: 'Our AI-generated estimates are preliminary and based on the information provided. The final price is confirmed after on-site inspection. We guarantee no surprise charges beyond the quoted range without your approval.',
    answerDe: 'Unsere KI-generierten Schätzungen sind vorläufig und basieren auf den bereitgestellten Informationen. Der endgültige Preis wird nach der Vor-Ort-Inspektion bestätigt. Wir garantieren keine Überraschungskosten über den genannten Bereich hinaus ohne Ihre Zustimmung.'
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
    <section className="py-32 px-4 relative overflow-hidden bg-background">
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
          className="text-center mb-24"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground text-xs font-black rounded-xl uppercase tracking-[0.2em] mb-6">
            <HelpCircle className="w-4 h-4" />
            Clear Answers
          </span>
          <h2 className="text-4xl sm:text-6xl font-black text-foreground mb-8 tracking-tighter italic uppercase underline decoration-muted decoration-8 underline-offset-8">
            {t('faq.title')}
          </h2>
          <div className="flex items-center justify-center gap-3 text-muted-foreground font-black uppercase tracking-[0.2em] text-xs">
             <MessageSquare className="w-4 h-4 text-secondary" />
             Still have questions? Chat with our AI expert.
          </div>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-6">
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
                className="group border border-border/50 rounded-[2.5rem] px-8 bg-white/40 backdrop-blur-xl shadow-xl transition-all duration-500 hover:bg-white hover:border-primary/20 overflow-hidden"
              >
                <AccordionTrigger className="text-left hover:no-underline py-8">
                  <span className="text-xl sm:text-2xl font-black text-foreground italic uppercase tracking-tighter group-hover:text-primary transition-colors pr-6">
                    {language === 'de' ? faq.questionDe : faq.questionEn}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-8 text-lg font-medium text-muted-foreground leading-relaxed italic pr-12">
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
          className="mt-24 p-12 glass-card rounded-[3rem] border-secondary/20 flex flex-col items-center text-center relative overflow-hidden group"
        >
           <div className="absolute top-0 right-0 w-32 h-32 bg-secondary opacity-5 group-hover:opacity-10 transition-opacity blur-3xl" />
           <Sparkles className="w-10 h-10 text-secondary mb-6 animate-pulse-premium" />
           <h3 className="text-2xl font-black italic uppercase tracking-tighter text-foreground mb-4">
              Cant find what you need?
           </h3>
           <p className="text-muted-foreground font-medium mb-8 max-w-lg">
              Our support team is available 24/7 to assist with ANY plumbing emergency or technical query.
           </p>
           <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase tracking-[0.2em] h-16 px-10 rounded-2xl shadow-xl transition-all active:scale-95">
              Request VIP Support
           </Button>
        </motion.div>
      </div>
    </section>
  )
}
