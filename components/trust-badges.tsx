'use client'

import { useLanguage } from '@/app/context/language-context'
import { Clock, Truck, Users, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'

const trustItems = [
  { icon: Building2, stat: '1972', labelDe: 'Seit Jahrgang', labelEn: 'Founded' },
  { icon: Users, stat: '32', labelDe: 'Mitarbeitende', labelEn: 'Staff' },
  { icon: Truck, stat: '11', labelDe: 'Spezial-Fahrzeuge', labelEn: 'Vehicles' },
  { icon: Clock, stat: '24/7', labelDe: 'Notdienst', labelEn: 'Emergency' },
]

export function TrustBadges() {
  const { language } = useLanguage()

  return (
    <section className="py-14 px-4 border-b border-border/50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {trustItems.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center gap-3 py-4 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm"
            >
              <item.icon className="w-6 h-6 text-primary" />
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {item.stat}
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {language === 'de' ? item.labelDe : item.labelEn}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
