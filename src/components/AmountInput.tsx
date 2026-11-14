import { useId, useState } from 'react'
import type { Currency } from '../types/rates'

/** Up to 999,999,999,999.9999: enough for any real conversion. */
const MAX_INTEGER_DIGITS = 12
const DECIMALS = 4

type AmountInputProps = {
  /** Last valid amount (always > 0). */
  amount: number
  currency: Currency
  onChange: (amount: number) => void
}

/**
 * Amount to convert, e.g. "1.0000 CAD". Only positive numbers:
 * - Characters other than digits and one decimal point are ignored as you type
 *   (so "-" or letters never appear). A comma counts as a decimal point,
 *   for keyboards that show "," instead of ".".
 * - Empty or zero shows an error; the last valid amount stays in use.
 * - On leaving the field, the value is shown with 4 decimals again.
 */
function AmountInput({ amount, currency, onChange }: AmountInputProps) {
  // The text is kept apart from the number so half-typed values ("12.") work.
  const [text, setText] = useState(() => amount.toFixed(DECIMALS))
  const [hasError, setHasError] = useState(false)
  const inputId = useId()
  const errorId = useId()

  const handleChange = (raw: string) => {
    const cleaned = raw.replaceAll(',', '.').replace(/[^\d.]/g, '')
    const [integerPart, decimalPart = '', ...extra] = cleaned.split('.')
    // Ignore the keystroke if it adds a second point or too many digits.
    if (extra.length > 0) return
    if (integerPart.length > MAX_INTEGER_DIGITS || decimalPart.length > DECIMALS) return

    setText(cleaned)
    const value = Number(cleaned)
    const isValid = cleaned !== '' && cleaned !== '.' && value > 0
    setHasError(!isValid)
    if (isValid) onChange(value)
  }

  const handleBlur = () => {
    // Invalid text goes back to the last valid amount; valid text gets 4 decimals.
    setText(amount.toFixed(DECIMALS))
    setHasError(false)
  }

  return (
    <div>
      <label htmlFor={inputId} className="sr-only">
        Amount in {currency.name}
      </label>
      <div
        className={`flex items-baseline gap-4 rounded-t-md border-b-2 bg-neutral-100 px-4 py-2 focus-within:border-fuchsia-600 dark:bg-neutral-800 dark:focus-within:border-fuchsia-400 ${
          hasError
            ? 'border-red-600 dark:border-red-400'
            : 'border-neutral-900 dark:border-neutral-300'
        }`}
      >
        <input
          id={inputId}
          type="text"
          // Shows a numeric keyboard on phones, with a decimal point.
          inputMode="decimal"
          autoComplete="off"
          value={text}
          onChange={(event) => handleChange(event.target.value)}
          onBlur={handleBlur}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className="w-0 min-w-0 flex-1 bg-transparent text-2xl tabular-nums outline-none"
        />
        <span className="text-xl text-neutral-700 dark:text-neutral-300">{currency.code}</span>
      </div>
      {/* aria-live: the message is read when it appears. */}
      <p aria-live="polite" id={errorId} className="mt-1 min-h-5 text-sm text-red-700 dark:text-red-400">
        {hasError ? 'Enter an amount greater than 0.' : ''}
      </p>
    </div>
  )
}

export default AmountInput
