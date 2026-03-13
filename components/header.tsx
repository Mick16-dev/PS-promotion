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
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 sm:gap-4 group cursor-pointer shrink-0"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary rounded-2xl flex items-center justify-center shadow-2xl shadow-secondary/20 group-hover:rotate-6 transition-transform p-2 sm:p-3">
              <img src="/logo-custom.svg" alt="Rohr-Blitz Logo" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter leading-none">{t('header.logo')}</span>
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-secondary">Premium Plumbing</span>
            </div>
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 mx-4">
            {[
              { key: 'nav.overview', href: '#' },
              { key: 'nav.services', href: '#' },
              { key: 'nav.pricing', href: '#' },
              { key: 'nav.about', href: '#' },
              { key: 'nav.reviews', href: '#' },
              { key: 'nav.howItWorks', href: '#' },
              { key: 'nav.questions', href: '#' },
              { key: 'nav.contact', href: '#' }
            ].map((item) => (
              <motion.a
                key={item.key}
                href={item.href}
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-2 xl:px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
              >
                {t(item.key)}
              </motion.a>
            ))}
          </nav>

          {/* Language Toggle + Emergency CTA */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
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
            <Magnetic strength={0.3}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={onEmergencyClick}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold px-4 py-4 sm:px-6 sm:py-6 rounded-2xl shadow-xl shadow-destructive/20 relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="relative flex h-3 w-3 mr-2 sm:mr-3">
                    <span className="animate-pulse-premium absolute inline-flex h-full w-full rounded-full bg-red-400/50"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  <span className="hidden lg:inline uppercase tracking-wider text-sm sm:text-base">{t('header.emergency')}</span>
                  <span className="lg:hidden text-xs sm:text-sm">24/7</span>
                </Button>
              </motion.div>
            </Magnetic>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
