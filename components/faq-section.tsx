'use client'

import { useLanguage } from '@/app/context/language-context'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

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

export function FAQSection() {
  const { language, t } = useLanguage()

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-10 text-balance">
          {t('faq.title')}
        </h2>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-border rounded-2xl px-6 bg-card shadow-sm"
            >
              <AccordionTrigger className="text-left hover:no-underline py-5">
                <span className="font-semibold text-foreground">
                  {language === 'de' ? faq.questionDe : faq.questionEn}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-muted-foreground leading-relaxed">
                {language === 'de' ? faq.answerDe : faq.answerEn}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
