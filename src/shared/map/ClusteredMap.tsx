'use client'

import type { LngLat, YMapLocationRequest } from '@yandex/ymaps3-types'
import type { Feature } from '@yandex/ymaps3-clusterer'
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { getBounds, toLngLat, toLocation } from './coordinates'
import type { YandexMaps } from './loader'
import { MapStatus } from './MapStatus'
import type { MapPoint, MapView } from './types'
import { useYandexMaps } from './useYandexMaps'

type ClusteredMapProps = {
  points: MapPoint[]
  initialView: MapView
  renderMarker: (id: string) => ReactNode
  className?: string
}

export function ClusteredMap({ className, ...props }: ClusteredMapProps) {
  const state = useYandexMaps()

  if (state.status === 'loading')
    return <MapStatus message="Загружаем карту…" className={className} />
  if (state.status === 'error')
    return (
      <MapStatus message={state.message} tone="danger" className={className} />
    )

  return <MapContent maps={state.maps} className={className} {...props} />
}

function MapContent({
  maps,
  points,
  initialView,
  renderMarker,
  className,
}: ClusteredMapProps & { maps: YandexMaps }) {
  const {
    YMap,
    YMapDefaultSchemeLayer,
    YMapDefaultFeaturesLayer,
    YMapMarker,
    YMapClusterer,
    clusterByGrid,
  } = maps

  const [location, setLocation] = useState<YMapLocationRequest>(() =>
    toLocation(initialView)
  )

  const features = useMemo<Feature[]>(
    () =>
      points.map((point) => ({
        type: 'Feature',
        id: point.id,
        geometry: { type: 'Point', coordinates: toLngLat(point.position) },
      })),
    [points]
  )

  const method = useMemo(() => clusterByGrid({ gridSize: 64 }), [clusterByGrid])

  const marker = useCallback(
    (feature: Feature) => (
      <YMapMarker key={feature.id} coordinates={feature.geometry.coordinates}>
        {renderMarker(feature.id)}
      </YMapMarker>
    ),
    [YMapMarker, renderMarker]
  )

  const cluster = useCallback(
    (coordinates: LngLat, clusterFeatures: Feature[]) => (
      <YMapMarker
        key={clusterFeatures.map((f) => f.id).join('-')}
        coordinates={coordinates}
      >
        <button
          type="button"
          onClick={() =>
            setLocation({
              bounds: getBounds(
                clusterFeatures.map((f) => f.geometry.coordinates)
              ),
              duration: 300,
            })
          }
          className="bg-primary text-primary-foreground flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white font-semibold shadow-md"
          aria-label={`${clusterFeatures.length} мероприятий рядом`}
        >
          {clusterFeatures.length}
        </button>
      </YMapMarker>
    ),
    [YMapMarker]
  )

  return (
    <div className={cn('rounded-card overflow-hidden', className)}>
      <YMap location={location} margin={[48, 48, 48, 48]}>
        <YMapDefaultSchemeLayer />
        <YMapDefaultFeaturesLayer />
        <YMapClusterer
          marker={marker}
          cluster={cluster}
          method={method}
          features={features}
        />
      </YMap>
    </div>
  )
}
