import { readStorage, writeStorage } from './storage'

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
  const value = readStorage(THEME_STORAGE_KEY)
  return value === 'light' || value === 'dark' ? value : null
}

export function storeTheme(theme: Theme): void {
  writeStorage(THEME_STORAGE_KEY, theme)
}

/** Theme already applied to <html> by the inline script in index.html. */
export function getAppliedTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/** Adds or removes the `dark` class on <html>; Tailwind's `dark:` styles depend on it. */
export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}
