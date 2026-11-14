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
    <fieldset className="min-w-0 rounded-lg border-2 border-neutral-900 bg-white pt-1 pb-3 dark:border-neutral-500 dark:bg-neutral-900">
      <legend className="ml-4 rounded-md border-2 border-neutral-900 bg-white px-2 text-sm font-semibold dark:border-neutral-500 dark:bg-neutral-900">
        Base Currency
      </legend>

      {/* Negative margins put the round arrows right on the panel's border, as in the wireframe. */}
      <div className="-mx-[19px] mt-2">
        <CurrencySelector value={base} onChange={onBaseChange} role="base" />
      </div>

      <div className="mt-4 px-8 sm:pr-24">
        <AmountInput amount={amount} currency={currency} onChange={onAmountChange} />
      </div>
    </fieldset>
  )
}

export default BaseCurrencyPanel
