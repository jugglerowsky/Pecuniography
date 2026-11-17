import { useState } from 'react'
import { SwapIcon } from './icons'

type SwapButtonProps = {
  onSwap: () => void
  /** Extra classes, used by the parent panel to position the button. */
  className?: string
}

/**
 * Round button that exchanges the base and target currencies.
 * On each click the arrows turn half a circle (always the same way, so the
 * count of turns only grows). People who ask their system for less motion
 * get the swap without the spin.
 */
function SwapButton({ onSwap, className = '' }: SwapButtonProps) {
  const [halfTurns, setHalfTurns] = useState(0)

  const handleClick = () => {
    setHalfTurns((turns) => turns + 1)
    onSwap()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Swap base and target currencies"
      title="Swap currencies"
      className={`flex cursor-pointer items-center justify-center rounded-full bg-fuchsia-600 text-white shadow ring-2 ring-white hover:bg-fuchsia-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-600 dark:bg-fuchsia-500 dark:ring-neutral-900 dark:hover:bg-fuchsia-400 dark:focus-visible:outline-fuchsia-400 ${className}`}
    >
      <SwapIcon
        className="size-1/2 transition-transform duration-300 ease-in-out motion-reduce:transition-none"
        // Inline style: the angle depends on a number Tailwind can't know in advance.
        style={{ transform: `rotate(${halfTurns * 180}deg)` }}
      />
    </button>
  )
}

export default SwapButton
