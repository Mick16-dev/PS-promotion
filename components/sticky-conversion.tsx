'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/app/context/language-context'
import { ArrowRight, Zap } from 'lucide-react'

export function StickyConversion({ onCtaClick }: { onCtaClick: () => void }) {
  const [isVisible, setIsVisible] = useState(false)
  const { language } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 800) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-lg"
        >
          <div className="bg-slate-900 border border-white/20 backdrop-blur-2xl p-4 rounded-[2rem] shadow-2xl flex items-center justify-between gap-4">
            <div className="hidden sm:flex items-center gap-3 pl-4">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 leading-none mb-1">Response Time</p>
                <p className="text-sm font-black text-white uppercase tracking-tighter">~15 Minutes</p>
              </div>
            </div>
            
            <Button
              onClick={onCtaClick}
              className="flex-1 h-14 bg-white text-slate-900 hover:bg-slate-100 font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all active:scale-95 text-xs"
            >
              {language === 'de' ? 'Sofort-Angebot' : 'Instant Quote Engine'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
