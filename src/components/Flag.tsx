import type { Currency } from '../types/rates'

type FlagProps = {
  currency: Currency
  className?: string
}

/**
 * Flag image (SVG). alt="" because the country name is always written next
 * to it: a screen reader would otherwise read "Canada" twice.
 */
function Flag({ currency, className = 'h-5' }: FlagProps) {
  return (
    <img
      src={currency.flag}
      alt=""
      // 4:3 is the flags' shape; width and height avoid layout jumps while loading.
      width={40}
      height={30}
      className={`aspect-[4/3] w-auto shrink-0 rounded-sm object-cover shadow-sm ring-1 ring-black/10 dark:ring-white/20 ${className}`}
    />
  )
}

export default Flag
