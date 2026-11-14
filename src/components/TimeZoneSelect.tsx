import Dropdown, { type DropdownOption } from './Dropdown'
import { getTimeZoneOptions } from '../utils/timeZones'

type TimeZoneSelectProps = {
  /** Moment of the query: offsets are computed for it (daylight saving time). */
  queriedAt: Date
  timeZone: string
  browserTimeZone: string
  onChange: (timeZone: string) => void
  className?: string
  popupClassName?: string
}

/** Round "v" button next to the time that lets the user pick another zone. */
function TimeZoneSelect({
  queriedAt,
  timeZone,
  browserTimeZone,
  onChange,
  className,
  popupClassName,
}: TimeZoneSelectProps) {
  const zones = getTimeZoneOptions(queriedAt, [browserTimeZone, timeZone])

  const options: DropdownOption<string>[] = zones.map((zone) => {
    const isBrowserZone = zone.timeZone === browserTimeZone
    return {
      value: zone.timeZone,
      label: `${zone.offset} (${zone.city})${isBrowserZone ? ', your time zone' : ''}`,
      content: (
        <>
          <span className="w-20 shrink-0 tabular-nums">{zone.offset}</span>
          <span className="flex-1">{zone.city}</span>
          {isBrowserZone && (
            <span className="rounded-full bg-neutral-200 px-2 text-xs font-normal text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
              Your zone
            </span>
          )}
        </>
      ),
    }
  })

  return (
    <Dropdown
      options={options}
      value={timeZone}
      onChange={onChange}
      buttonLabel="Change time zone"
      listLabel="Time zones"
      className={className}
      popupClassName={popupClassName}
    />
  )
}

export default TimeZoneSelect
