import { useState } from 'react'
import BaseCurrencyPanel from './components/BaseCurrencyPanel'
import Header from './components/Header'
import TargetCurrencyPanel from './components/TargetCurrencyPanel'
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
  // Currency we convert to: USD on the first visit, then the last one chosen.
  const [quote, setQuote] = useStoredCurrency('pecuniography-quote-currency', DEFAULT_QUOTE)
  // Amount to convert. Not remembered: every visit starts at 1.
  const [amount, setAmount] = useState(1)

  // Last 30 days up to today, in the shown time zone (step 10 lets the user change them).
  const period = getDefaultPeriod(queriedAt, timeZone)

  // Swap button: origin and target trade places (both stay remembered).
  // The amount stays the same: "1 CAD -> USD" becomes "1 USD -> CAD".
  const swapCurrencies = () => {
    setBase(quote)
    setQuote(base)
  }

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
        {/* Colored area that holds the panels, as in the wireframe (colors in index.css). */}
        <div className="flex flex-col gap-8 rounded-xl bg-backdrop px-4 py-6 text-on-backdrop sm:px-6">
          <BaseCurrencyPanel
            base={base}
            onBaseChange={setBase}
            amount={amount}
            onAmountChange={setAmount}
            onSwap={swapCurrencies}
          />
          <TargetCurrencyPanel
            base={base}
            quote={quote}
            onQuoteChange={setQuote}
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
