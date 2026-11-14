// The only module that talks to the exchange rate API.
// To change provider, rewrite this file (and src/data/currencies.ts);
// components only use the functions and types below.
//
// API docs: https://frankfurter.dev/llms.txt (Frankfurter v2).

import type { CurrencyCode, IsoDate, LatestRate, RatePoint } from '../types/rates'

const API_URL = 'https://api.frankfurter.dev/v2'

/**
 * Frankfurter v2 blends many sources by default. We ask for the European
 * Central Bank only: one clear source to cite, business days only.
 */
const PROVIDER = 'ECB'

/** Shown in the footer: where the numbers come from. */
export const DATA_SOURCE = {
  name: 'European Central Bank',
  url: 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html',
  via: 'Frankfurter',
  viaUrl: 'https://frankfurter.dev',
}

/** Why a request failed; the message is ready to show to the user. */
export type RatesErrorKind = 'network' | 'unavailable' | 'server'

export class RatesError extends Error {
  readonly kind: RatesErrorKind

  constructor(kind: RatesErrorKind, message: string) {
    super(message)
    this.name = 'RatesError'
    this.kind = kind
  }
}

/** Shape of each record the API returns. */
type ApiRate = {
  date: IsoDate
  base: CurrencyCode
  quote: CurrencyCode
  rate: number
}

/** Latest published rate, e.g. 1 CAD = 0.7014 USD on 2026-11-13. */
export async function fetchLatestRate(
  base: CurrencyCode,
  quote: CurrencyCode,
  signal?: AbortSignal,
): Promise<LatestRate> {
  const record = await request<ApiRate>(`/rate/${base}/${quote}`, {}, signal)
  if (!isApiRate(record)) throw unexpectedResponse()
  return { base: record.base, quote: record.quote, date: record.date, rate: record.rate }
}

/**
 * One rate per business day between two dates (both included), oldest first.
 * Weekends and holidays are simply missing. An empty array means no data.
 */
export async function fetchRateHistory(
  base: CurrencyCode,
  quote: CurrencyCode,
  from: IsoDate,
  to: IsoDate,
  signal?: AbortSignal,
): Promise<RatePoint[]> {
  const records = await request<ApiRate[]>('/rates', { base, quotes: quote, from, to }, signal)
  if (!Array.isArray(records) || !records.every(isApiRate)) throw unexpectedResponse()
  return records
    .filter((record) => record.quote === quote)
    .map(({ date, rate }) => ({ date, rate }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

/** Builds the URL, calls the API and turns every failure into a RatesError. */
async function request<T>(
  path: string,
  params: Record<string, string>,
  signal?: AbortSignal,
): Promise<T> {
  const url = new URL(API_URL + path)
  for (const [key, value] of Object.entries({ ...params, providers: PROVIDER })) {
    url.searchParams.set(key, value)
  }

  let response: Response
  try {
    response = await fetch(url, { signal })
  } catch (error) {
    // A cancelled request is not an error to show: let the caller ignore it.
    if (signal?.aborted) throw error
    throw new RatesError(
      'network',
      "Can't reach the exchange rate service. Check your internet connection and try again.",
    )
  }

  if (response.status === 404 || response.status === 422) {
    throw new RatesError('unavailable', 'This currency pair is not available from the data source.')
  }
  if (!response.ok) {
    throw new RatesError(
      'server',
      `The exchange rate service is not responding (error ${response.status}). Try again later.`,
    )
  }

  try {
    return (await response.json()) as T
  } catch {
    throw unexpectedResponse()
  }
}

function isApiRate(value: unknown): value is ApiRate {
  const record = value as ApiRate
  return (
    typeof record === 'object' &&
    record !== null &&
    typeof record.date === 'string' &&
    typeof record.quote === 'string' &&
    typeof record.rate === 'number' &&
    Number.isFinite(record.rate)
  )
}

function unexpectedResponse(): RatesError {
  return new RatesError('server', 'The exchange rate service sent an unexpected answer. Try again later.')
}
