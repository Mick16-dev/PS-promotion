'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import { 
  Droplet, 
  Wrench, 
  CircleOff, 
  Thermometer, 
  Trash2, 
  Clock, 
  Zap,
  Construction,
  ArrowRight,
  HardHat
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const allServices = [
  {
    id: 'drain-cleaning',
    icon: CircleOff,
    titleEn: 'Expert Drain Cleaning',
    titleDe: 'Abflussreinigung',
    descEn: 'Removal of stubborn clogs and blockages from sinks, showers, and toilets using specialized equipment.',
    descDe: 'Beseitigung hartnäckiger Verstopfungen in Spülbecken, Duschen und Toiletten mit Spezialgeräten.',
    featured: false,
    image: '/services/drain.jpg'
  },
  {
    id: 'leak-detection',
    icon: Droplet,
    titleEn: 'Leak Detection & Repair',
    titleDe: 'Leckortung & Reparatur',
    descEn: 'Pinpoint accuracy in finding hidden leaks to prevent water damage and high utility bills.',
    descDe: 'Präzise Ortung verborgener Lecks zur Vermeidung von Wasserschäden und hohen Kosten.',
    featured: true,
    image: '/services/leak.jpg'
  },
  {
    id: 'water-heater',
    icon: Thermometer,
    titleEn: 'Water Heater Services',
    titleDe: 'Warmwasserservice',
    descEn: 'Repair and installation of tankless and traditional water heaters for consistent hot water.',
    descDe: 'Reparatur und Installation von Durchlauferhitzern und Speichern für konstantes Warmwasser.',
    featured: false,
    image: '/services/water-heater.jpg'
  },
  {
    id: 'fixture-replacement',
    icon: Wrench,
    titleEn: 'Fixture Replacement',
    titleDe: 'Armaturentausch',
    descEn: 'Upgrading faucets, showerheads, and toilets with premium, water-efficient models.',
    descDe: 'Modernisierung von Armaturen und Toiletten mit effizienten Premium-Modellen.',
    featured: false,
    image: '/services/fixture.jpg'
  },
  {
    id: 'sewer-line',
    icon: Construction,
    titleEn: 'Sewer Line Repair',
    titleDe: 'Kanalreparatur',
    descEn: 'Major sewer line diagnostics and restoration including root removal and pipe lining.',
    descDe: 'Kanaldiagnose und -sanierung, einschließlich Wurzelentfernung und Rohrreinigung.',
    featured: false,
    image: '/services/sewer.jpg'
  },
  {
    id: 'garbage-disposal',
    icon: Trash2,
    titleEn: 'Garbage Disposal Repair',
    titleDe: 'Küchenabfallzerkleinerer',
    descEn: 'Fixing jammed or broken kitchen disposals to keep your kitchen running smoothly.',
    descDe: 'Reparatur von Küchenabfallzerkleinerern für einen reibungslosen Küchenbetrieb.',
    featured: false,
    image: '/services/disposal.jpg'
  },
  {
    id: 'appliance-install',
    icon: Zap,
    titleEn: 'Appliance Installation',
    titleDe: 'Geräteinstallation',
    descEn: 'Professional hook-up for dishwashers, washing machines, and refrigerators.',
    descDe: 'Fachgerechter Anschluss von Spülmaschinen, Waschmaschinen und Kühlschränken.',
    featured: false,
    image: '/services/appliance.jpg'
  },
  {
    id: 'emergency-service',
    icon: Clock,
    titleEn: '24/7 Emergency Repairs',
    titleDe: '24/7 Notfallservice',
    descEn: 'Rapid response for burst pipes, major floods, and urgent plumbing crises.',
    descDe: 'Schnelle Hilfe bei Rohrbruche, Überschwemmungen und dringenden Sanitärkrisen.',
    featured: true,
    image: '/services/emergency.jpg'
  }
]

export default function ServicesPage() {
  const { language, t } = useLanguage()

  return (
    <main className="min-h-screen bg-slate-50">
      <Header onEmergencyClick={() => window.location.href = '/contact'} />
      
      <div className="pt-32 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter mb-6 text-slate-900">
              {language === 'de' ? 'Unsere Meister-Leistungen' : 'Our Master Services'}
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              {language === 'de' 
                ? 'Umfassende Sanitärlösungen, ausgeführt mit deutscher Ingenieurspräzision und jahrelanger Erfahrung.' 
                : 'Comprehensive plumbing solutions executed with German engineering precision and years of experience.'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allServices.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`group bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden flex flex-col ${service.featured ? 'lg:col-span-2 lg:row-span-1' : ''}`}
              >
                {service.image && (
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image 
                      src={service.image}
                      alt={language === 'de' ? service.titleDe : service.titleEn}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 grayscale hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
                  </div>
                )}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-3 group-hover:text-red-600 transition-colors">
                    {language === 'de' ? service.titleDe : service.titleEn}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium mb-8">
                    {language === 'de' ? service.descDe : service.descEn}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <Button variant="ghost" className="p-0 text-slate-900 font-black uppercase tracking-widest text-[10px] hover:bg-transparent hover:text-red-600 h-auto">
                      <Link href={`/contact`} className="flex items-center gap-2">
                        {language === 'de' ? 'Angebot anfordern' : 'Get Quote'}
                        <ArrowRight className="w-3 h-3 text-red-600" />
                      </Link>
                    </Button>
                    <div className="flex items-center gap-1">
                       <HardHat className="w-3 h-3 text-slate-400" />
                       <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400">Master Certified</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer onCtaClick={() => window.location.href = '/contact'} />
    </main>
  )
}
