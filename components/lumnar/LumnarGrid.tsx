'use client'

import {
  Cctv,
  Droplet,
  FileCheck2,
  ShieldCheck,
  Truck,
  Waves,
  Wrench,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { services } from '@/lib/services-data'
import { SpotlightCard } from './SpotlightCard'

type IconKey =
  | 'rohrreinigung'
  | 'kanalreinigung'
  | 'kanalinspektion'
  | 'kanal-tv-sat'
  | 'hebeanlagen'
  | 'fettabscheider'
  | 'dichtheitspruefung'
  | 'kanalsanierung'

const ICONS: Record<IconKey, React.ReactNode> = {
  rohrreinigung: <Wrench className="h-5 w-5" />,
  kanalreinigung: <Waves className="h-5 w-5" />,
  kanalinspektion: <Cctv className="h-5 w-5" />,
  'kanal-tv-sat': <Truck className="h-5 w-5" />,
  hebeanlagen: <ShieldCheck className="h-5 w-5" />,
  fettabscheider: <Droplet className="h-5 w-5" />,
  dichtheitspruefung: <FileCheck2 className="h-5 w-5" />,
  kanalsanierung: <Wrench className="h-5 w-5" />,
}

export type LumnarGridProps = Readonly<{
  className?: string
}>

export function LumnarGrid({ className }: LumnarGridProps) {
  return (
    <div className={cn('grid gap-4 sm:gap-5 lg:gap-6 md:grid-cols-2 lg:grid-cols-3', className)}>
      {services.map((s) => (
        <SpotlightCard
          key={s.id}
          href={`/services/${s.slug}`}
          eyebrow="Leistung"
          title={s.titleDe}
          subtitle={s.shortDescDe}
          icon={ICONS[s.id]}
          mediaUrl={s.afterImage}
          ctaLabel="Details"
          className={cn(
            // bento accents
            s.id === 'kanalinspektion' ? 'lg:col-span-2' : null
          )}
        />
      ))}
    </div>
  )
}

