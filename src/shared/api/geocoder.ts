import { CITY_VIEWBOX, GEOCODER_URL } from '@/shared/config/map'
import type { LatLng } from '@/shared/map'

const MIN_INTERVAL = 1000

type NominatimPlace = {
  lat: string
  lon: string
  name?: string
  display_name: string
  address?: Record<string, string | undefined>
}

export type GeocodeResult = {
  label: string
  address: string
  location: LatLng
  areas: string[]
}

let nextRequestAt = 0
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function request<T>(
  path: string,
  params: Record<string, string>
): Promise<T> {
  const at = Math.max(Date.now(), nextRequestAt)
  nextRequestAt = at + MIN_INTERVAL
  await wait(at - Date.now())

  const query = new URLSearchParams({
    format: 'jsonv2',
    addressdetails: '1',
    'accept-language': 'ru',
    ...params,
  })
  const response = await fetch(`${GEOCODER_URL}${path}?${query}`)
  if (!response.ok) throw new Error(`Geocoder error: ${response.status}`)
  return response.json() as Promise<T>
}

function toResult(place: NominatimPlace): GeocodeResult {
  const address = place.address ?? {}
  const street =
    address.road ?? address.pedestrian ?? address.footway ?? address.square
  const parts = place.display_name.split(', ')

  const name =
    place.name && place.name !== street && place.name !== address.house_number
      ? place.name
      : undefined
  const streetLine =
    street && [street, address.house_number].filter(Boolean).join(', ')
  const short = [name, streetLine].filter(Boolean).join(', ')

  return {
    label: parts.slice(0, 4).join(', '),
    address: short || parts.slice(0, 2).join(', '),
    location: { lat: Number(place.lat), lng: Number(place.lon) },
    areas: Object.values(address).filter((value): value is string =>
      Boolean(value)
    ),
  }
}

export const geocoder = {
  search: async (query: string) => {
    const places = await request<NominatimPlace[]>('/search', {
      q: query,
      limit: '5',
      countrycodes: 'ru',
      viewbox: CITY_VIEWBOX,
      bounded: '1',
    })
    return places.map(toResult)
  },

  reverse: async ({ lat, lng }: LatLng) => {
    const place = await request<NominatimPlace | { error: string }>(
      '/reverse',
      {
        lat: String(lat),
        lon: String(lng),
        zoom: '18',
      }
    )
    return 'error' in place ? null : toResult(place)
  },
}
