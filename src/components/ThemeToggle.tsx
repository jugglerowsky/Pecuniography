type ThemeToggleProps = {
  isDark: boolean
  onToggle: () => void
}

/** Sliding switch: the knob shows a sun in light mode and a moon in dark mode. */
function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      // role="switch" + aria-checked: screen readers announce "Dark mode, switch, on/off".
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={onToggle}
      className="relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full bg-neutral-300 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-600 motion-reduce:transition-none dark:bg-neutral-700 dark:focus-visible:outline-fuchsia-400"
    >
      <span
        aria-hidden="true"
        className={`absolute left-0.5 flex size-6 items-center justify-center rounded-full bg-white shadow transition-transform motion-reduce:transition-none dark:bg-neutral-900 ${
          isDark ? 'translate-x-5' : 'translate-x-0'
        }`}
      >
        {isDark ? <MoonIcon /> : <SunIcon />}
      </span>
    </button>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 text-indigo-300" fill="currentColor">
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
    </svg>
  )
}

export default ThemeToggle
