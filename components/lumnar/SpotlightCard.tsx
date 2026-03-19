'use client'

import Link from 'next/link'
import { type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'
import { useSpotlight } from './use-spotlight'

export type SpotlightCardProps = Readonly<{
  href: string
  title: string
  subtitle: string
  eyebrow?: string
  icon?: React.ReactNode
  mediaUrl?: string
  ctaLabel?: string
  className?: string
}> &
  Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'title'>

export function SpotlightCard({
  href,
  title,
  subtitle,
  eyebrow,
  icon,
  mediaUrl,
  ctaLabel = 'Mehr',
  className,
  ...rest
}: SpotlightCardProps) {
  const spotlight = useSpotlight({ stiffness: 0.16, idleFreeze: true })

  return (
    <Link
      href={href}
      ref={spotlight.ref as unknown as React.RefObject<HTMLAnchorElement | null>}
      onPointerEnter={spotlight.onPointerEnter}
      onPointerLeave={spotlight.onPointerLeave}
      onPointerMove={spotlight.onPointerMove}
      onFocus={spotlight.onFocus}
      onBlur={spotlight.onBlur}
      className={cn(
        'group relative overflow-hidden rounded-none border border-border/60 bg-card/60 backdrop-blur-[6px]',
        'transition-[border-color,transform] duration-200 ease-out',
        'hover:-translate-y-[1px] hover:border-border/90',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className
      )}
      {...rest}
    >
      {/* Spotlight overlay */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200',
          'group-hover:opacity-100 group-focus-visible:opacity-100'
        )}
        style={{
          background:
            'radial-gradient(520px circle at var(--spotlight-x) var(--spotlight-y), color-mix(in oklch, var(--color-foreground) 14%, transparent) 0%, color-mix(in oklch, var(--color-primary) 10%, transparent) 28%, transparent 60%)',
          opacity: 'var(--spotlight-on)',
        }}
      />

      {/* Subtle industrial hairline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
        style={{
          boxShadow:
            'inset 0 0 0 1px color-mix(in oklch, var(--color-foreground) 10%, transparent)',
        }}
      />

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 shrink-0 text-foreground/90">{icon}</div>

          <div className="min-w-0 flex-1">
            {eyebrow ? (
              <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-muted-foreground">
                {eyebrow}
              </div>
            ) : null}
            <div className="mt-1 flex items-baseline gap-3">
              <h3 className="text-[17px] sm:text-[18px] font-bold tracking-tight text-foreground">
                {title}
              </h3>
              <span className="text-[12px] font-semibold text-muted-foreground">
                {ctaLabel}
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
              {subtitle}
            </p>
          </div>
        </div>

        {mediaUrl ? (
          <div className="mt-5 overflow-hidden rounded-none border border-border/50 bg-muted/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl}
              alt=""
              className="h-[140px] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : null}
      </div>
    </Link>
  )
}

