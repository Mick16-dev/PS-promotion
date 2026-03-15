'use client'

import { useParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useLanguage } from '@/app/context/language-context'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, Clock, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const serviceDetails: Record<string, any> = {
  'drain-cleaning': {
    titleEn: 'Expert Drain Cleaning',
    titleDe: 'Abflussreinigung',
    descEn: 'Removal of stubborn clogs and blockages from sinks, showers, and toilets using specialized equipment.',
    descDe: 'Beseitigung hartnäckiger Verstopfungen in Spülbecken, Duschen und Toiletten mit Spezialgeräten.',
    image: '/services/drain-cleaning.png',
    featuresEn: ['Power-jet cleaning', 'Camera inspection included', 'Deep-clean guarantee', 'No-mess promise'],
    featuresDe: ['Hochdruckreinigung', 'Inklusive Kamera-Inspektion', 'Tiefenreinigungsgarantie', 'Sauberkeitsversprechen']
  },
  'leak-detection': {
    titleEn: 'Leak Detection & Repair',
    titleDe: 'Leckortung & Reparatur',
    descEn: 'Pinpoint accuracy in finding hidden leaks to prevent water damage and high utility bills.',
    descDe: 'Präzise Ortung verborgener Lecks zur Vermeidung von Wasserschäden und hohen Kosten.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1600&q=80',
    featuresEn: ['Acoustic detection', 'Thermal imaging', 'Non-invasive methods', 'Repair plan provided'],
    featuresDe: ['Akustische Ortung', 'Thermografie-Analyse', 'Zerstörungsfreie Methoden', 'Detaillierter Reparaturplan']
  },
  'water-heater': {
    titleEn: 'Water Heater Services',
    titleDe: 'Warmwasserservice',
    descEn: 'Repair and installation of tankless and traditional water heaters for consistent hot water.',
    descDe: 'Reparatur und Installation von Durchlauferhitzern und Speichern für konstantes Warmwasser.',
    image: '/water-heater-overview.png',
    featuresEn: ['All brands serviced', 'Same-day hot water', 'Efficiency check', 'Parts warranty'],
    featuresDe: ['Service für alle Marken', 'Warmwasser am selben Tag', 'Effizienzprüfung', 'Teilegarantie']
  },
  'fixture-replacement': {
    titleEn: 'Fixture Replacement',
    titleDe: 'Armaturentausch',
    descEn: 'Upgrading faucets, showerheads, and toilets with premium, water-efficient models.',
    descDe: 'Modernisierung von Armaturen und Toiletten mit effizienten Premium-Modellen.',
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca1f987?w=1600&q=80',
    featuresEn: ['Premium brands available', 'Leak-proof seal', 'Same-day service', 'Disposal of old fixtures'],
    featuresDe: ['Premium-Marken verfügbar', 'Auslaufsichere Versiegelung', 'Service am selben Tag', 'Altelemente-Entsorgung']
  },
  'sewer-line': {
    titleEn: 'Sewer Line Repair',
    titleDe: 'Kanalreparatur',
    descEn: 'Major sewer line diagnostics and restoration including root removal and pipe lining.',
    descDe: 'Kanaldiagnose und -sanierung, einschließlich Wurzelentfernung und Rohrreinigung.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80',
    featuresEn: ['Root removal technology', 'Pipe lining available', 'Visual diagnostics', 'Workmanship guarantee'],
    featuresDe: ['Wurzelentfernung', 'Rohrainzug-Verfahren', 'Visuelle Diagnose', 'Meister-Gewährleistung']
  },
  'garbage-disposal': {
    titleEn: 'Garbage Disposal Repair',
    titleDe: 'Küchenabfallzerkleinerer',
    descEn: 'Fixing jammed or broken kitchen disposals to keep your kitchen running smoothly.',
    descDe: 'Reparatur von Küchenabfallzerkleinerern für einen reibungslosen Küchenbetrieb.',
    image: '/services/garbage-disposal.png',
    featuresEn: ['Jam clearance', 'Motor replacement', 'Leak sealing', 'Brand-specific parts'],
    featuresDe: ['Blockadenlösung', 'Motor-Austausch', 'Abdichtungsservice', 'Original-Ersatzteile']
  },
  'appliance-install': {
    titleEn: 'Appliance Installation',
    titleDe: 'Geräteinstallation',
    descEn: 'Professional hook-up for dishwashers, washing machines, and refrigerators.',
    descDe: 'Fachgerechter Anschluss von Spülmaschinen, Waschmaschinen und Kühlschränken.',
    image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=1600&q=80',
    featuresEn: ['Secure connections', 'Water line routing', 'Leveling & testing', 'Warranty protected'],
    featuresDe: ['Sichere Anschlüsse', 'Wasserleitungsausbau', 'Ausrichtung & Testlauf', 'Herstellergarantie']
  },
  'emergency-service': {
    titleEn: '24/7 Emergency Repairs',
    titleDe: '24/7 Notfallservice',
    descEn: 'Rapid response for burst pipes, major floods, and urgent plumbing crises.',
    descDe: 'Schnelle Hilfe bei Rohrbruche, Überschwemmungen und dringenden Sanitärkrisen.',
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1600&q=80',
    featuresEn: ['30min response time', 'Master lead dispatch', 'Crisis management', 'Immediate containment'],
    featuresDe: ['30 Min. Reaktionszeit', 'Meister-Einsatzleitung', 'Krisenmanagement', 'Sofort-Eingrenzung']
  }
}

export default function ServicePage() {
  const { id } = useParams()
  const { language, t } = useLanguage()
  const service = serviceDetails[id as string] || serviceDetails['leaking-pipe-repair']

  return (
    <main className="min-h-screen bg-slate-50">
      <Header onEmergencyClick={() => {}} />

      <div className="pt-32 pb-24 px-4 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <Link href="/#services" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-12 font-bold uppercase tracking-widest text-xs">
            <ArrowLeft className="w-4 h-4" />
            {language === 'de' ? 'Zurück zu den Leistungen' : 'Back to Services'}
          </Link>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 uppercase tracking-tight leading-none">
                {language === 'de' ? service.titleDe : service.titleEn}
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed">
                {language === 'de' ? service.descDe : service.descEn}
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {(language === 'de' ? service.featuresDe : service.featuresEn).map((f: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">{f}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 flex flex-wrap gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-slate-700" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">{t('hero.response')}</p>
                    <p className="text-sm font-bold text-slate-900">15-30 Min</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-slate-700" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">{t('footer.certifiedMeister')}</p>
                    <p className="text-sm font-bold text-slate-900">Verified Expert</p>
                  </div>
                </div>
              </div>

              <Button size="lg" className="w-full sm:w-auto h-14 px-10 bg-slate-900 text-white hover:bg-slate-800 font-bold uppercase tracking-widest rounded-lg text-sm shadow-md transition-all">
                {t('funnel.cta')}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden shadow-xl"
            >
              <img src={service.image} alt={service.titleEn} className="w-full h-full object-cover" />
              {id === 'appliance-install' && (
                <div className="absolute top-6 right-6 bg-slate-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    {language === 'de' ? 'Fachgerechter Anschluss' : 'Professional Hookup'}
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer onCtaClick={() => {}} />
    </main>
  )
}
