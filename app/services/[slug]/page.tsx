'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useLanguage } from '@/app/context/language-context'
import { getServiceBySlug } from '@/lib/services-data'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { JoinModal } from '@/components/join-modal'
import { notFound } from 'next/navigation'

export default function ServicePage() {
  const params = useParams()
  const slug = params?.slug as string
  const service = getServiceBySlug(slug)
  const { language } = useLanguage()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!service) {
    notFound()
  }

  const title = language === 'de' ? service.titleDe : service.titleEn
  const intro = language === 'de' ? service.introDe : service.introEn
  const whatWeDo = language === 'de' ? service.whatWeDoDe : service.whatWeDoEn
  const whenToCall = language === 'de' ? service.whenToCallDe : service.whenToCallEn
  const process = language === 'de' ? service.processDe : service.processEn

  return (
    <main className="min-h-screen bg-background">
      <Header onEmergencyClick={() => setIsModalOpen(true)} />

      <section className="pt-28 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {language === 'de' ? 'Zurück zu den Leistungen' : 'Back to services'}
          </Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight mb-6">{title}</h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">{intro}</p>
        </div>
      </section>

      {/* Hero image */}
      {service.afterImage && (
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div
              className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl border border-border/60 bg-muted/20"
              style={{ backgroundImage: `url(${service.afterImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            <p className="text-sm text-muted-foreground mt-4">
              {language === 'de' ? 'Rotek Rohrreinigungsdienst GmbH' : 'Rotek Rohrreinigungsdienst GmbH'}
            </p>
          </div>
        </section>
      )}

      <section className="py-16 px-4 border-t border-border/50">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground mb-6">
              {language === 'de' ? 'Was wir machen' : 'What we do'}
            </h2>
            <ul className="space-y-3">
              {whatWeDo.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-primary font-semibold shrink-0">–</span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground mb-6">
              {language === 'de' ? 'Wann anrufen' : 'When to call'}
            </h2>
            <ul className="space-y-3">
              {whenToCall.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-primary font-semibold shrink-0">–</span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground mb-8">
            {language === 'de' ? 'Ablauf' : 'Process'}
          </h2>
          <div className="space-y-8">
            {process.map((step, i) => (
              <div key={i} className="flex gap-5">
                <div className="w-9 h-9 rounded-lg border border-border/60 bg-card/40 flex items-center justify-center shrink-0 font-bold text-primary text-sm">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-0.5">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-t border-border/50 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-extrabold tracking-tight text-foreground mb-2">
            {language === 'de' ? 'Anfrage stellen' : 'Request'}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl">
            {language === 'de'
              ? 'Rufen Sie uns an oder schreiben Sie uns – wir nennen Ihnen grobe Kosten und mögliche Termine.'
              : 'Call or message us – we will give you rough costs and possible appointment times.'}
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11 px-6 rounded-xl inline-flex items-center gap-2"
          >
            {language === 'de' ? 'Anfrage senden' : 'Send request'} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      <Footer onCtaClick={() => setIsModalOpen(true)} />
      <JoinModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  )
}
