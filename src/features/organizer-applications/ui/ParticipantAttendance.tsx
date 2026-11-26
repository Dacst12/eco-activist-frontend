import {
  attendanceStatus,
  attendanceWindow,
  type Application,
} from '@/entities/application'
import type { EventDetails } from '@/entities/event'
import { Button } from '@/shared/ui'

type Props = {
  application: Application
  event: EventDetails
  now: number
}

export function ParticipantAttendance({ application, event, now }: Props) {
  const status = attendanceStatus(event, application, now)

  if (!status) {
    return <span className="text-muted">Не применимо</span>
  }

  const labels = {
    unmarked: 'Не отмечено',
    present: 'Присутствовал',
    absent: 'Отсутствовал',
  }

  return (
    <div className="space-y-2">
      <p>{labels[status]}</p>

      {status === 'unmarked' && attendanceWindow(event, now) === 'open' && (
        <Button variant="secondary" disabled>
          Отметить вручную
        </Button>
      )}
    </div>
  )
}
