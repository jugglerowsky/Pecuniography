import AmountInput from './AmountInput'
import CurrencySelector from './CurrencySelector'
import SwapButton from './SwapButton'
import { getCurrency } from '../data/currencies'
import type { CurrencyCode } from '../types/rates'

type BaseCurrencyPanelProps = {
  base: CurrencyCode
  onBaseChange: (code: CurrencyCode) => void
  amount: number
  onAmountChange: (amount: number) => void
  /** Exchanges the base and target currencies. */
  onSwap: () => void
}

/**
 * "Base Currency" panel of the wireframe: the currency we convert from and
 * the amount. A <fieldset> groups the controls and its <legend> names the
 * group for screen readers; it also draws the "tab" on the border.
 *
 * The Swap button lives here too, centered on the bottom border: half of it
 * hangs in the space between this panel and the "To" panel.
 */
function BaseCurrencyPanel({
  base,
  onBaseChange,
  amount,
  onAmountChange,
  onSwap,
}: BaseCurrencyPanelProps) {
  const currency = getCurrency(base)
  if (!currency) return null

  return (
    // `relative`: the < > arrows and the Swap button are positioned against this panel's edges.
    // pb-7 keeps the amount's error message clear of the Swap button's upper half.
    <fieldset className="relative min-w-0 rounded-lg border-2 border-neutral-900 bg-white pt-1 pb-7 text-neutral-900 dark:border-neutral-500 dark:bg-neutral-900 dark:text-neutral-100">
      <legend className="ml-4 rounded-md border-2 border-neutral-900 bg-white px-2 text-sm font-semibold dark:border-neutral-500 dark:bg-neutral-900">
        Base Currency
      </legend>

      {/* One column for the currency box and the amount, so both end at the
          same place. The padding leaves room for the < > arrows on the edges. */}
      <div className="mt-2 flex flex-col gap-4 px-6 sm:px-8">
        <CurrencySelector value={base} onChange={onBaseChange} role="base" />
        <AmountInput amount={amount} currency={currency} onChange={onAmountChange} />
      </div>

      {/* Centered on the bottom border: the translate moves it half its own
          width left and half its height down, so its center sits on the border. */}
      <SwapButton
        onSwap={onSwap}
        className="absolute bottom-0 left-1/2 z-10 size-12 -translate-x-1/2 translate-y-1/2"
      />
    </fieldset>
  )
}

export default BaseCurrencyPanel
