// Small SVG icons shared by several components.
// Shapes based on Lucide "chevron-*", "check", "refresh-cw" and "calendar" (ISC License, https://lucide.dev).

import type { CSSProperties } from 'react'

type IconProps = { className?: string; style?: CSSProperties }

const CHEVRON_PATHS = {
  up: 'm18 15-6-6-6 6',
  down: 'm6 9 6 6 6-6',
  left: 'm15 18-6-6 6-6',
  right: 'm9 18 6-6-6-6',
}

export function ChevronIcon({
  direction,
  className = '',
}: IconProps & { direction: keyof typeof CHEVRON_PATHS }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={CHEVRON_PATHS[direction]} />
    </svg>
  )
}

export function CheckIcon({ className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
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

/** Two curved arrows chasing each other, like the wireframe's Swap button. */
export function SwapIcon({ className = '', style }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  )
}

export function CalendarIcon({ className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )
}
