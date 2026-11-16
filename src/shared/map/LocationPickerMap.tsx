'use client'

import { useMemo } from 'react'
import { CITY_CENTER, CITY_ZOOM } from '@/shared/config/map'
import { cn } from '@/shared/lib/cn'
import { fromLngLat, toLngLat, toLocation } from './coordinates'
import type { YandexMaps } from './loader'
import { MapStatus } from './MapStatus'
import type { LatLng } from './types'
import { useYandexMaps } from './useYandexMaps'

const FOCUS_ZOOM = 16

type LocationPickerMapProps = {
  value: LatLng | null
  onChange: (position: LatLng) => void
  focus: LatLng | null
  className?: string
}

export function LocationPickerMap({
  className,
  ...props
}: LocationPickerMapProps) {
  const state = useYandexMaps()

  if (state.status === 'loading')
    return <MapStatus message="Загружаем карту…" className={className} />
  if (state.status === 'error')
    return (
      <MapStatus message={state.message} tone="danger" className={className} />
    )

  return (
    <LocationPickerMapContent
      maps={state.maps}
      className={className}
      {...props}
    />
  )
}

function LocationPickerMapContent({
  maps,
  value,
  onChange,
  focus,
  className,
}: LocationPickerMapProps & { maps: YandexMaps }) {
  const {
    YMap,
    YMapDefaultSchemeLayer,
    YMapDefaultFeaturesLayer,
    YMapListener,
    YMapMarker,
  } = maps
  const location = useMemo(
    () => ({
      ...toLocation(
        focus
          ? { center: focus, zoom: FOCUS_ZOOM }
          : { center: CITY_CENTER, zoom: CITY_ZOOM }
      ),
      duration: 300,
    }),
    [focus]
  )

  return (
    <div className={cn('rounded-card overflow-hidden', className)}>
      <YMap location={location}>
        <YMapDefaultSchemeLayer />
        <YMapDefaultFeaturesLayer />
        <YMapListener
          onClick={(_, event) => onChange(fromLngLat(event.coordinates))}
        />
        {value && (
          <YMapMarker
            coordinates={toLngLat(value)}
            draggable
            onDragEnd={(coordinates) => onChange(fromLngLat(coordinates))}
          >
            <div className="bg-primary size-6 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-white shadow-md" />
          </YMapMarker>
        )}
      </YMap>
    </div>
  )
}
