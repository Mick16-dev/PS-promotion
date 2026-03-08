'use client'

import { Phone, Droplets } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { Button } from '@/components/ui/button'
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
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]">
              <Droplets className="w-7 h-7 text-primary-foreground group-hover:rotate-12 transition-transform" />
            </div>
            <div className="flex flex-col -gap-1">
              <span className="text-2xl font-black text-foreground tracking-tighter leading-none italic uppercase">Rohr-Blitz</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] leading-none ml-0.5">Premium Plumbing</span>
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

            {/* Emergency CTA - CTA #2 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={onEmergencyClick}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold px-6 py-6 rounded-2xl shadow-xl shadow-destructive/20 relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative flex h-3 w-3 mr-3">
                  <span className="animate-pulse-premium absolute inline-flex h-full w-full rounded-full bg-red-400/50"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                <Phone className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline uppercase tracking-wider">{t('header.emergency')}</span>
                <span className="sm:hidden">24/7</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
  )
}
