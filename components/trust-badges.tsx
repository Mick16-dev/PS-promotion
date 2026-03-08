'use client'

import { useLanguage } from '@/app/context/language-context'
import { Clock, Award, Shield, BadgeCheck, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const trustItems = [
  {
    icon: Clock,
    keyEn: 'Average response time',
    keyDe: 'Durchschn. Reaktionszeit',
    stat: '15',
    unit: 'min',
    color: 'text-amber-400'
  },
  {
    icon: Award,
    keyEn: 'Elite Technicians',
    keyDe: 'Elite-Techniker',
    stat: '50+',
    unit: '',
    color: 'text-secondary'
  },
  {
    icon: Shield,
    keyEn: 'Trust Guarantee',
    keyDe: 'Vertrauensgarantie',
    stat: '100%',
    unit: '',
    color: 'text-success'
  },
  {
    icon: BadgeCheck,
    keyEn: 'Project Coverage',
    keyDe: 'Projektabdeckung',
    stat: '2M',
    unit: '€',
    color: 'text-blue-400'
  }
]

export function TrustBadges() {
  const { language, t } = useLanguage()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  } as any

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "circOut" } }
  } as any

  return (
    <section className="py-24 px-4 bg-primary relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center mb-16"
        >
          <div className="flex items-center gap-2 mb-4">
             <div className="h-[1px] w-8 bg-secondary" />
             <span className="text-secondary font-black uppercase tracking-[0.3em] text-[10px]">{t('trust.badge') || "The Gold Standard"}</span>
             <div className="h-[1px] w-8 bg-secondary" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white text-center italic uppercase tracking-tighter max-w-3xl">
            {t('trust.title')}
          </h2>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {trustItems.map((trust, index) => (
            <motion.div 
              key={index}
              variants={item}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 shadow-2xl group transition-all duration-500 hover:bg-white/10 hover:border-white/20"
            >
              <div className="relative mb-8">
                 <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors duration-500">
                   <trust.icon className={`w-8 h-8 ${trust.color} group-hover:scale-110 transition-transform duration-500`} />
                 </div>
                 <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="absolute -top-2 -right-2"
                 >
                   <Sparkles className="w-4 h-4 text-white/30" />
                 </motion.div>
              </div>
              
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-black text-white tracking-tighter italic font-heading">
                  {trust.stat}
                </span>
                {trust.unit && (
                  <span className="text-xl font-bold text-secondary uppercase tracking-tight">
                    {trust.unit}
                  </span>
                )}
              </div>
              
              <p className="text-sm font-bold uppercase tracking-widest text-white/50 group-hover:text-white/80 transition-colors">
                {language === 'de' ? trust.keyDe : trust.keyEn}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
