import Dropdown, { type DropdownOption } from './Dropdown'
import Flag from './Flag'
import { ChevronIcon } from './icons'
import { CURRENCIES } from '../data/currencies'
import type { CurrencyCode } from '../types/rates'

type CurrencySelectorProps = {
  value: CurrencyCode
  onChange: (code: CurrencyCode) => void
  /** Used in accessible names: "base" -> "Previous base currency: Brazil". */
  role: 'base' | 'target'
}

/** Dropdown entries: flag, country/region and code. */
const CURRENCY_OPTIONS: DropdownOption<CurrencyCode>[] = CURRENCIES.map((currency) => ({
  value: currency.code,
  // Plain text for screen readers and type-to-jump ("can", "dollar", "cad").
  label: `${currency.region}, ${currency.name} (${currency.code})`,
  content: (
    <>
      <Flag currency={currency} className="h-4" />
      <span className="flex-1">{currency.region}</span>
      <span className="text-xs font-normal text-neutral-500 tabular-nums dark:text-neutral-400">
        {currency.code}
      </span>
    </>
  ),
}))

/**
 * `<` [country, flag, currency name, v] `>`
 * The arrows walk the list in alphabetical order of country/region and wrap
 * around at both ends; the round "v" button opens the full list.
 * Shared by the "Base Currency" and "To" panels.
 */
function CurrencySelector({ value, onChange, role }: CurrencySelectorProps) {
  const index = Math.max(
    0,
    CURRENCIES.findIndex((currency) => currency.code === value),
  )
  const currency = CURRENCIES[index]
  // `%` makes the list circular: after the last comes the first, and vice versa.
  const previous = CURRENCIES[(index - 1 + CURRENCIES.length) % CURRENCIES.length]
  const next = CURRENCIES[(index + 1) % CURRENCIES.length]

  return (
    <div className="flex items-center gap-2">
      <ArrowButton
        direction="left"
        label={`Previous ${role} currency: ${previous.region}`}
        onClick={() => onChange(previous.code)}
      />

      <div className="flex min-w-0 flex-1 items-center gap-3 rounded-md bg-neutral-100 px-4 py-2 dark:bg-neutral-800">
        {/* aria-live: screen readers announce the new currency after each change. */}
        <div aria-live="polite" className="min-w-0 flex-1">
          <p className="flex items-center gap-3 text-2xl font-bold">
            <span className="truncate">{currency.region}</span>
            <Flag currency={currency} className="h-6" />
          </p>
          <p className="truncate text-neutral-700 dark:text-neutral-300">{currency.name}</p>
        </div>

        <Dropdown
          options={CURRENCY_OPTIONS}
          value={currency.code}
          onChange={onChange}
          buttonLabel={`Choose ${role} currency`}
          listLabel="Currencies"
          popupClassName="right-0 w-max max-w-[calc(100vw-2rem)]"
        />
      </div>

      <ArrowButton
        direction="right"
        label={`Next ${role} currency: ${next.region}`}
        onClick={() => onChange(next.code)}
      />
    </div>
  )
}

type ArrowButtonProps = {
  direction: 'left' | 'right'
  label: string
  onClick: () => void
}

/** Round `<` / `>` button, like the wireframe's. */
function ArrowButton({ direction, label, onClick }: ArrowButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-fuchsia-600 text-white shadow ring-2 ring-white hover:bg-fuchsia-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-600 dark:bg-fuchsia-500 dark:ring-neutral-900 dark:hover:bg-fuchsia-400 dark:focus-visible:outline-fuchsia-400"
    >
      <ChevronIcon direction={direction} className="size-5" />
    </button>
  )
}

export default CurrencySelector
