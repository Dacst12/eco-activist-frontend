import type { LngLat, LngLatBounds } from '@yandex/ymaps3-types'
import type { LatLng } from './types'

export const toLngLat = ({ lat, lng }: LatLng): LngLat => [lng, lat]

export const getBounds = (points: LngLat[]): LngLatBounds => {
  const lngs = points.map(([lng]) => lng)
  const lats = points.map(([, lat]) => lat)
  return [
    [Math.min(...lngs), Math.max(...lats)],
    [Math.max(...lngs), Math.min(...lats)],
  ]
}
