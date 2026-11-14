export type Theme = 'light' | 'dark'

/**
 * Key used to save the user's choice in localStorage.
 * The inline script in index.html reads the same key: keep them in sync.
 */
export const THEME_STORAGE_KEY = 'pecuniography-theme'

/** Media query that matches when the operating system is in dark mode. */
export const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)'

/** Theme the user chose with the switch, or null if they never used it. */
export function getStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    // localStorage can throw (private mode, blocked storage): act as if empty.
    return null
  }
}

export function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Not critical: the theme still works for this visit.
  }
}

/** Theme already applied to <html> by the inline script in index.html. */
export function getAppliedTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/** How long the fade between themes lasts. Keep in sync with src/index.css. */
export const THEME_TRANSITION_MS = 1000

let transitionTimer: number | undefined

/**
 * Adds or removes the `dark` class on <html>; Tailwind's `dark:` styles depend on it.
 * When the theme really changes, it also turns on the `theme-transition` class
 * for a moment so the colors fade. On page load the class already matches
 * (index.html set it), so nothing fades.
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  const isDark = theme === 'dark'
  if (root.classList.contains('dark') === isDark) return

  root.classList.add('theme-transition')
  // If the user toggles again mid-fade, restart the timer.
  window.clearTimeout(transitionTimer)
  transitionTimer = window.setTimeout(
    () => root.classList.remove('theme-transition'),
    THEME_TRANSITION_MS,
  )

  root.classList.toggle('dark', isDark)
}
