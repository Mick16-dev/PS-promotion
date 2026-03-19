'use client'

import { useState } from 'react'
import { useLanguage } from '@/app/context/language-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { JoinModal } from '@/components/join-modal'
import { LumnarGrid } from '@/components/lumnar/LumnarGrid'
import { Badge } from '@/components/ui/badge'
import { RotekMasterVisualService } from '@/components/rotek-master-visual-service'

export default function ServicesPage() {
  const { language } = useLanguage()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <Header onEmergencyClick={() => setIsModalOpen(true)} />

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <Badge variant="secondary" className="rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase">
                Seit 1972
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase">
                Bremen · Verden
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase">
                24h Notdienst
              </Badge>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight mb-6">
              {language === 'de' ? 'Leistungen' : 'Services'}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {language === 'de'
                ? 'Alles rund ums Rohr: Reinigung, Untersuchung, Wartung und Sanierung – mit eigener Fahrzeugflotte und ohne Subunternehmer.'
                : 'End-to-end pipe and sewer services: cleaning, inspection, maintenance and rehabilitation.'}
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <LumnarGrid />
        </div>
      </section>

      <RotekMasterVisualService />

      <section className="py-16 px-4 border-t border-border/50">
        <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-[6px] p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground mb-2">
              {language === 'de' ? 'Betriebsdaten' : 'Company facts'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {language === 'de'
                ? 'Seit 1972. 32 Mitarbeitende. 11 Spezial-Fahrzeuge. Büro Bremen-Walle & Büro Verden.'
                : 'Since 1972. 32 staff. 11 specialist vehicles. Offices in Bremen-Walle and Verden.'}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
                <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-muted-foreground">Büro Bremen</div>
                <div className="mt-1 text-sm font-semibold text-foreground">Bayernstr. 172 · 28219 Bremen-Walle</div>
                <div className="mt-1 text-sm text-muted-foreground">Tel. 0421 39 17 14</div>
              </div>
              <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
                <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-muted-foreground">Büro Verden</div>
                <div className="mt-1 text-sm font-semibold text-foreground">Conrad-Wode-Straße 1 · 27283 Verden</div>
                <div className="mt-1 text-sm text-muted-foreground">Tel. 04231 98 2435</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-[6px] p-6 sm:p-8">
            <h2 className="text-xl font-extrabold tracking-tight text-foreground mb-2">
              {language === 'de' ? 'Einsatzgebiete' : 'Areas served'}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {language === 'de'
                ? 'Bremen: Walle, Findorff, Horn, Neustadt · plus Region Verden und Umzu.'
                : 'Bremen districts + Verden region.'}
            </p>
            <div className="flex flex-wrap gap-2">
              {['Walle', 'Findorff', 'Horn', 'Neustadt', 'Verden', 'Umzu.'].map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center rounded-full border border-border/60 bg-muted/20 px-3 py-1 text-xs font-semibold text-foreground/90"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer onCtaClick={() => setIsModalOpen(true)} />
      <JoinModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  )
}
