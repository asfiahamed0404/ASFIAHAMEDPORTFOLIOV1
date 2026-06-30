import { useEffect, useRef, useState } from 'react'

/**
 * useIsTouchDevice — true when the primary input is coarse (touch).
 * Used to disable the spotlight dimming pattern on mobile, where there's
 * no real cursor to "leave" the grid.
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(hover: none), (pointer: coarse)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(hover: none), (pointer: coarse)')
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches)
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [])

  return isTouch
}

/**
 * useHover — tiny helper that returns a ref + a boolean.
 * On touch devices, this is a no-op (returns false) so the spotlight
 * patterns can opt out cleanly.
 */
export function useHover<T extends HTMLElement = HTMLElement>(): [
  React.RefObject<T | null>,
  boolean,
  (next: boolean) => void,
] {
  const ref = useRef<T | null>(null)
  const [hovered, setHovered] = useState(false)
  const isTouch = useIsTouchDevice()

  // The "set" function silently no-ops on touch.
  const set = (next: boolean) => {
    if (isTouch) return
    setHovered(next)
  }

  return [ref, hovered, set]
}
