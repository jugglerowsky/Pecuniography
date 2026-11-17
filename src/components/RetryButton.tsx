/** Small "Try again" button shown next to a loading error. */
function RetryButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-full bg-fuchsia-600 px-3 py-0.5 text-white hover:bg-fuchsia-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-600 dark:bg-fuchsia-500 dark:hover:bg-fuchsia-400 dark:focus-visible:outline-fuchsia-400"
    >
      Try again
    </button>
  )
}

export default RetryButton
