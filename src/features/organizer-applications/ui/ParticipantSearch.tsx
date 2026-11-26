type Props = {
  value: string
  onChange: (value: string) => void
}

export function ParticipantSearch({ value, onChange }: Props) {
  return (
    <label className="bg-surface border-line rounded-control focus-within:border-primary focus-within:ring-primary/25 flex h-11 w-full items-center gap-2 border px-3 focus-within:ring-2">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        className="text-muted size-5 shrink-0"
      >
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </svg>

      <span className="sr-only">Поиск участника по имени</span>

      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Поиск по имени участника"
        className="placeholder:text-muted h-full min-w-0 flex-1 bg-transparent outline-none"
      />
    </label>
  )
}
