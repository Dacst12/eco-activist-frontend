import {
  applicationStatuses,
  applicationStatusConfig,
  type ApplicationList,
  type ApplicationStatus,
} from '@/entities/application'
import { Select } from '@/shared/ui'

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

  return (
    <Select
      aria-label="Статус заявки"
      className="h-11 w-full min-w-0 py-0"
      value={status ?? ''}
      onChange={(e) => {
        const selected = applicationStatuses.find(
          (value) => value === e.target.value
        )
        onChange(selected)
      }}
    >
      <option value="">Все статусы ({all})</option>

      {applicationStatuses.map((value) => (
        <option key={value} value={value}>
          {applicationStatusConfig[value].label} ({statusCounts[value]})
        </option>
      ))}
    </Select>
  )
}
