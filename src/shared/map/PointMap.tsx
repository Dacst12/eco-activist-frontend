'use client'

import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { toLngLat } from './coordinates'
import type { YandexMaps } from './loader'
import { MapStatus } from './MapStatus'
import type { LatLng } from './types'
import { useYandexMaps } from './useYandexMaps'

type PointMapProps = {
  position: LatLng
  zoom?: number
  marker: ReactNode
  className?: string
}

export function PointMap({ className, ...props }: PointMapProps) {
  const state = useYandexMaps()

  if (state.status === 'loading')
    return <MapStatus message="Загружаем карту…" className={className} />
  if (state.status === 'error')
    return (
      <MapStatus message={state.message} tone="danger" className={className} />
    )

  return <PointMapContent maps={state.maps} className={className} {...props} />
}

function PointMapContent({
  maps,
  position,
  zoom = 15,
  marker,
  className,
}: PointMapProps & { maps: YandexMaps }) {
  const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } =
    maps
  const coordinates = toLngLat(position)

  return (
    <div className={cn('rounded-card overflow-hidden', className)}>
      <YMap location={{ center: coordinates, zoom }}>
        <YMapDefaultSchemeLayer />
        <YMapDefaultFeaturesLayer />
        <YMapMarker coordinates={coordinates}>{marker}</YMapMarker>
      </YMap>
    </div>
  )
}
