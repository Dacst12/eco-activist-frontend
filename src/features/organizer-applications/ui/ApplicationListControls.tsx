import type { ApplicationList, ApplicationStatus } from '@/entities/application'
import { ApplicationStatusFilters } from './ApplicationStatusFilters'
import { ParticipantSearch } from './ParticipantSearch'

type Props = {
  search: string
  status?: ApplicationStatus
  statusCounts?: ApplicationList['statusCounts']
  onSearchChange: (value: string) => void
  onStatusChange: (value: ApplicationStatus | undefined) => void
}

export function ApplicationListControls({
  search,
  status,
  statusCounts,
  onSearchChange,
  onStatusChange,
}: Props) {
  return (
    <section
      aria-label="Поиск и фильтры участников"
      className="grid items-center gap-2 md:grid-cols-[minmax(0,1fr)_18rem]"
    >
      <ParticipantSearch value={search} onChange={onSearchChange} />

      {statusCounts && (
        <ApplicationStatusFilters
          status={status}
          statusCounts={statusCounts}
          onChange={onStatusChange}
        />
      )}
    </section>
  )
}
