'use client'

import { Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { Button } from '@/components/ui/button'
import { Magnetic } from '@/components/ui/magnetic'
import { cn } from '@/lib/utils'

interface HeaderProps {
  onEmergencyClick: () => void
}

export function Header({ onEmergencyClick }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage()

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="glass-header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center shadow-2xl shadow-secondary/20 p-3">
              <img src="/logo-custom.svg" alt="Rohr-Blitz Logo" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black italic uppercase tracking-tighter leading-none">{t('header.logo')}</span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Premium Plumbing</span>
            </div>
          </motion.div>

          {/* Language Toggle + Emergency CTA */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className="hidden md:flex items-center bg-muted/50 backdrop-blur-sm rounded-2xl p-1.5 border border-border/50">
              {(['en', 'de'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "relative px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300",
                    language === lang 
                      ? "text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <span className="relative z-10 uppercase">{lang}</span>
                  {language === lang && (
                    <motion.div 
                      layoutId="activeLang"
                      className="absolute inset-0 bg-primary rounded-xl shadow-sm"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Emergency CTA */}
            <Button 
              onClick={onEmergencyClick}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold px-5 py-3 rounded-xl shadow-md flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              <span className="hidden sm:inline">
                {t('header.emergency')}
              </span>
              <span className="sm:hidden">24/7</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
