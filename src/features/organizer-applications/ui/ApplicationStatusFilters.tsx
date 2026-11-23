import {
  applicationStatuses,
  applicationStatusConfig,
  type ApplicationList,
  type ApplicationStatus,
} from '@/entities/application'

type Props = {
  status?: ApplicationStatus
  statusCounts: ApplicationList['statusCounts']
  onChange: (value: ApplicationStatus | undefined) => void
}

export function ApplicationStatusFilters({
  status,
  statusCounts,
  onChange,
}: Props) {
  const all = Object.values(statusCounts).reduce((sum, count) => sum + count, 0)
  const filters = [undefined, ...applicationStatuses]

  return (
    <div
      role="group"
      aria-label="Статус заявки"
      className="flex flex-wrap gap-2"
    >
      {filters.map((value) => (
        <button
          type="button"
          key={value ?? 'all'}
          aria-pressed={value === status}
          className="rounded-control bg-surface aria-pressed:bg-primary aria-pressed:text-primary-foreground px-3 py-2"
          onClick={() => onChange(value)}
        >
          {value ? applicationStatusConfig[value].label : 'Все'} (
          {value ? statusCounts[value] : all})
        </button>
      ))}
    </div>
  )
}
