import { useState } from 'react'
import { getCurrency } from '../data/currencies'
import type { CurrencyCode } from '../types/rates'
import { readStorage, writeStorage } from '../utils/storage'

/**
 * A currency choice remembered in localStorage between visits.
 * The first visit (or an unknown saved code) uses `fallback`.
 */
export function useStoredCurrency(storageKey: string, fallback: CurrencyCode) {
  const [code, setCode] = useState<CurrencyCode>(() => {
    const saved = readStorage(storageKey)
    return saved !== null && getCurrency(saved) ? saved : fallback
  })

  const changeCode = (next: CurrencyCode) => {
    writeStorage(storageKey, next)
    setCode(next)
  }

  // "as const" makes TypeScript treat this as a [value, setter] pair, like useState.
  return [code, changeCode] as const
}
