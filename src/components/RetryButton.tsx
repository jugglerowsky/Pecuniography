/**
 * Small "Try again" button shown next to a loading error.
 * fuchsia-700 (not 600): white text needs 4.5:1 contrast, and 600 gave 3.5:1.
 * The invisible ::before stretches the touch area to 44px tall.
 */
function RetryButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative cursor-pointer rounded-full bg-fuchsia-700 px-3 py-0.5 text-white before:absolute before:inset-x-0 before:-inset-y-2.5 hover:bg-fuchsia-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-600 dark:focus-visible:outline-fuchsia-400"
    >
      Try again
    </button>
  )
}

export default RetryButton
