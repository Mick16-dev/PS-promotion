'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { services } from '@/lib/services-data'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Video, Droplets, Zap, ShieldCheck, Activity } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const iconMap: Record<string, any> = {
  'kanal-tv': Video,
  'rohrreinigung': Droplets,
  'fettabscheider': Activity,
  'kanalsanierung': ShieldCheck,
  'hebeanlagen': Zap
}

export function LumnarGrid() {
  const { t, language } = useLanguage()

  // Define the grid layout for Bento style
  // We'll map services to specific grid spans
  const getGridSpan = (id: string) => {
    switch (id) {
      case 'kanal-tv': return 'md:col-span-2 md:row-span-2' // Featured
      case 'rohrreinigung': return 'md:col-span-1 md:row-span-2'
      default: return 'md:col-span-1 md:row-span-1'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:grid-rows-3 auto-rows-fr">
      {services.map((service, idx) => {
        const Icon = iconMap[service.id] || Droplets
        const spanClass = getGridSpan(service.id)
        
        return (
          <SpotlightCard
            key={service.id}
            className={cn(
              "flex flex-col p-6 min-h-[240px]",
              spanClass
            )}
            spotlightColor={service.id === 'kanal-tv' ? 'rgba(255, 204, 0, 0.1)' : 'rgba(215, 0, 20, 0.1)'}
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-white">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white/5 px-2 py-1 rounded border border-white/5">
                  ID: ROT-{service.id.toUpperCase()}
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2 leading-tight uppercase tracking-tight">
                  {t(`services.${service.id}.title`)}
                </h3>
                {service.slogan && (
                  <p className="text-xs font-bold text-red-500 uppercase tracking-wide mb-3">
                    "{service.slogan}"
                  </p>
                )}
                <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                  {t(`services.${service.id}.desc`)}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-lg font-mono font-bold text-white/80">
                  €{service.price}
                  <span className="text-[10px] text-slate-500 ml-1 uppercase">Base Rate</span>
                </span>
                <Button asChild variant="ghost" className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/5 group">
                  <Link href={`/services/${service.id}`}>
                    Inspect
                    <ArrowRight className="ml-2 w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </SpotlightCard>
        )
      })}

      {/* Placeholder for Industrial Heritage if grid is not full */}
      <SpotlightCard className="md:col-span-1 md:row-span-1 bg-gradient-to-br from-red-600/20 to-transparent flex flex-col justify-center p-6 border-red-500/30">
        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Heritage Signal</h4>
        <p className="text-xs text-slate-300">
          Serving Bremen & Verden since 1972. Certified Master Enterprise.
        </p>
        <div className="mt-4 flex gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[9px] font-bold uppercase text-red-500">Live Operation Unit 4</span>
        </div>
      </SpotlightCard>
    </div>
  )
}
