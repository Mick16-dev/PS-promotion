'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone } from 'lucide-react'
import { useLanguage } from '@/app/context/language-context'

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
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md"
        >
          <a
            href="tel:+49421391714"
            className="flex items-center justify-center gap-3 bg-card border border-border/60 backdrop-blur-md p-4 rounded-2xl shadow-xl hover:bg-muted/50 transition-colors"
          >
            <Phone className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-foreground">
              {language === 'de' ? '24h Notdienst' : '24h emergency'}: 0421 391714
            </span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
