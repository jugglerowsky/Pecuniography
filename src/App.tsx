import { useState, type ReactNode } from 'react'
import BaseCurrencyPanel from './components/BaseCurrencyPanel'
import Header from './components/Header'
import TargetCurrencyPanel from './components/TargetCurrencyPanel'
import { DEFAULT_BASE, DEFAULT_QUOTE } from './data/currencies'
import { useStoredCurrency } from './hooks/useStoredCurrency'
import { useTheme } from './hooks/useTheme'
import { useTimeZone } from './hooks/useTimeZone'
import { DATA_SOURCE } from './services/rates'
import { clampPeriod, getDefaultPeriod, toIsoDate, type Period } from './utils/datetime'

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

  // Period of the chart. Until the user picks dates it is the last 30 days up
  // to today, in the shown time zone. Picked dates are not remembered between
  // visits; if the time zone changes, they stay, trimmed so they never pass today.
  const today = toIsoDate(queriedAt, timeZone)
  const [chosenPeriod, setChosenPeriod] = useState<Period | null>(null)
  const period = chosenPeriod ? clampPeriod(chosenPeriod, today) : getDefaultPeriod(queriedAt, timeZone)

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
            period={period}
            today={today}
            onPeriodChange={setChosenPeriod}
          />
        </div>
      </main>

      <footer className="flex flex-col gap-1 border-t border-neutral-200 px-4 py-3 text-center text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        <p>
          Source: <FooterLink href={DATA_SOURCE.url}>{DATA_SOURCE.name}</FooterLink> via{' '}
          <FooterLink href={DATA_SOURCE.viaUrl}>{DATA_SOURCE.via}</FooterLink>
          . Rates are published on business days only.
        </p>
        <p>Pecuniography is not a financial advisory tool.</p>
        {/* Credits for the open-source pieces the app uses, and a link to its code. */}
        <p>
          Flags by{' '}
          <FooterLink href="https://github.com/lipis/flag-icons">flag-icons</FooterLink> · Icons based on{' '}
          <FooterLink href="https://lucide.dev">Lucide</FooterLink> and{' '}
          <FooterLink href="https://feathericons.com">Feather</FooterLink> · Chart by{' '}
          <FooterLink href="https://recharts.org">Recharts</FooterLink> ·{' '}
          <FooterLink href="https://github.com/jugglerowsky/Pecuniography">Source code on GitHub</FooterLink>
        </p>
      </footer>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="underline hover:text-fuchsia-700 dark:hover:text-fuchsia-300">
      {children}
    </a>
  )
}

export default App
