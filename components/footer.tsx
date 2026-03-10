'use client'

import { useLanguage } from '@/app/context/language-context'
import { Button } from '@/components/ui/button'
import { Magnetic } from '@/components/ui/magnetic'
import { Phone, Mail, MapPin, ArrowRight, ShieldCheck, Twitter, Linkedin, Instagram } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FooterProps {
  onCtaClick: () => void
}

export function Footer({ onCtaClick }: FooterProps) {
  const { t } = useLanguage()

  return (
    <footer className="bg-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient opacity-10" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Final Conversion Anchor */}
      <div className="py-24 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto glass-card border-white/10 p-12 lg:p-20 rounded-[4rem] text-center relative overflow-hidden group shadow-[0_64px_128px_-32px_rgba(0,0,0,0.5)]"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] group-hover:bg-secondary/30 transition-colors" />

          <ShieldCheck className="w-12 h-12 text-secondary mx-auto mb-8 animate-pulse-premium" />
          <h2 className="text-4xl sm:text-6xl font-black mb-8 tracking-tighter italic uppercase leading-none">
            {t('footer.readyFor')}<span className="text-secondary">{t('footer.goldStandard')}</span>{t('footer.fix')}
          </h2>
          <p className="text-white/60 text-xl font-medium mb-12 max-w-2xl mx-auto italic">
            {t('footer.experience')}
          </p>

          <Magnetic strength={0.2}>
            <Button
              onClick={onCtaClick}
              size="lg"
              className="bg-secondary text-white hover:bg-secondary/90 font-black uppercase tracking-[0.2em] h-20 px-12 rounded-2xl shadow-2xl shadow-secondary/20 group relative overflow-hidden active:scale-95 transition-all"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative z-10 flex items-center gap-3">
                {t('footer.cta')}
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
            </Button>
          </Magnetic>
        </motion.div>
      </div>

      {/* Footer Content */}
      <div className="py-24 px-4 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
          {/* Brand */}
          <div className="md:col-span-2 space-y-8">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center shadow-2xl shadow-secondary/20 group-hover:rotate-6 transition-transform p-3">
                <img src="/logo-custom.svg" alt="Rohr-Blitz Logo" className="w-full h-full object-contain brightness-0 invert" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black italic uppercase tracking-tighter leading-none">{t('header.logo')}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">{t('footer.premiumPlumbing')}</span>
              </div>
            </div>
            <p className="text-white/50 font-medium leading-relaxed max-w-sm italic">
              {t('footer.redefining')}
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Phone className="w-4 h-4 text-secondary" />
                </div>
                <span className="text-lg font-black italic tracking-tighter">+49 800 123 4567</span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Mail className="w-4 h-4 text-secondary" />
                </div>
                <span className="text-lg font-black italic tracking-tighter">vip-support@rohr-blitz.de</span>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30">{t('footer.legal')}</h3>
            <ul className="space-y-4">
              {['privacy', 'terms', 'imprint'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-lg font-black italic uppercase tracking-tighter hover:text-secondary transition-colors block">
                    {t(`footer.${link}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Authority */}
          <div className="space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30">{t('footer.accreditations')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-success" />
                <span className="text-[8px] font-black uppercase tracking-widest text-center">{t('footer.certifiedMeister')}</span>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center gap-2">
                <Phone className="w-6 h-6 text-secondary" />
                <span className="text-[8px] font-black uppercase tracking-widest text-center">{t('footer.emergency')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-12 px-4 border-t border-white/5 bg-black/20 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
          <p>{t('footer.copyright')}</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
              <Twitter className="w-4 h-4" /> Twitter
            </a>
            <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
            <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
              <Instagram className="w-4 h-4" /> Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
