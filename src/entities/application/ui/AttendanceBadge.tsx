import { Badge, type BadgeTone } from '@/shared/ui'
import type { AttendanceStatus } from '../model/attendance'

const labels = {
  unmarked: { label: 'Не отмечено', tone: 'neutral' },
  present: { label: 'Присутствовал', tone: 'success' },
  absent: { label: 'Отсутствовал', tone: 'warning' },
} satisfies Record<AttendanceStatus, { label: string; tone: BadgeTone }>

export function AttendanceBadge({ status }: { status: AttendanceStatus }) {
  const { label, tone } = labels[status]

  return (
    <Badge tone={tone} className="items-center gap-1.5 rounded-full">
      <span className="sr-only">Посещение: </span>
      {label}
    </Badge>
  )
}
