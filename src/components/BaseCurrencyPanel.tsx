import AmountInput from './AmountInput'
import CurrencySelector from './CurrencySelector'
import { getCurrency } from '../data/currencies'
import type { CurrencyCode } from '../types/rates'

type BaseCurrencyPanelProps = {
  base: CurrencyCode
  onBaseChange: (code: CurrencyCode) => void
  amount: number
  onAmountChange: (amount: number) => void
}

/**
 * "Base Currency" panel of the wireframe: the currency we convert from and
 * the amount. A <fieldset> groups the controls and its <legend> names the
 * group for screen readers; it also draws the "tab" on the border.
 */
function BaseCurrencyPanel({ base, onBaseChange, amount, onAmountChange }: BaseCurrencyPanelProps) {
  const currency = getCurrency(base)
  if (!currency) return null

  return (
    // `relative`: the < > arrows are positioned against this panel's edges.
    <fieldset className="relative min-w-0 rounded-lg border-2 border-neutral-900 bg-white pt-1 pb-3 dark:border-neutral-500 dark:bg-neutral-900">
      <legend className="ml-4 rounded-md border-2 border-neutral-900 bg-white px-2 text-sm font-semibold dark:border-neutral-500 dark:bg-neutral-900">
        Base Currency
      </legend>

      {/* One column for the currency box and the amount, so both end at the
          same place. On wider screens, the right padding leaves room for the
          Swap button (step 7), as in the wireframe. */}
      <div className="mt-2 flex flex-col gap-4 px-6 sm:pr-24 sm:pl-8">
        <CurrencySelector value={base} onChange={onBaseChange} role="base" />
        <AmountInput amount={amount} currency={currency} onChange={onAmountChange} />
      </div>
    </fieldset>
  )
}

export default BaseCurrencyPanel
