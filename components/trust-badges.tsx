'use client'

import {
  Clock,
  Shield,
  ClipboardCheck,
  Camera, 
  Upload, 
  Activity, 
  CheckCircle, 
  ArrowRight, 
  MapPin, 
  ShieldCheck, 
  Wrench, 
  Box, 
  Cpu, 
  HardHat 
} from 'lucide-react'
import { useLanguage } from '@/app/context/language-context'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const trustItems = [
  {
    icon: Clock,
    keyEn: 'Response Time',
    keyDe: 'Notdienst-Anfahrt',
    stat: '20',
    unit: 'min',
    color: 'text-red-600'
  },
  {
    icon: HardHat,
    keyEn: 'Industry Staff',
    keyDe: 'Fachpersonal (Fest)',
    stat: '32',
    unit: '',
    color: 'text-white'
  },
  {
    icon: Shield,
    keyEn: 'Founding Year',
    keyDe: 'Gegründet in',
    stat: '1972',
    unit: '',
    color: 'text-red-600'
  },
  {
    icon: ClipboardCheck,
    keyEn: 'Specialized Trucks',
    keyDe: 'Spezial-Fahrzeuge',
    stat: '11',
    unit: '',
    color: 'text-white'
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
    <section className="py-24 px-4 bg-[#0A0B0D] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5" />
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
              <div className="w-16 h-16 rounded-none bg-white/5 flex items-center justify-center group-hover:bg-red-600/10 transition-colors duration-500 border border-white/10 group-hover:border-red-600/50">
                <trust.icon className={cn("w-6 h-6 transition-transform duration-500 group-hover:scale-110", trust.color)} />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-foreground tracking-tighter italic">
                    {trust.stat}
                  </span>
                  {trust.unit && (
                    <span className="text-xl font-black text-red-600 uppercase italic">
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
