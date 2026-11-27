import {
  AttendanceBadge,
  attendanceStatus,
  attendanceWindow,
  type Application,
} from '@/entities/application'
import type { EventDetails } from '@/entities/event'
import { getErrorMessage } from '@/shared/api'
import { ConfirmDialog } from '@/shared/ui'
import { useMarkPresent } from '../model/useMarkPresent'

type Props = {
  application: Application
  event: EventDetails
  now: number
}

export function ParticipantAttendance({ application, event, now }: Props) {
  const mark = useMarkPresent(application)
  const status = attendanceStatus(event, application, now)

  if (!status) return <span className="text-muted">Не применимо</span>

  if (status === 'unmarked' && attendanceWindow(event, now) === 'open') {
    return (
      <ConfirmDialog
        trigger="Отметить явку"
        triggerClassName="border-primary/40 hover:border-primary h-11 w-fit whitespace-nowrap border px-3 lg:h-9 lg:min-h-0 lg:min-w-0"
        title="Подтвердить посещение?"
        description={`${application.volunteer.name} · ${event.title}`}
        backLabel="Назад"
        confirmLabel="Подтвердить явку"
        confirmVariant="primary"
        pending={mark.isPending}
        error={mark.isError && getErrorMessage(mark.error)}
        onConfirm={() => mark.mutate()}
      />
    )
  }

  return (
    <div role="status">
      <AttendanceBadge status={status} />
    </div>
  )
}
