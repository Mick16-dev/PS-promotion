'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { JoinModal } from '@/components/join-modal'

export default function KontaktPage() {
  const { language } = useLanguage()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <Header onEmergencyClick={() => setIsModalOpen(true)} />

      <div className="pt-32 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 text-foreground">
              {language === 'de' ? 'Kontakt' : 'Contact'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === 'de'
                ? 'Bayernstr. 172 Bremen · Conrad-Wode-Straße 1 Verden. 24-Stunden Notdienst: 0421 391714.'
                : 'Bayernstr. 172 Bremen · Conrad-Wode-Straße 1 Verden. 24h emergency: 0421 391714.'}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5 space-y-8">
              <div className="rounded-2xl border border-border/60 bg-card/50 p-8 space-y-8">
                <div>
                  <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4">
                    Büro Bremen
                  </h3>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Bayernstr. 172</p>
                      <p className="text-muted-foreground">28219 Bremen-Walle</p>
                    </div>
                  </div>
                  <a
                    href="tel:+49421391714"
                    className="mt-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Phone className="w-4 h-4" /> 0421 39 17 14
                  </a>
                  <a
                    href="mailto:info@rotek.de"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Mail className="w-4 h-4" /> info@rotek.de
                  </a>
                </div>

                <div className="border-t border-border/50 pt-8">
                  <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4">
                    Büro Verden
                  </h3>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Conrad-Wode-Straße 1</p>
                      <p className="text-muted-foreground">27283 Verden</p>
                    </div>
                  </div>
                  <a
                    href="tel:+494231982435"
                    className="mt-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Phone className="w-4 h-4" /> 04231 98 2435
                  </a>
                  <a
                    href="mailto:verden@rotek.de"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Mail className="w-4 h-4" /> verden@rotek.de
                  </a>
                </div>

                <div className="border-t border-border/50 pt-8 flex items-start gap-4">
                  <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {language === 'de' ? '24-Stunden Notdienst' : '24h emergency'}
                    </h4>
                    <a
                      href="tel:+49421391714"
                      className="text-primary font-bold text-lg"
                    >
                      0421 391714
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-border/60 bg-card/50 p-8 sm:p-10">
                <h2 className="text-xl font-extrabold text-foreground mb-6">
                  {language === 'de' ? 'Anfrage senden' : 'Send inquiry'}
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  {language === 'de'
                    ? 'Oder nutzen Sie unser Kontaktformular.'
                    : 'Or use our contact form.'}
                </p>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-12 px-6 rounded-xl"
                >
                  {language === 'de' ? 'Formular öffnen' : 'Open form'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer onCtaClick={() => setIsModalOpen(true)} />
      <JoinModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  )
}
