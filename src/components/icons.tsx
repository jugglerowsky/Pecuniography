// Small SVG icons shared by several components.
// Shapes based on Lucide "chevron-*" and "check" (ISC License, https://lucide.dev).

type IconProps = { className?: string }

const CHEVRON_PATHS = {
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
