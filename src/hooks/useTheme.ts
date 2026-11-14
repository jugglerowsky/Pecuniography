import { useEffect, useState } from 'react'
import {
  DARK_SCHEME_QUERY,
  applyTheme,
  getAppliedTheme,
  getStoredTheme,
  storeTheme,
  type Theme,
} from '../utils/theme'

/**
 * Light/dark theme state.
 * - Starts with the theme index.html already applied (no flash on load).
 * - Until the user uses the switch, it follows the operating system.
 * - Once the user picks a theme, that choice is saved and wins.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getAppliedTheme)

  // Keep the class on <html> in sync with the state.
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // If the OS theme changes while the app is open, follow it,
  // but only if the user has not chosen a theme themselves.
  useEffect(() => {
    const media = window.matchMedia(DARK_SCHEME_QUERY)
    const handleChange = (event: MediaQueryListEvent) => {
      if (getStoredTheme() === null) {
        setTheme(event.matches ? 'dark' : 'light')
      }
    }
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    storeTheme(next)
    setTheme(next)
  }

  return { theme, toggleTheme }
}
