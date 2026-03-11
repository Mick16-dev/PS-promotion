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
    questionEn: 'Can I send a photo in advance?',
    questionDe: 'Kann ich Ihnen vorab ein Foto schicken?',
    answerEn: 'Yes. A photo and a short description help us to better estimate the effort and to bring the right parts. The final price is always confirmed on site after we have seen everything in person.',
    answerDe: 'Ja. Ein Foto und eine kurze Beschreibung helfen uns, den Aufwand besser einzuschätzen und die richtigen Teile mitzubringen. Der endgültige Preis wird immer vor Ort bestätigt, nachdem wir uns alles angeschaut haben.'
  },
  {
    questionEn: 'How fast can you come in an emergency?',
    questionDe: 'Wie schnell kommen Sie im Notfall?',
    answerEn: 'In most cases in Berlin and the surrounding area we can be with you on the same day, often within a few hours. At night we first check by phone what is urgent and what can wait until the morning.',
    answerDe: 'In den meisten Fällen in Berlin und Umgebung sind wir noch am selben Tag bei Ihnen, oft innerhalb weniger Stunden. Nachts klären wir telefonisch, was wirklich dringend ist und was bis zum Morgen warten kann.'
  },
  {
    questionEn: 'What does a typical repair cost?',
    questionDe: 'Was kostet eine typische Reparatur?',
    answerEn: 'The price depends on the effort and material. On the phone we give you a rough price range. On site we explain again what we recommend and what it will cost before we start.',
    answerDe: 'Der Preis hängt vom Aufwand und vom Material ab. Am Telefon nennen wir Ihnen einen groben Kostenrahmen. Vor Ort erklären wir noch einmal, was wir empfehlen und was es kostet, bevor wir anfangen.'
  },
  {
    questionEn: 'Do you also do small jobs?',
    questionDe: 'Machen Sie auch kleine Aufträge?',
    answerEn: 'Yes. A dripping tap, a new siphon or a blocked toilet are exactly the kind of jobs we do every day.',
    answerDe: 'Ja. Eine tropfende Armatur, ein neuer Siphon oder eine verstopfte Toilette sind genau die Einsätze, die wir täglich machen.'
  },
  {
    questionEn: 'Do I have to prepare anything before you arrive?',
    questionDe: 'Muss ich vor Ihrem Besuch etwas vorbereiten?',
    answerEn: 'If possible, clear the area in front of the affected place (sink, toilet, access hatch) and keep pets away. Everything else we bring with us.',
    answerDe: 'Wenn möglich, räumen Sie den Bereich vor der betroffenen Stelle (Waschbecken, Toilette, Revisionsöffnung) frei und halten Sie Haustiere fern. Alles andere bringen wir mit.'
  },
  {
    questionEn: 'Which areas do you cover?',
    questionDe: 'Welche Gebiete decken Sie ab?',
    answerEn: 'We mainly work in Berlin and the surrounding area. For larger jobs we are also happy to drive a bit further – simply ask us by phone.',
    answerDe: 'Wir sind hauptsächlich in Berlin und Umgebung unterwegs. Für größere Arbeiten fahren wir auch gerne ein Stück weiter – sprechen Sie uns einfach telefonisch an.'
  },
  {
    questionEn: 'How can I pay?',
    questionDe: 'Wie kann ich bezahlen?',
    answerEn: 'You can usually pay in cash or by bank transfer. For recurring customers and businesses we are happy to agree individual arrangements.',
    answerDe: 'In der Regel können Sie bar oder per Überweisung zahlen. Für Stammkunden und Unternehmen vereinbaren wir gerne individuelle Regelungen.'
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
    <section id="faq" className="py-32 px-4 relative overflow-hidden bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground text-xs font-semibold rounded-xl uppercase tracking-[0.15em] mb-6">
            <HelpCircle className="w-4 h-4" />
            {language === 'de' ? 'Gut zu wissen' : 'Good to know'}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 tracking-tight">
            {t('faq.title')}
          </h2>
          <div className="flex items-center justify-center gap-3 text-muted-foreground text-xs">
            <MessageSquare className="w-4 h-4 text-secondary" />
            {language === 'de'
              ? 'Wenn Sie unsicher sind, rufen Sie lieber einmal mehr an.'
              : 'If you are unsure, it is better to call us once more.'}
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
                className="group border border-border/60 rounded-2xl px-6 bg-card shadow-sm overflow-hidden"
              >
                <AccordionTrigger className="text-left hover:no-underline py-8">
                  <span className="text-lg sm:text-xl font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors pr-6">
                    {language === 'de' ? faq.questionDe : faq.questionEn}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-sm text-muted-foreground leading-relaxed pr-6">
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
          className="mt-16 p-8 rounded-2xl border border-secondary/30 bg-muted flex flex-col items-center text-center"
        >
          <HelpCircle className="w-8 h-8 text-secondary mb-4" />
          <h3 className="text-2xl font-bold tracking-tight text-foreground mb-4">
            {t('faq.moreHelpTitle') || "Can't find what you need?"}
          </h3>
          <p className="text-muted-foreground font-medium mb-8 max-w-lg">
            Our support team is available 24/7 to assist with ANY plumbing emergency or technical query.
          </p>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11 px-6 rounded-xl">
            {t('faq.cta') || 'Ask a question'}
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
