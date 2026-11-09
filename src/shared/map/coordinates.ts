import type {
  LngLat,
  LngLatBounds,
  YMapLocationRequest,
} from '@yandex/ymaps3-types'
import type { LatLng, MapView } from './types'

const SINGLE_POINT_ZOOM = 15

export const toLngLat = ({ lat, lng }: LatLng): LngLat => [lng, lat]

export const getBounds = (points: LngLat[]): LngLatBounds => {
  const lngs = points.map(([lng]) => lng)
  const lats = points.map(([, lat]) => lat)
  return [
    [Math.min(...lngs), Math.max(...lats)],
    [Math.max(...lngs), Math.min(...lats)],
  ]
}

export const toLocation = (view: MapView): YMapLocationRequest => {
  if ('center' in view)
    return { center: toLngLat(view.center), zoom: view.zoom }
  if (view.fit.length === 1)
    return { center: toLngLat(view.fit[0]), zoom: SINGLE_POINT_ZOOM }
  return { bounds: getBounds(view.fit.map(toLngLat)) }
}
