import { Component, lazy, Suspense, type ComponentProps, type ReactNode } from 'react'

/**
 * The chart, loaded on demand. Recharts is most of the app's JavaScript, so
 * it lives in its own file: the rest of the page shows up first and the
 * chart arrives a moment later, in a placeholder of the same size.
 */
const RateChart = lazy(() => import('./RateChart'))

function LazyRateChart(props: ComponentProps<typeof RateChart>) {
  return (
    <ChartErrorBoundary>
      <Suspense fallback={<ChartBox>Loading chart…</ChartBox>}>
        <RateChart {...props} />
      </Suspense>
    </ChartErrorBoundary>
  )
}

/** Same box as the chart (same height, same background), so nothing jumps. */
function ChartBox({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-56 items-center justify-center rounded-md bg-white px-4 text-center text-sm text-neutral-600 sm:h-64 dark:bg-neutral-900 dark:text-neutral-400">
      {children}
    </div>
  )
}

/**
 * If the chart's file can't be downloaded (connection lost, or a new version
 * was published while the page was open), show a message instead of a blank
 * app. Error boundaries must still be class components in React.
 */
class ChartErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return <ChartBox>The chart couldn't be loaded. Reload the page to try again.</ChartBox>
    }
    return this.props.children
  }
}

export default LazyRateChart
