import {
  applicationStatusConfig,
  attendanceWindow,
  type Application,
} from '@/entities/application'
import { formatDateTime } from '@/shared/lib/date'
import { Badge } from '@/shared/ui'
import { ReviewApplicationActions } from './ReviewApplicationActions'
import { RemoveParticipantAction } from './RemoveParticipantAction'
import { EventDetails } from '@/entities/event'
import { ParticipantAttendance } from './ParticipantAttendance'

type Props = {
  items: Application[]
  event: EventDetails
  now: number
  reviewOpen: boolean
  removalOpen: boolean
}

export function ApplicationsTable({
  items,
  event,
  now,
  reviewOpen,
  removalOpen,
}: Props) {
  const phase = attendanceWindow(event, now)
  const showAttendance = phase === 'open' || phase === 'closed'
  return (
    <div className="lg:border-line lg:rounded-control lg:overflow-hidden lg:border">
      <table className="block w-full text-left lg:table lg:border-collapse">
        <caption className="sr-only">Заявки волонтёров</caption>

        <thead className="bg-success-soft hidden lg:table-header-group">
          <tr className="divide-line divide-x">
            {[
              'Волонтёр',
              'Контакт',
              'Время подачи',
              'Статус заявки',
              showAttendance ? 'Посещение' : 'Действия',
            ].map((label) => (
              <th key={label} scope="col" className="px-4 py-3 font-semibold">
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="grid gap-3 lg:table-row-group">
          {items.map((item) => (
            <tr
              key={item.id}
              className="bg-surface border-line rounded-control lg:divide-line grid min-w-0 gap-3 border p-4 lg:table-row lg:divide-x lg:rounded-none lg:border-x-0 lg:border-b-0 lg:p-0"
            >
              <th
                scope="row"
                className="font-semibold wrap-anywhere lg:px-4 lg:py-3"
              >
                {item.volunteer.name}
              </th>

              <td className="wrap-anywhere lg:px-4 lg:py-3">
                <span className="text-muted block text-sm lg:hidden">
                  Контакт
                </span>
                {item.volunteer.contact}
              </td>

              <td className="lg:px-4 lg:py-3">
                <span className="text-muted block text-sm lg:hidden">
                  Время подачи
                </span>
                {formatDateTime(item.createdAt)}
              </td>

              <td className="lg:px-4 lg:py-3">
                <Badge tone={applicationStatusConfig[item.status].tone}>
                  {applicationStatusConfig[item.status].label}
                </Badge>
              </td>

              <td className="border-line border-t pt-3 lg:border-t-0 lg:px-4 lg:py-3">
                {showAttendance ? (
                  <ParticipantAttendance
                    application={item}
                    event={event}
                    now={now}
                  />
                ) : item.status === 'pending' ? (
                  reviewOpen ? (
                    <ReviewApplicationActions application={item} />
                  ) : (
                    <span className="text-muted">Рассмотрение закрыто</span>
                  )
                ) : item.status === 'confirmed' && removalOpen ? (
                  <RemoveParticipantAction application={item} />
                ) : (
                  <span className="text-muted">
                    <span className="lg:hidden">Нет доступных действий</span>
                    <span className="hidden lg:inline">—</span>
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
