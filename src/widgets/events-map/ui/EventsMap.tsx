'use client'

import { useCallback, useMemo, useState } from 'react'
import { EventCard, type EventSummary } from '@/entities/event'
import { CITY_CENTER, CITY_ZOOM } from '@/shared/config/map'
import { cn } from '@/shared/lib/cn'
import { ClusteredMap, type MapPoint } from '@/shared/map'

type EventsMapProps = {
  events: EventSummary[]
  className?: string
}

export function EventsMap({ events, className }: EventsMapProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = events.find((event) => event.id === selectedId)

  const points = useMemo<MapPoint[]>(
    () => events.map((event) => ({ id: event.id, position: event.location })),
    [events]
  )

  const renderMarker = useCallback(
    (id: string) => {
      const event = events.find((e) => e.id === id)
      return (
        <button
          type="button"
          onClick={() => setSelectedId(id)}
          aria-label={event?.title}
          className={cn(
            'size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md',
            id === selectedId ? 'bg-accent size-6' : 'bg-primary'
          )}
        />
      )
    },
    [events, selectedId]
  )

  return (
    <div className="relative">
      <ClusteredMap
        points={points}
        center={CITY_CENTER}
        zoom={CITY_ZOOM}
        renderMarker={renderMarker}
        className={className}
      />
      {selected && (
        <div className="absolute top-4 right-4 left-4 z-10 sm:right-auto sm:w-80">
          <EventCard event={selected} className="shadow-md" />
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            aria-label="Закрыть"
            className="bg-surface text-muted hover:text-foreground absolute top-3 right-3 flex size-8 items-center justify-center rounded-full"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
