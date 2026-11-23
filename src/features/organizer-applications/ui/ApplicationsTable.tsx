import {
  applicationStatusConfig,
  type Application,
} from '@/entities/application'
import { formatDateTime } from '@/shared/lib/date'
import { Badge } from '@/shared/ui'
import { ReviewApplicationActions } from './ReviewApplicationActions'

type Props = {
  items: Application[]
  reviewOpen: boolean
}

export function ApplicationsTable({ items, reviewOpen }: Props) {
  return (
    <div className="lg:border-line lg:rounded-control lg:overflow-hidden lg:border">
      <table className="block w-full text-left lg:table lg:border-collapse">
        <caption className="sr-only">Заявки волонтёров</caption>

        <thead className="bg-success-soft hidden lg:table-header-group">
          <tr className="divide-line divide-x">
            {['Волонтёр', 'Контакт', 'Время подачи', 'Статус', 'Действия'].map(
              (label) => (
                <th key={label} scope="col" className="px-4 py-3 font-semibold">
                  {label}
                </th>
              )
            )}
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
                {item.status === 'pending' ? (
                  reviewOpen ? (
                    <ReviewApplicationActions application={item} />
                  ) : (
                    <span className="text-muted">Рассмотрение закрыто</span>
                  )
                ) : item.status === 'confirmed' ? (
                  <button
                    type="button"
                    disabled
                    className="rounded-control border-danger text-danger min-h-11 w-full border px-3 py-2 disabled:opacity-60 lg:min-h-0 lg:w-auto"
                  >
                    Снять с мероприятия
                  </button>
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
