'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { Button } from '@/components/ui/button'
import { ArrowRight, MoveHorizontal } from 'lucide-react'
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
      className="relative w-full aspect-[4/5] sm:aspect-[4/3] overflow-hidden rounded-xl cursor-ew-resize select-none border border-border bg-black/5"
      onMouseMove={handleMouseMove}
      onMouseDown={(e) => handleMove(e.clientX)}
      onTouchMove={handleTouchMove}
      onTouchStart={(e) => handleMove(e.touches[0].clientX)}
    >
      {/* After Image (background) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${afterImage})` }}
      />

      {/* Before Image (clipped) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${beforeImage})`,
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
        }}
      />

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/70"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center border border-border">
          <MoveHorizontal className="w-4 h-4 text-primary" />
        </div>
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

/** Real plumbing imagery (Unsplash – free use, actual plumbing photos) */
const projects = [
  {
    id: 1,
    slug: 'leak-repair',
    beforeImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80',
    afterImage: 'https://images.unsplash.com/photo-1542632867-261e4be41c7c?auto=format&fit=crop&w=900&q=80',
    titleEn: 'Leaking Pipe Repair',
    titleDe: 'Undichte Rohrreparatur',
    descEn: 'Fixed pipes under kitchen sink',
    descDe: 'Undichte Leitungen unter der Spüle repariert'
  },
  {
    id: 2,
    slug: 'drain-cleaning',
    beforeImage: 'https://images.unsplash.com/photo-1618228298959-0198d476d2ba?auto=format&fit=crop&w=900&q=80',
    afterImage: 'https://images.unsplash.com/photo-1650246363606-a2402ec42b08?auto=format&fit=crop&w=900&q=80',
    titleEn: 'Drain Unblocking',
    titleDe: 'Abfluss-Entstopfung',
    descEn: 'Cleared drain blockage, clean pipes',
    descDe: 'Verstopfung beseitigt, saubere Rohre'
  },
  {
    id: 3,
    slug: 'bathroom-plumbing',
    beforeImage: 'https://images.unsplash.com/photo-1596180744691-d19a1b90b53c?auto=format&fit=crop&w=900&q=80',
    afterImage: 'https://images.unsplash.com/photo-1595515770330-ceeea7d82cfd?auto=format&fit=crop&w=900&q=80',
    titleEn: 'Bathroom Fittings',
    titleDe: 'Bad und Armaturen',
    descEn: 'New faucet and basin installation',
    descDe: 'Neue Armatur und Waschbecken installiert'
  }
]

interface BeforeAfterGalleryProps {
  onCtaClick: () => void
}

export function BeforeAfterGallery({ onCtaClick }: BeforeAfterGalleryProps) {
  const { language, t } = useLanguage()

  return (
    <section id="gallery" className="py-32 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
            {t('gallery.title')}
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('gallery.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <Link href={`/services/${project.slug}`} className="block">
              <ComparisonSlider
                beforeImage={project.beforeImage}
                afterImage={project.afterImage}
                beforeLabel={language === 'de' ? 'Vorher' : 'Before'}
                afterLabel={language === 'de' ? 'Nachher' : 'After'}
              />
              <div className="pt-6 px-1">
                <h3 className="text-xl font-semibold text-foreground mb-1 tracking-tight group-hover:text-primary transition-colors">
                  {language === 'de' ? project.titleDe : project.titleEn}
                </h3>
                <p className="text-muted-foreground font-medium italic">
                  {language === 'de' ? project.descDe : project.descEn}
                </p>
              </div>
              </Link>
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
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-12 px-8 rounded-xl"
          >
            <span className="flex items-center gap-2">
              {t('gallery.cta')}
              <ArrowRight className="w-5 h-5" />
            </span>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
