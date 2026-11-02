import { plural } from '@/shared/lib/plural'
import { getFreeSeats } from '../lib/seats'
import type { EventDetails } from '../model/types'

export function EventSeatsSummary({ event }: { event: EventDetails }) {
  const freeSeats = getFreeSeats(event)

  return (
    <div>
      <p className="text-section font-semibold">
        {freeSeats > 0
          ? `${freeSeats} ${plural(freeSeats, ['свободное место', 'свободных места', 'свободных мест'])}`
          : 'Свободных мест нет'}
      </p>
      <p className="text-muted mt-2">
        Лимит {event.capacity}: подтверждено {event.confirmedCount}, ожидают
        решения {event.pendingCount}.
      </p>
    </div>
  )
}
