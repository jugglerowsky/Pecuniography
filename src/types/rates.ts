/** ISO 4217 currency code in upper case, e.g. "CAD". */
export type CurrencyCode = string

/** A date as the API sends it: "YYYY-MM-DD" (no time, no time zone). */
export type IsoDate = string

export type Currency = {
  code: CurrencyCode
  /** English name, e.g. "Canadian Dollar". */
  name: string
  /** Country or region that uses it, e.g. "Canada", "Euro Area". */
  region: string
  /** URL of the flag image (4:3 SVG from the flag-icons package). */
  flag: string
}

/** Rate published for one business day: 1 base = `rate` quote. */
export type RatePoint = {
  date: IsoDate
  rate: number
}

/** Most recent rate. Its date can be earlier than today (weekends, holidays). */
export type LatestRate = RatePoint & {
  base: CurrencyCode
  quote: CurrencyCode
}

/**
 * State of a request, so components can show a spinner, an error or the data.
 * Each variant has a different `status`; TypeScript knows which fields exist
 * after checking it (e.g. `data` only when status is "success").
 */
export type AsyncState<T> =
  /**
   * `previous`: the last data that arrived (e.g. for the currency chosen
   * before). Showing it dimmed while the new data loads keeps the page from
   * changing size.
   */
  | { status: 'loading'; previous?: T }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T }
