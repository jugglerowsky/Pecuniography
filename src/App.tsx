import { useState } from 'react'
import Header from './components/Header'
import { useTheme } from './hooks/useTheme'
import { getBrowserTimeZone } from './utils/datetime'

function App() {
  // Captured once, when the app loads: this is the moment of the query.
  const [queriedAt] = useState(() => new Date())
  // Default zone is the browser's; step 3 will let the user pick another one.
  const [timeZone] = useState(getBrowserTimeZone)
  // Lives here (not in Header) because the chart will also need it later.
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex min-h-svh flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <Header
        queriedAt={queriedAt}
        timeZone={timeZone}
        isDark={theme === 'dark'}
        onToggleTheme={toggleTheme}
      />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4">
        <p className="text-neutral-600 dark:text-neutral-400">
          Exchange rates and their history. Coming soon.
        </p>
      </main>

      <footer className="border-t border-neutral-200 px-4 py-3 text-center text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        Pecuniography is not a financial advisory tool.
      </footer>
    </div>
  )
}

export default App
