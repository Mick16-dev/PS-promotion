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
    <footer id="footer" className="bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10" />

      {/* Final Conversion Anchor */}
      <div className="py-12 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto border border-white/10 p-8 lg:p-10 rounded-xl text-center bg-white/5"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight uppercase">
            {t('footer.readyFor')}<span className="text-slate-400">{t('footer.goldStandard')}</span>{t('footer.fix')}
          </h2>
          <p className="text-white/60 text-sm font-medium mb-6 max-w-md mx-auto">
            {t('footer.experience')}
          </p>

          <Button
            onClick={onCtaClick}
            className="bg-white text-slate-900 hover:bg-slate-100 font-bold uppercase tracking-wider h-10 px-6 rounded-lg text-xs"
          >
            <span className="flex items-center gap-2">
              {t('footer.cta')}
              <ArrowRight className="w-5 h-5" />
            </span>
          </Button>
        </motion.div>
      </div>

      {/* Footer Content */}
      <div className="py-12 px-4 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2">
                <img src="/logo-custom.svg" alt="Rohr-Blitz Logo" className="w-full h-full object-contain brightness-0" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold uppercase tracking-tight leading-none">{t('header.logo')}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('footer.premiumPlumbing')}</span>
              </div>
            </div>
            <p className="text-slate-400 font-medium leading-relaxed max-w-sm">
              {t('footer.redefining')}
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-base font-bold tracking-tight">+49 800 123 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-base font-bold tracking-tight">support@rohr-blitz.de</span>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">{t('footer.legal')}</h3>
            <ul className="space-y-3">
              {['privacy', 'terms', 'imprint'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-base font-bold uppercase tracking-tight hover:text-slate-400 transition-colors block">
                    {t(`footer.${link}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Authority */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">{t('footer.accreditations')}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-slate-400" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-center">{t('footer.certifiedMeister')}</span>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center gap-2">
                <Phone className="w-5 h-5 text-slate-400" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-center">{t('footer.emergency')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-10 px-4 border-t border-white/5 bg-black/20 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          <p>{t('footer.copyright')}</p>
          <div className="flex gap-6">
            {['Twitter', 'LinkedIn', 'Instagram'].map(platform => (
              <a key={platform} href="#" className="hover:text-white transition-colors">{platform}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
