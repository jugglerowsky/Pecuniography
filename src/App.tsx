// Temporary placeholder (step 0). The real layout is built step by step.
function App() {
  return (
    <div className="flex min-h-svh flex-col bg-white text-neutral-900">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-5xl font-bold tracking-tight">Pecuniography</h1>
        <p className="text-neutral-600">Exchange rates and their history. Coming soon.</p>
      </main>
      <footer className="border-t border-neutral-200 px-4 py-3 text-center text-xs text-neutral-500">
        Pecuniography is not a financial advisory tool.
      </footer>
    </div>
  )
}

export default App
