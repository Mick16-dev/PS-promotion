'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { Button } from '@/components/ui/button'
import { Magnetic } from '@/components/ui/magnetic'
import { 
  ArrowRight, 
  BadgeCheck, 
  MoveHorizontal,
  Camera,
  Search,
  FileText,
  Wrench,
  Timer
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ComparisonSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel: string
  afterLabel: string
}

function ComparisonSlider({ beforeImage, afterImage, beforeLabel, afterLabel }: ComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons !== 1) return
    handleMove(e.clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] overflow-hidden rounded-[2rem] cursor-ew-resize select-none border border-white/20 shadow-2xl group"
      onMouseMove={handleMouseMove}
      onMouseDown={(e) => handleMove(e.clientX)}
      onTouchMove={handleTouchMove}
      onTouchStart={(e) => handleMove(e.touches[0].clientX)}
    >
      {/* After Image (background) */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${afterImage})` }}
      />
      {/* Before Image (clipped) */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{
          backgroundImage: `url(${beforeImage})`,
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
        }}
      />
      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white/50 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.5)]"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white backdrop-blur-xl rounded-2xl shadow-2xl flex items-center justify-center border border-white/50"
        >
          <MoveHorizontal className="w-6 h-6 text-primary" />
        </motion.div>
      </div>
      {/* Labels */}
      <div className="absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-white/10 hidden sm:block">
        {beforeLabel}
      </div>
      <div className="absolute top-6 right-6 px-4 py-2 bg-success/80 backdrop-blur-md text-success-foreground text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-white/10 hidden sm:block">
        {afterLabel}
      </div>
    </div>
  )
}

const services = [
  {
    id: 1,
    beforeImage: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1585128903994-9788298932a4?w=800&h=600&fit=crop',
    titleEn: 'Leaking Pipe Repair',
    titleDe: 'Undichte Rohrreparatur',
    descEn: 'Fixed burst water pipe under kitchen sink with precision.',
    descDe: 'Geplatzte Wasserleitung unter Spüle mit Präzision repariert.'
  },
  {
    id: 2,
    beforeImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop',
    titleEn: 'Drain Unclogging',
    titleDe: 'Abfluss-Entstopfung',
    descEn: 'Cleared severe bathroom drain blockage permanently.',
    descDe: 'Starke Badezimmer-Verstopfung dauerhaft beseitigt.'
  },
  {
    id: 3,
    beforeImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop',
    titleEn: 'Faucet Replacement',
    titleDe: 'Armatur-Austausch',
    descEn: 'Installed modern fixtures in master bath seamlessly.',
    descDe: 'Moderne Armaturen im Hauptbad nahtlos installiert.'
  }
]

const diagnosisSteps = [
  { icon: Camera, step: 1 },
  { icon: Search, step: 2 },
  { icon: FileText, step: 3 },
  { icon: Wrench, step: 4 },
]

interface ServicesSectionProps {
  onCtaClick: () => void
}

export function ServicesSection({ onCtaClick }: ServicesSectionProps) {
  const { language, t } = useLanguage()

  return (
    <section className="py-24 sm:py-32 px-4 relative overflow-hidden bg-background">
      <div className="absolute inset-0 mesh-gradient opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-24"
        >

          <h2 className="text-4xl sm:text-6xl font-black text-foreground mb-6 tracking-tighter italic uppercase">
            {language === 'de' ? 'Was wir für Sie tun & Transformationen' : 'What we help you with & Transformations'}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            {language === 'de' ? 'Sehen Sie echte Vorher-Nachher-Ergebnisse unserer Arbeit. Wir verwandeln Sanitärprobleme in perfekte Lösungen.' : 'See real before & after results of our work. We turn plumbing nightmares into perfect solutions.'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Services Gallery */}
          <div className="lg:col-span-7 space-y-12">
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="group bg-card/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20 shadow-xl"
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-black text-foreground mb-2 italic uppercase tracking-tighter">
                    {language === 'de' ? service.titleDe : service.titleEn}
                  </h3>
                  <p className="text-base text-muted-foreground font-medium italic">
                    {language === 'de' ? service.descDe : service.descEn}
                  </p>
                </div>
                <ComparisonSlider
                  beforeImage={service.beforeImage}
                  afterImage={service.afterImage}
                  beforeLabel={language === 'de' ? 'Vorher' : 'Before'}
                  afterLabel={language === 'de' ? 'Nachher' : 'After'}
                />
              </motion.div>
            ))}
          </div>

          {/* Right: How It Works */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 sticky top-24"
          >
            <div className="bg-primary rounded-[2.5rem] p-8 sm:p-10 shadow-2xl shadow-primary/20 relative group overflow-hidden">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity" />

              <h4 className="text-xl sm:text-2xl font-black text-white italic uppercase tracking-widest mb-10 flex items-center gap-3">
                <Timer className="w-6 h-6 text-secondary animate-pulse" />
                {t('features.howItWorks')}
              </h4>

              <div className="space-y-10 relative">
                <div className="absolute left-6 top-10 bottom-10 w-px bg-white/20" />

                {diagnosisSteps.map((step, idx) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15 }}
                    className="flex gap-6 relative z-10"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 ring-4 ring-primary border border-white/20 group-hover:scale-110 group-hover:bg-white/20 transition-all shadow-lg">
                      <step.icon className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="pt-1">
                      <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-1">{t('features.step')} {step.step}</p>
                      <h5 className="text-base sm:text-lg font-bold text-white mb-1 tracking-tight leading-tight">{t(`features.masterDeepDive.step${step.step}.title`)}</h5>
                      <p className="text-xs sm:text-sm text-white/70 font-medium leading-relaxed">{t(`features.masterDeepDive.step${step.step}.desc`)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Magnetic strength={0.2} className="w-full">
                <Button
                  onClick={onCtaClick}
                  className="w-full mt-12 bg-secondary text-white hover:bg-secondary/90 font-black uppercase tracking-[0.2em] py-8 rounded-2xl text-base sm:text-lg shadow-xl shadow-secondary/20 transition-all active:scale-95 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {t('features.cta')}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
