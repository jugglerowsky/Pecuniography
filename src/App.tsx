import { useState } from 'react'
import Header from './components/Header'
import { getBrowserTimeZone } from './utils/datetime'

function App() {
  // Captured once, when the app loads: this is the moment of the query.
  const [queriedAt] = useState(() => new Date())
  // Default zone is the browser's; step 3 will let the user pick another one.
  const [timeZone] = useState(getBrowserTimeZone)

  return (
    <div className="flex min-h-svh flex-col bg-white text-neutral-900">
      <Header queriedAt={queriedAt} timeZone={timeZone} />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4">
        <p className="text-neutral-600">Exchange rates and their history. Coming soon.</p>
      </main>

      <footer className="border-t border-neutral-200 px-4 py-3 text-center text-xs text-neutral-500">
        Pecuniography is not a financial advisory tool.
      </footer>
    </div>
  )
}

export default App
