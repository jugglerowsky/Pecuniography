import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
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
 * - Changes fade smoothly with the View Transitions API (see src/index.css).
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getAppliedTheme)
  // Theme we are heading to. Unlike `theme`, it updates at once, so a second
  // click during a fade still knows the latest choice.
  const targetTheme = useRef<Theme>(theme)

  // If the OS theme changes while the app is open, follow it,
  // but only if the user has not chosen a theme themselves.
  useEffect(() => {
    const media = window.matchMedia(DARK_SCHEME_QUERY)
    const handleChange = (event: MediaQueryListEvent) => {
      if (getStoredTheme() === null) {
        targetTheme.current = event.matches ? 'dark' : 'light'
        changeTheme(targetTheme.current, setTheme)
      }
    }
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    const next: Theme = targetTheme.current === 'dark' ? 'light' : 'dark'
    targetTheme.current = next
    storeTheme(next)
    changeTheme(next, setTheme)
  }

  return { theme, toggleTheme }
}

/**
 * Switches the theme with a cross-fade.
 * startViewTransition takes a "picture" of the page, runs the update, takes
 * another one and fades between the two. The whole update (React state + the
 * class on <html>) must happen inside the callback, so flushSync makes React
 * update the DOM right away instead of later.
 */
function changeTheme(next: Theme, setTheme: (theme: Theme) => void) {
  const update = () => {
    flushSync(() => setTheme(next))
    applyTheme(next)
  }

  // Older browsers without the API simply change instantly.
  if (!document.startViewTransition) {
    update()
    return
  }
  const transition = document.startViewTransition(update)
  // If a new change starts before this fade ends, the browser skips this one
  // (the update still runs). That is expected, so ignore the rejection.
  transition.ready.catch(() => {})
}
