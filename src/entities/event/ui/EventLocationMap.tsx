'use client'

import { PointMap } from '@/shared/map'
import type { GeoPoint } from '../model/types'

type EventLocationMapProps = { location: GeoPoint; className?: string }

export function EventLocationMap({
  location,
  className,
}: EventLocationMapProps) {
  return (
    <PointMap
      position={location}
      className={className}
      marker={
        <div className="bg-primary size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md" />
      }
    />
  )
}
