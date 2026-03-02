import { useState, useEffect } from 'react'

/**
 * Hook to animate number transitions
 */
export function useCountUp(
  endValue: number,
  duration: number = 1000,
  start: number = 0
): number {
  const [count, setCount] = useState(start)

  useEffect(() => {
    if (count >= endValue) return

    const increment = (endValue - start) / (duration / 16)
    const interval = setInterval(() => {
      setCount((prev) => {
        const newVal = prev + increment
        return newVal >= endValue ? endValue : newVal
      })
    }, 16)

    return () => clearInterval(interval)
  }, [endValue, duration, start])

  return Math.floor(count)
}

/**
 * Hook for managing modal/dialog state
 */
export function useModal(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen)

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  }
}

/**
 * Hook for debounced values
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook for tracking if component is mounted
 */
export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted
}
