import { useState } from 'react'
import Header from './components/Header'
import RatePreview from './components/RatePreview'
import { DEFAULT_BASE, DEFAULT_QUOTE } from './data/currencies'
import { useTheme } from './hooks/useTheme'
import { useTimeZone } from './hooks/useTimeZone'
import { DATA_SOURCE } from './services/rates'
import { getDefaultPeriod } from './utils/datetime'

function App() {
  // Captured once, when the app loads: this is the moment of the query.
  const [queriedAt] = useState(() => new Date())
  // Zone used only to *display* that moment (browser's by default, or the user's pick).
  const { timeZone, browserTimeZone, changeTimeZone } = useTimeZone()
  // Lives here (not in Header) because the chart will also need it later.
  const { theme, toggleTheme } = useTheme()
  // Last 30 days up to today (step 10 will let the user change them).
  const period = getDefaultPeriod(queriedAt, timeZone)

  return (
    <div className="flex min-h-svh flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <Header
        queriedAt={queriedAt}
        timeZone={timeZone}
        browserTimeZone={browserTimeZone}
        onTimeZoneChange={changeTimeZone}
        isDark={theme === 'dark'}
        onToggleTheme={toggleTheme}
      />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4">
        <RatePreview base={DEFAULT_BASE} quote={DEFAULT_QUOTE} from={period.from} to={period.to} />
      </main>

      <footer className="flex flex-col gap-1 border-t border-neutral-200 px-4 py-3 text-center text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        <p>
          Source:{' '}
          <a href={DATA_SOURCE.url} className="underline hover:text-fuchsia-700 dark:hover:text-fuchsia-300">
            {DATA_SOURCE.name}
          </a>{' '}
          via{' '}
          <a href={DATA_SOURCE.viaUrl} className="underline hover:text-fuchsia-700 dark:hover:text-fuchsia-300">
            {DATA_SOURCE.via}
          </a>
          . Rates are published on business days only.
        </p>
        <p>Pecuniography is not a financial advisory tool.</p>
      </footer>
    </div>
  )
}

export default App
