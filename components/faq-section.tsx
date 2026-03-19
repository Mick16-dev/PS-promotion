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
    questionEn: 'How accurate is the Digitaler Meister-Check?',
    questionDe: 'Wie präzise ist der Digitale Meister-Check?',
    answerEn: 'Our technical analysis combined with physical expert validation achieves a 98% accuracy in preliminary issue identification. In production networks, this significantly reduces diagnosis time on-site.',
    answerDe: 'Unsere technische Analyse in Kombination mit Experten-Validierung erreicht eine Genauigkeit von 98%. In industriellen Leitungsnetzen reduziert dies die Diagnosezeit vor Ort erheblich.'
  },
  {
    questionEn: 'Which regions in Bremen & Umzu do you cover?',
    questionDe: 'Welche Gebiete in Bremen & Umzu decken Sie ab?',
    answerEn: 'We provide industrial and residential services in all Bremen districts (Walle, Findorff, Horn, etc.) as well as Verden and the surrounding regions (Umzu).',
    answerDe: 'Wir leisten industriellen und privaten Service in allen Bremer Stadtteilen (Walle, Findorff, Horn etc.) sowie in Verden und dem gesamten Bremer Umland (Umzu).'
  },
  {
    questionEn: 'Are your technicians certified for industrial sewer systems?',
    questionDe: 'Sind Ihre Techniker für industrielle Sielsanierung zertifiziert?',
    answerEn: 'Yes, Rotek is a certified master business with over 50 years of experience. Our technicians are specialized in heavy-duty sewer operations and 3D pipe mapping.',
    answerDe: 'Ja, Rotek ist ein zertifizierter Meisterbetrieb mit über 50 Jahren Erfahrung. Unsere Techniker sind auf Sielsanierung, Robotik-Fräsen und 3D-Rohrortung spezialisiert.'
  },
  {
    questionEn: 'What is the "Wir machen schmutzige Filme" slogan about?',
    questionDe: 'Was bedeutet der Slogan "Wir machen schmutzige Filme"?',
    answerEn: 'It refers to our specialized TV-Inspection services where we use high-end camera systems to document the internal state of sewage pipes for 3D analysis.',
    answerDe: 'Dies bezieht sich auf unsere TV-Untersuchung, bei der wir mit modernsten Kamerasystemen den Zustand Ihrer Rohre für die 3D-Analyse dokumentieren.'
  },
  {
    questionEn: 'Do you offer 24/7 disaster response?',
    questionDe: 'Bieten Sie einen 24/7 Notdienst bei Havarien?',
    answerEn: 'Absolutely. We operate 24/7 with a fleet of 11 specialized trucks. In Bremen-Walle, our response time is usually under 20 minutes.',
    answerDe: 'Selbstverständlich. Wir operieren 24/7 mit 11 Spezialfahrzeugen. In Bremen-Walle liegt unsere Reaktionszeit meist unter 20 Minuten.'
  }
]

export function FaqSection() {
  const { language, t } = useLanguage()

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
    <section className="py-32 px-4 relative overflow-hidden bg-[#0A0B0D]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.98 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="text-left mb-20 border-l-8 border-red-600 pl-8"
        >
          <h2 className="text-4xl sm:text-6xl font-black text-white mb-4 tracking-tighter uppercase italic leading-none">
            {language === 'de' ? 'Technische Klärung.' : 'Technical FAQ.'}
          </h2>
          <div className="flex items-center gap-4 text-red-600 font-black uppercase tracking-[0.3em] text-[10px]">
            <MessageSquare className="w-4 h-4" />
            {language === 'de' ? 'Rotek Wissensbasis' : 'Rotek Knowledge Base'}
          </div>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <AccordionItem
                value={`item-${index}`}
                className="group border border-white/10 rounded-none px-6 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-md font-black text-white uppercase tracking-tight group-hover:text-red-500 transition-colors pr-6 italic">
                    {language === 'de' ? faq.questionDe : faq.questionEn}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-8 text-sm text-slate-400 leading-relaxed italic border-t border-white/5 pt-6">
                  <div className="flex gap-6">
                    <div className="w-1 h-auto bg-red-600 shrink-0" />
                    <div className="font-medium">{language === 'de' ? faq.answerDe : faq.answerEn}</div>
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
          className="mt-20 p-12 bg-white/[0.01] rounded-none border border-white/5 flex flex-col items-center text-center group hover:border-red-600/30 transition-colors"
        >
          <HelpCircle className="w-10 h-10 text-red-600 mb-6 group-hover:scale-110 transition-transform" />
          <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-3 italic">
            {language === 'de' ? 'Komplexere Fragestellung?' : 'Complex System Issue?'}
          </h3>
          <p className="text-slate-500 font-medium mb-10 max-w-sm italic">
            {language === 'de' ? 'Kontaktieren Sie unsere Einsatzleitung für eine individuelle Fachberatung.' : 'Contact our operations lead for individual technical consulting.'}
          </p>
          <Button className="bg-red-600 text-white hover:bg-red-700 font-black uppercase tracking-widest h-14 px-10 rounded-none border-b-4 border-r-4 border-red-900 shadow-xl transition-all active:scale-95 text-[10px]">
            {language === 'de' ? 'Einsatzleitung kontaktieren' : 'Contact Operations Lead'}
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
