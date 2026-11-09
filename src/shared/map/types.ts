export type LatLng = { lat: number; lng: number }
export type MapPoint = { id: string; position: LatLng }
export type MapView =
  { center: LatLng; zoom: number } | { fit: [LatLng, ...LatLng[]] }
