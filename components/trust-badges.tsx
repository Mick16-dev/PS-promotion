'use client'

import { useLanguage } from '@/app/context/language-context'
import { Clock, HardHat, Shield, ClipboardCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const trustItems = [
  {
    icon: Clock,
    keyEn: 'Average response time',
    keyDe: 'Durchschn. Reaktionszeit',
    stat: '15',
    unit: 'min',
    color: 'text-amber-500'
  },
  {
    icon: HardHat,
    keyEn: 'Elite Technicians',
    keyDe: 'Elite-Techniker',
    stat: '50+',
    unit: '',
    color: 'text-slate-900'
  },
  {
    icon: Shield,
    keyEn: 'Trust Guarantee',
    keyDe: 'Vertrauensgarantie',
    stat: '100%',
    unit: '',
    color: 'text-red-600'
  },
  {
    icon: ClipboardCheck,
    keyEn: 'Project Coverage',
    keyDe: 'Projektabdeckung',
    stat: '2M',
    unit: '€',
    color: 'text-slate-900'
  }
]

export function TrustBadges() {
  const { language } = useLanguage()

  const container = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  } as any

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
  } as any

  return (
    <section className="py-20 px-4 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          {trustItems.map((trust, index) => (
            <motion.div
              key={index}
              variants={item}
              className="group flex flex-col items-center text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-3xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/5 transition-colors duration-500">
                <trust.icon className={cn("w-8 h-8 transition-transform duration-500 group-hover:scale-110", trust.color)} />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-foreground tracking-tighter italic">
                    {trust.stat}
                  </span>
                  {trust.unit && (
                    <span className="text-lg font-black text-secondary uppercase italic">
                      {trust.unit}
                    </span>
                  )}
                </div>
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 max-w-[120px] mx-auto leading-tight group-hover:text-primary transition-colors">
                  {language === 'de' ? trust.keyDe : trust.keyEn}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
