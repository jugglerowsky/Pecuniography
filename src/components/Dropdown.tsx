import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

export type DropdownOption<T extends string> = {
  value: T
  /** Plain text: read by screen readers and used to jump by typing. */
  label: string
  /** Optional richer content for the list (e.g. columns, a flag). Defaults to the label. */
  content?: ReactNode
}

type DropdownProps<T extends string> = {
  options: DropdownOption<T>[]
  value: T
  onChange: (value: T) => void
  /** Accessible name of the round button, e.g. "Change time zone". */
  buttonLabel: string
  /** Accessible name of the list, e.g. "Time zones". */
  listLabel: string
  /** Classes for the wrapper. Default "relative": the list opens below the button. */
  className?: string
  /** Horizontal placement of the list, e.g. "left-0" or "right-0". */
  popupClassName?: string
}

/** Letters typed within this time are searched together ("mex" -> Mexico). */
const TYPEAHEAD_RESET_MS = 600

/**
 * Round button that opens a list of options (the "v" buttons of the wireframe).
 * Follows the ARIA "listbox" pattern, so it works with keyboard and screen readers:
 * - Button: Enter, Space, ↓ or ↑ open the list.
 * - List: ↑ ↓ Home End move, Enter or Space choose, Esc closes,
 *   typing letters jumps to the first option with a word that starts with them.
 */
function Dropdown<T extends string>({
  options,
  value,
  onChange,
  buttonLabel,
  listLabel,
  className = 'relative',
  popupClassName = 'left-0',
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  // "Active" = highlighted with keyboard or mouse; "selected" = current value.
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const typeahead = useRef({ text: '', timer: 0 })

  const baseId = useId()
  const listId = `${baseId}-list`
  const optionId = (index: number) => `${baseId}-option-${index}`
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )

  const open = () => {
    setActiveIndex(selectedIndex)
    setIsOpen(true)
  }

  const close = (returnFocus: boolean) => {
    setIsOpen(false)
    if (returnFocus) buttonRef.current?.focus()
  }

  const choose = (index: number) => {
    const option = options[index]
    if (option) onChange(option.value)
    close(true)
  }

  // Move keyboard focus into the list when it opens.
  useEffect(() => {
    if (isOpen) listRef.current?.focus()
  }, [isOpen])

  // Keep the highlighted option visible inside the scrollable list.
  useEffect(() => {
    if (isOpen) listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [isOpen, activeIndex])

  // Close when the user clicks or taps anywhere outside.
  useEffect(() => {
    if (!isOpen) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isOpen])

  const handleButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      open()
    }
  }

  const jumpByTyping = (key: string) => {
    const state = typeahead.current
    window.clearTimeout(state.timer)
    state.text += key.toLowerCase()
    state.timer = window.setTimeout(() => (state.text = ''), TYPEAHEAD_RESET_MS)

    // Match the start of any word: "mex" and "city" both find "UTC-6 (Mexico City)".
    const normalize = (text: string) => ` ${text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ')}`
    const query = normalize(state.text).trimEnd()
    // A single letter starts after the current option, so pressing it again cycles.
    const start = state.text.length === 1 ? activeIndex + 1 : activeIndex
    for (let step = 0; step < options.length; step++) {
      const index = (start + step) % options.length
      if (normalize(options[index].label).includes(query)) {
        setActiveIndex(index)
        return
      }
    }
  }

  const handleListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const last = options.length - 1
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActiveIndex((index) => Math.min(index + 1, last))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex((index) => Math.max(index - 1, 0))
        break
      case 'Home':
        event.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        event.preventDefault()
        setActiveIndex(last)
        break
      case 'Enter':
        event.preventDefault()
        choose(activeIndex)
        break
      case ' ':
        event.preventDefault()
        // While typing a search ("mexico city"), a space is part of the text.
        if (typeahead.current.text) jumpByTyping(' ')
        else choose(activeIndex)
        break
      case 'Escape':
        event.preventDefault()
        close(true)
        break
      case 'Tab':
        // Let the browser move focus on; just close the list.
        close(false)
        break
      default:
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          jumpByTyping(event.key)
        }
    }
  }

  return (
    <div ref={rootRef} className={className}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={buttonLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        onClick={() => (isOpen ? close(false) : open())}
        onKeyDown={handleButtonKeyDown}
        className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-fuchsia-600 text-white shadow hover:bg-fuchsia-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-600 dark:bg-fuchsia-500 dark:hover:bg-fuchsia-400 dark:focus-visible:outline-fuchsia-400"
      >
        <ChevronDownIcon flipped={isOpen} />
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-label={listLabel}
          aria-activedescendant={optionId(activeIndex)}
          onKeyDown={handleListKeyDown}
          className={`absolute top-full z-20 mt-2 max-h-72 min-w-56 overflow-y-auto rounded-lg border border-neutral-200 bg-white py-1 text-left text-sm text-neutral-900 shadow-lg focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 ${popupClassName}`}
        >
          {options.map((option, index) => {
            const isSelected = index === selectedIndex
            const isActive = index === activeIndex
            return (
              <li
                key={option.value}
                id={optionId(index)}
                role="option"
                aria-selected={isSelected}
                aria-label={option.label}
                onPointerMove={() => setActiveIndex(index)}
                onClick={() => choose(index)}
                className={`flex cursor-pointer items-center gap-2 px-3 py-1.5 ${
                  isActive ? 'bg-fuchsia-100 dark:bg-fuchsia-950' : ''
                } ${isSelected ? 'font-semibold' : ''}`}
              >
                <CheckIcon visible={isSelected} />
                {option.content ?? option.label}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

// Icon shapes based on Lucide "chevron-down" and "check" (ISC License, https://lucide.dev).

function ChevronDownIcon({ flipped }: { flipped: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`size-5 transition-transform motion-reduce:transition-none ${flipped ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function CheckIcon({ visible }: { visible: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`size-4 shrink-0 text-fuchsia-600 dark:text-fuchsia-400 ${visible ? '' : 'invisible'}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export default Dropdown
