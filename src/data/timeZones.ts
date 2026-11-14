/**
 * Time zones offered in the selector: one representative city per UTC offset
 * (standard time). Offsets are not stored here: they are computed for the
 * moment of the query, because daylight saving time changes them.
 *
 * `city` overrides the name taken from the IANA id when it reads badly
 * (e.g. "America/St_Johns" -> "St. John's").
 */
export type TimeZoneEntry = {
  /** IANA time zone id, e.g. "America/Mexico_City". */
  timeZone: string
  city?: string
}

export const TIME_ZONES: TimeZoneEntry[] = [
  { timeZone: 'Pacific/Pago_Pago' }, // UTC-11
  { timeZone: 'Pacific/Honolulu' }, // UTC-10
  { timeZone: 'Pacific/Marquesas', city: 'Marquesas Islands' }, // UTC-9:30
  { timeZone: 'America/Anchorage' }, // UTC-9
  { timeZone: 'America/Vancouver' }, // UTC-8
  { timeZone: 'America/Denver' }, // UTC-7
  { timeZone: 'America/Mexico_City' }, // UTC-6
  { timeZone: 'America/Toronto' }, // UTC-5
  { timeZone: 'America/Halifax' }, // UTC-4
  { timeZone: 'America/St_Johns', city: "St. John's" }, // UTC-3:30
  { timeZone: 'America/Sao_Paulo', city: 'São Paulo' }, // UTC-3
  { timeZone: 'America/Noronha', city: 'Fernando de Noronha' }, // UTC-2
  { timeZone: 'Atlantic/Azores' }, // UTC-1
  { timeZone: 'Europe/London' }, // UTC+0
  { timeZone: 'Europe/Paris' }, // UTC+1
  { timeZone: 'Africa/Johannesburg' }, // UTC+2
  { timeZone: 'Europe/Moscow' }, // UTC+3
  { timeZone: 'Asia/Tehran' }, // UTC+3:30
  { timeZone: 'Asia/Dubai' }, // UTC+4
  { timeZone: 'Asia/Kabul' }, // UTC+4:30
  { timeZone: 'Asia/Karachi' }, // UTC+5
  { timeZone: 'Asia/Kolkata' }, // UTC+5:30
  { timeZone: 'Asia/Kathmandu' }, // UTC+5:45
  { timeZone: 'Asia/Dhaka' }, // UTC+6
  { timeZone: 'Asia/Yangon' }, // UTC+6:30
  { timeZone: 'Asia/Bangkok' }, // UTC+7
  { timeZone: 'Asia/Shanghai' }, // UTC+8
  { timeZone: 'Asia/Tokyo' }, // UTC+9
  { timeZone: 'Australia/Adelaide' }, // UTC+9:30
  { timeZone: 'Australia/Sydney' }, // UTC+10
  { timeZone: 'Pacific/Noumea', city: 'Nouméa' }, // UTC+11
  { timeZone: 'Pacific/Auckland' }, // UTC+12
  { timeZone: 'Pacific/Tongatapu', city: "Nuku'alofa" }, // UTC+13
  { timeZone: 'Pacific/Kiritimati', city: 'Kiritimati' }, // UTC+14
]
