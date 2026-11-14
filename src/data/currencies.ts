// Flags from the flag-icons package (MIT License, https://flagicons.lipis.dev).
// Importing each file gives its URL, and only these 30 flags end up in the
// published app (the package has about 270).
import auFlag from 'flag-icons/flags/4x3/au.svg'
import brFlag from 'flag-icons/flags/4x3/br.svg'
import caFlag from 'flag-icons/flags/4x3/ca.svg'
import chFlag from 'flag-icons/flags/4x3/ch.svg'
import cnFlag from 'flag-icons/flags/4x3/cn.svg'
import czFlag from 'flag-icons/flags/4x3/cz.svg'
import dkFlag from 'flag-icons/flags/4x3/dk.svg'
import euFlag from 'flag-icons/flags/4x3/eu.svg'
import gbFlag from 'flag-icons/flags/4x3/gb.svg'
import hkFlag from 'flag-icons/flags/4x3/hk.svg'
import huFlag from 'flag-icons/flags/4x3/hu.svg'
import idFlag from 'flag-icons/flags/4x3/id.svg'
import ilFlag from 'flag-icons/flags/4x3/il.svg'
import inFlag from 'flag-icons/flags/4x3/in.svg'
import isFlag from 'flag-icons/flags/4x3/is.svg'
import jpFlag from 'flag-icons/flags/4x3/jp.svg'
import krFlag from 'flag-icons/flags/4x3/kr.svg'
import mxFlag from 'flag-icons/flags/4x3/mx.svg'
import myFlag from 'flag-icons/flags/4x3/my.svg'
import noFlag from 'flag-icons/flags/4x3/no.svg'
import nzFlag from 'flag-icons/flags/4x3/nz.svg'
import phFlag from 'flag-icons/flags/4x3/ph.svg'
import plFlag from 'flag-icons/flags/4x3/pl.svg'
import roFlag from 'flag-icons/flags/4x3/ro.svg'
import seFlag from 'flag-icons/flags/4x3/se.svg'
import sgFlag from 'flag-icons/flags/4x3/sg.svg'
import thFlag from 'flag-icons/flags/4x3/th.svg'
import trFlag from 'flag-icons/flags/4x3/tr.svg'
import usFlag from 'flag-icons/flags/4x3/us.svg'
import zaFlag from 'flag-icons/flags/4x3/za.svg'
import type { Currency, CurrencyCode } from '../types/rates'

/**
 * Currencies published by the European Central Bank (via Frankfurter).
 * Each appears once; the euro is "Euro Area" with the EU flag.
 * If the data source changes, update this list too (see src/services/rates.ts).
 */
const CURRENCY_LIST: Currency[] = [
  { code: 'AUD', name: 'Australian Dollar', region: 'Australia', flag: auFlag },
  { code: 'BRL', name: 'Brazilian Real', region: 'Brazil', flag: brFlag },
  { code: 'CAD', name: 'Canadian Dollar', region: 'Canada', flag: caFlag },
  { code: 'CHF', name: 'Swiss Franc', region: 'Switzerland', flag: chFlag },
  { code: 'CNY', name: 'Chinese Yuan', region: 'China', flag: cnFlag },
  { code: 'CZK', name: 'Czech Koruna', region: 'Czechia', flag: czFlag },
  { code: 'DKK', name: 'Danish Krone', region: 'Denmark', flag: dkFlag },
  { code: 'EUR', name: 'Euro', region: 'Euro Area', flag: euFlag },
  { code: 'GBP', name: 'British Pound', region: 'United Kingdom', flag: gbFlag },
  { code: 'HKD', name: 'Hong Kong Dollar', region: 'Hong Kong', flag: hkFlag },
  { code: 'HUF', name: 'Hungarian Forint', region: 'Hungary', flag: huFlag },
  { code: 'IDR', name: 'Indonesian Rupiah', region: 'Indonesia', flag: idFlag },
  { code: 'ILS', name: 'Israeli New Shekel', region: 'Israel', flag: ilFlag },
  { code: 'INR', name: 'Indian Rupee', region: 'India', flag: inFlag },
  { code: 'ISK', name: 'Icelandic Króna', region: 'Iceland', flag: isFlag },
  { code: 'JPY', name: 'Japanese Yen', region: 'Japan', flag: jpFlag },
  { code: 'KRW', name: 'South Korean Won', region: 'South Korea', flag: krFlag },
  { code: 'MXN', name: 'Mexican Peso', region: 'Mexico', flag: mxFlag },
  { code: 'MYR', name: 'Malaysian Ringgit', region: 'Malaysia', flag: myFlag },
  { code: 'NOK', name: 'Norwegian Krone', region: 'Norway', flag: noFlag },
  { code: 'NZD', name: 'New Zealand Dollar', region: 'New Zealand', flag: nzFlag },
  { code: 'PHP', name: 'Philippine Peso', region: 'Philippines', flag: phFlag },
  { code: 'PLN', name: 'Polish Złoty', region: 'Poland', flag: plFlag },
  { code: 'RON', name: 'Romanian Leu', region: 'Romania', flag: roFlag },
  { code: 'SEK', name: 'Swedish Krona', region: 'Sweden', flag: seFlag },
  { code: 'SGD', name: 'Singapore Dollar', region: 'Singapore', flag: sgFlag },
  { code: 'THB', name: 'Thai Baht', region: 'Thailand', flag: thFlag },
  { code: 'TRY', name: 'Turkish Lira', region: 'Türkiye', flag: trFlag },
  // "American Dollar", as in the wireframe.
  { code: 'USD', name: 'American Dollar', region: 'United States', flag: usFlag },
  { code: 'ZAR', name: 'South African Rand', region: 'South Africa', flag: zaFlag },
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
