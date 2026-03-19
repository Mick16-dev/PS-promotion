'use client'

import { useLanguage } from '@/app/context/language-context'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'

const areas = ['Walle', 'Findorff', 'Horn', 'Neustadt', 'Verden', 'Umzu']

export function Einsatzgebiete() {
  const { language } = useLanguage()

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-2">
            {language === 'de' ? 'Einsatzgebiete' : 'Service Areas'}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {language === 'de' ? 'Bremen, Verden und Umzu' : 'Bremen, Verden & Surroundings'}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3"
        >
          {areas.map((area, i) => (
            <div
              key={area}
              className="flex items-center gap-2 px-4 py-2.5 rounded-none border border-border/50 bg-card/40 text-sm font-semibold text-foreground"
            >
              <MapPin className="w-4 h-4 text-primary" />
              {area}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
