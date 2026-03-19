import { useEffect, useMemo, useRef } from 'react'

type Point = { x: number; y: number }

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export type SpotlightOptions = Readonly<{
  /**
   * Higher = snappier; lower = more inertial.
   * Range ~ 0.08–0.22 feels good for pointer tracking.
   */
  stiffness?: number
  /**
   * If true, stops updating when not active (hover/focus/press).
   */
  idleFreeze?: boolean
}>

export type SpotlightApi = Readonly<{
  ref: React.RefObject<HTMLElement | null>
  onPointerMove: (e: React.PointerEvent<HTMLElement>) => void
  onPointerEnter: () => void
  onPointerLeave: () => void
  onFocus: () => void
  onBlur: () => void
  /**
   * Forces a reasonable center hotspot (e.g. keyboard focus).
   */
  centerHotspot: () => void
}>

/**
 * Provides ultra-smooth spotlight coordinates as CSS variables:
 * - --spotlight-x (px)
 * - --spotlight-y (px)
 * - --spotlight-on (0|1)
 *
 * Designed for a “work-light” feel: subtle, controlled, no jitter.
 */
export function useSpotlight(options: SpotlightOptions = {}): SpotlightApi {
  const ref = useRef<HTMLElement | null>(null)
  const target = useRef<Point>({ x: 0, y: 0 })
  const current = useRef<Point>({ x: 0, y: 0 })
  const raf = useRef<number | null>(null)
  const active = useRef(false)

  const stiffness = options.stiffness ?? 0.16
  const idleFreeze = options.idleFreeze ?? true

  const setVars = (x: number, y: number, on: boolean) => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--spotlight-x', `${x.toFixed(2)}px`)
    el.style.setProperty('--spotlight-y', `${y.toFixed(2)}px`)
    el.style.setProperty('--spotlight-on', on ? '1' : '0')
  }

  const tick = () => {
    raf.current = null

    const el = ref.current
    if (!el) return

    const isActive = active.current
    if (!isActive && idleFreeze) return

    const nextX = lerp(current.current.x, target.current.x, stiffness)
    const nextY = lerp(current.current.y, target.current.y, stiffness)

    current.current = { x: nextX, y: nextY }
    setVars(nextX, nextY, isActive)

    const dx = Math.abs(target.current.x - nextX)
    const dy = Math.abs(target.current.y - nextY)
    const closeEnough = dx < 0.25 && dy < 0.25

    if (isActive || !closeEnough) {
      raf.current = window.requestAnimationFrame(tick)
    }
  }

  const schedule = () => {
    if (raf.current != null) return
    raf.current = window.requestAnimationFrame(tick)
  }

  const centerHotspot = () => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = r.width / 2
    const y = r.height * 0.35
    target.current = { x, y }
    if (!idleFreeze || active.current) schedule()
    setVars(x, y, active.current)
  }

  const api = useMemo<SpotlightApi>(
    () => ({
      ref,
      onPointerMove: (e) => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const x = clamp(e.clientX - r.left, 0, r.width)
        const y = clamp(e.clientY - r.top, 0, r.height)
        target.current = { x, y }
        schedule()
      },
      onPointerEnter: () => {
        active.current = true
        schedule()
      },
      onPointerLeave: () => {
        active.current = false
        schedule()
      },
      onFocus: () => {
        active.current = true
        centerHotspot()
        schedule()
      },
      onBlur: () => {
        active.current = false
        schedule()
      },
      centerHotspot,
    }),
    [idleFreeze, stiffness]
  )

  useEffect(() => {
    centerHotspot()
    return () => {
      if (raf.current != null) {
        window.cancelAnimationFrame(raf.current)
        raf.current = null
      }
    }
  }, [centerHotspot])

  return api
}

