'use client'

import { useState, useRef } from 'react'
import { useLanguage } from '@/app/context/language-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

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
      className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl cursor-ew-resize select-none"
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
        className="absolute top-0 bottom-0 w-1 bg-card shadow-lg"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-card rounded-full shadow-lg flex items-center justify-center">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-4 bg-muted-foreground rounded" />
            <div className="w-0.5 h-4 bg-muted-foreground rounded" />
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 px-3 py-1.5 bg-foreground/80 text-background text-sm font-medium rounded-lg">
        {beforeLabel}
      </div>
      <div className="absolute top-4 right-4 px-3 py-1.5 bg-success/90 text-success-foreground text-sm font-medium rounded-lg">
        {afterLabel}
      </div>
    </div>
  )
}

const projects = [
  {
    id: 1,
    beforeImage: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop',
    titleEn: 'Kitchen Drain Repair',
    titleDe: 'Küchenabfluss-Reparatur',
    descEn: 'Complete drain system overhaul',
    descDe: 'Komplette Abflusssystem-Sanierung'
  },
  {
    id: 2,
    beforeImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop',
    titleEn: 'Bathroom Renovation',
    titleDe: 'Badezimmer-Renovierung',
    descEn: 'Modern fixture installation',
    descDe: 'Moderne Armatur-Installation'
  },
  {
    id: 3,
    beforeImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1613685044678-0a9ae422cf5a?w=800&h=600&fit=crop',
    titleEn: 'Pipe Replacement',
    titleDe: 'Rohraustausch',
    descEn: 'Old pipes replaced with copper',
    descDe: 'Alte Rohre durch Kupfer ersetzt'
  }
]

export function BeforeAfterGallery() {
  const { language, t } = useLanguage()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 text-balance">
            {t('gallery.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('gallery.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden border-0 shadow-lg">
              <ComparisonSlider
                beforeImage={project.beforeImage}
                afterImage={project.afterImage}
                beforeLabel={language === 'de' ? 'Vorher' : 'Before'}
                afterLabel={language === 'de' ? 'Nachher' : 'After'}
              />
              <CardContent className="pt-4">
                <h3 className="font-semibold text-foreground mb-1">
                  {language === 'de' ? project.titleDe : project.titleEn}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'de' ? project.descDe : project.descEn}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA #3 */}
        <div className="text-center">
          <Button 
            onClick={scrollToTop}
            size="lg"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold"
          >
            {t('gallery.cta')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
