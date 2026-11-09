'use client'

import { useCallback, useMemo, useState } from 'react'
import { EventCard, type EventSummary } from '@/entities/event'
import { CITY_CENTER, CITY_ZOOM } from '@/shared/config/map'
import { cn } from '@/shared/lib/cn'
import { ClusteredMap, type MapPoint, type MapView } from '@/shared/map'
import { replaceSearchParam } from '@/shared/lib/url-client'

type EventsMapProps = {
  events: EventSummary[]
  initialSelectedId?: string
  className?: string
}

export function EventsMap({
  events,
  initialSelectedId,
  className,
}: EventsMapProps) {
  const [selectedId, setSelectedId] = useState(initialSelectedId ?? null)
  const selected = events.find((event) => event.id === selectedId)

  const select = useCallback((id: string | null) => {
    setSelectedId(id)
    replaceSearchParam('selected', id)
  }, [])

  const points = useMemo<MapPoint[]>(
    () => events.map((event) => ({ id: event.id, position: event.location })),
    [events]
  )

  const [initialView] = useState<MapView>(() => {
    const initial = events.find((event) => event.id === initialSelectedId)
    if (initial) return { center: initial.location, zoom: 15 }
    const [first, ...rest] = events.map((event) => event.location)
    return first
      ? { fit: [first, ...rest] }
      : { center: CITY_CENTER, zoom: CITY_ZOOM }
  })

  const renderMarker = useCallback(
    (id: string) => {
      const event = events.find((e) => e.id === id)
      return (
        <button
          type="button"
          onClick={() => select(id)}
          aria-label={event?.title}
          className={cn(
            'size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md',
            id === selectedId ? 'bg-accent size-6' : 'bg-primary'
          )}
        />
      )
    },
    [events, selectedId, select]
  )

  return (
    <div className="relative">
      <ClusteredMap
        points={points}
        initialView={initialView}
        renderMarker={renderMarker}
        className={className}
      />
      {selected && (
        <div className="absolute top-4 right-4 left-4 z-10 sm:right-auto sm:w-80">
          <EventCard event={selected} className="shadow-md" />
          <button
            type="button"
            onClick={() => select(null)}
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
