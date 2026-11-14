import type { Currency, CurrencyCode } from '../types/rates'

/**
 * Currencies published by the European Central Bank (via Frankfurter).
 * Each appears once; the euro is "Euro Area" with the EU flag.
 * If the data source changes, update this list too (see src/services/rates.ts).
 */
const CURRENCY_LIST: Currency[] = [
  { code: 'AUD', name: 'Australian Dollar', region: 'Australia', flag: 'au' },
  { code: 'BRL', name: 'Brazilian Real', region: 'Brazil', flag: 'br' },
  { code: 'CAD', name: 'Canadian Dollar', region: 'Canada', flag: 'ca' },
  { code: 'CHF', name: 'Swiss Franc', region: 'Switzerland', flag: 'ch' },
  { code: 'CNY', name: 'Chinese Yuan', region: 'China', flag: 'cn' },
  { code: 'CZK', name: 'Czech Koruna', region: 'Czechia', flag: 'cz' },
  { code: 'DKK', name: 'Danish Krone', region: 'Denmark', flag: 'dk' },
  { code: 'EUR', name: 'Euro', region: 'Euro Area', flag: 'eu' },
  { code: 'GBP', name: 'British Pound', region: 'United Kingdom', flag: 'gb' },
  { code: 'HKD', name: 'Hong Kong Dollar', region: 'Hong Kong', flag: 'hk' },
  { code: 'HUF', name: 'Hungarian Forint', region: 'Hungary', flag: 'hu' },
  { code: 'IDR', name: 'Indonesian Rupiah', region: 'Indonesia', flag: 'id' },
  { code: 'ILS', name: 'Israeli New Shekel', region: 'Israel', flag: 'il' },
  { code: 'INR', name: 'Indian Rupee', region: 'India', flag: 'in' },
  { code: 'ISK', name: 'Icelandic Króna', region: 'Iceland', flag: 'is' },
  { code: 'JPY', name: 'Japanese Yen', region: 'Japan', flag: 'jp' },
  { code: 'KRW', name: 'South Korean Won', region: 'South Korea', flag: 'kr' },
  { code: 'MXN', name: 'Mexican Peso', region: 'Mexico', flag: 'mx' },
  { code: 'MYR', name: 'Malaysian Ringgit', region: 'Malaysia', flag: 'my' },
  { code: 'NOK', name: 'Norwegian Krone', region: 'Norway', flag: 'no' },
  { code: 'NZD', name: 'New Zealand Dollar', region: 'New Zealand', flag: 'nz' },
  { code: 'PHP', name: 'Philippine Peso', region: 'Philippines', flag: 'ph' },
  { code: 'PLN', name: 'Polish Złoty', region: 'Poland', flag: 'pl' },
  { code: 'RON', name: 'Romanian Leu', region: 'Romania', flag: 'ro' },
  { code: 'SEK', name: 'Swedish Krona', region: 'Sweden', flag: 'se' },
  { code: 'SGD', name: 'Singapore Dollar', region: 'Singapore', flag: 'sg' },
  { code: 'THB', name: 'Thai Baht', region: 'Thailand', flag: 'th' },
  { code: 'TRY', name: 'Turkish Lira', region: 'Türkiye', flag: 'tr' },
  // "American Dollar", as in the wireframe.
  { code: 'USD', name: 'American Dollar', region: 'United States', flag: 'us' },
  { code: 'ZAR', name: 'South African Rand', region: 'South Africa', flag: 'za' },
]

/**
 * All currencies sorted alphabetically by country or region: the order the
 * `<` `>` arrows and the lists follow.
 */
export const CURRENCIES: Currency[] = [...CURRENCY_LIST].sort((a, b) =>
  a.region.localeCompare(b.region, 'en'),
)

export const DEFAULT_BASE: CurrencyCode = 'CAD'
export const DEFAULT_QUOTE: CurrencyCode = 'USD'

export function getCurrency(code: CurrencyCode): Currency | undefined {
  return CURRENCIES.find((currency) => currency.code === code)
}
