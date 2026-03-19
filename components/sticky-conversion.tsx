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
      setIsVisible(window.scrollY > 800)
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
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-sm px-4"
        >
          <div className="bg-[#0A0B0D]/95 border border-white/10 backdrop-blur-xl p-2 rounded-none shadow-3xl flex items-center justify-between gap-2 border-b-4 border-red-600">
            <div className="flex flex-col items-start pl-4">
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-red-600 leading-none mb-1">Status</p>
              <p className="text-[10px] font-black text-white uppercase tracking-tighter italic whitespace-nowrap">20 MIN ANFAHRT</p>
            </div>
            
            <Button
              onClick={onCtaClick}
              className="flex-1 h-12 bg-red-600 text-white hover:bg-red-700 font-black uppercase tracking-widest rounded-none shadow-xl transition-all active:scale-95 text-[10px] border-r-2 border-b-2 border-red-900"
            >
              {language === 'de' ? 'Digitaler Meister-Check' : 'Master Visual Service'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
