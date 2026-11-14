import { useState } from 'react'
import BaseCurrencyPanel from './components/BaseCurrencyPanel'
import Header from './components/Header'
import RatePreview from './components/RatePreview'
import { DEFAULT_BASE, DEFAULT_QUOTE } from './data/currencies'
import { useStoredCurrency } from './hooks/useStoredCurrency'
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
  // Currency we convert from: CAD on the first visit, then the last one chosen.
  const [base, setBase] = useStoredCurrency('pecuniography-base-currency', DEFAULT_BASE)
  // Amount to convert. Not remembered: every visit starts at 1.
  const [amount, setAmount] = useState(1)
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

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-8">
        {/* Light purple background that holds the panels, as in the wireframe. */}
        <div className="flex flex-col gap-8 rounded-xl bg-fuchsia-100/70 px-6 py-6 dark:bg-fuchsia-950/40">
          <BaseCurrencyPanel
            base={base}
            onBaseChange={setBase}
            amount={amount}
            onAmountChange={setAmount}
          />
          <RatePreview
            base={base}
            quote={DEFAULT_QUOTE}
            amount={amount}
            from={period.from}
            to={period.to}
          />
        </div>
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
