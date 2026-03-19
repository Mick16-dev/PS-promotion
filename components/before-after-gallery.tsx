'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { Button } from '@/components/ui/button'
import { ArrowRight, BadgeCheck, MoveHorizontal } from 'lucide-react'
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
      className="relative w-full aspect-[4/5] sm:aspect-[4/3] overflow-hidden rounded-[2rem] cursor-ew-resize select-none border border-white/20 shadow-2xl group"
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
      <div className="absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-white/10">
        {beforeLabel}
      </div>
      <div className="absolute top-6 right-6 px-4 py-2 bg-success/80 backdrop-blur-md text-success-foreground text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-white/10">
        {afterLabel}
      </div>
    </div>
  )
}

const projects = [
  {
    id: 1,
    beforeImage: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1585128903994-9788298932a4?w=800&h=600&fit=crop',
    titleEn: 'Leaking Pipe Repair',
    titleDe: 'Undichte Rohrreparatur',
    descEn: 'Fixed burst water pipe under kitchen sink',
    descDe: 'Geplatzte Wasserleitung unter Spüle repariert'
  },
  {
    id: 2,
    beforeImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop',
    titleEn: 'Drain Unclogging',
    titleDe: 'Abfluss-Entstopfung',
    descEn: 'Cleared severe bathroom drain blockage',
    descDe: 'Starke Badezimmer-Verstopfung beseitigt'
  },
  {
    id: 3,
    beforeImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop',
    titleEn: 'Faucet Replacement',
    titleDe: 'Armatur-Austausch',
    descEn: 'Installed modern fixtures in master bath',
    descDe: 'Moderne Armaturen im Hauptbad installiert'
  }
]

interface BeforeAfterGalleryProps {
  onCtaClick: () => void
}

export function BeforeAfterGallery({ onCtaClick }: BeforeAfterGalleryProps) {
  const { language, t } = useLanguage()

  return (
    <section className="py-32 px-4 relative overflow-hidden bg-background">
      <div className="absolute inset-0 mesh-gradient opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary text-xs font-black rounded-xl uppercase tracking-[0.2em] mb-6 shadow-sm">
            <BadgeCheck className="w-4 h-4" />
            {t('gallery.badge') || "Visual Excellence"}
          </span>
          <h2 className="text-4xl sm:text-6xl font-black text-foreground mb-6 tracking-tighter italic uppercase underline decoration-primary decoration-8 underline-offset-8">
            {t('gallery.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            {t('gallery.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10 mb-24">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <ComparisonSlider
                beforeImage={project.beforeImage}
                afterImage={project.afterImage}
                beforeLabel={language === 'de' ? 'Vorher' : 'Before'}
                afterLabel={language === 'de' ? 'Nachher' : 'After'}
              />
              <div className="pt-8 px-2">
                <h3 className="text-2xl font-black text-foreground mb-2 italic uppercase tracking-tighter">
                  {language === 'de' ? project.titleDe : project.titleEn}
                </h3>
                <p className="text-muted-foreground font-medium italic">
                  {language === 'de' ? project.descDe : project.descEn}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA #3 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            onClick={onCtaClick}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase tracking-[0.2em] h-20 px-12 rounded-2xl shadow-2xl shadow-primary/20 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative z-10 flex items-center gap-3">
              {t('gallery.cta')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </span>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
