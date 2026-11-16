'use client'

import { useRef, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import type { DictionaryItem } from '@/entities/dictionary'
import { geocoder, type GeocodeResult } from '@/shared/api/geocoder'
import { cn } from '@/shared/lib/cn'
import { LocationPickerMap, type LatLng } from '@/shared/map'
import { buttonClass, TextField } from '@/shared/ui'
import { findDistrictId } from '../lib/district'
import type { EventFormOutput, EventFormValues } from '../model/eventSchema'

const update = {
  shouldValidate: true,
  shouldDirty: true,
  shouldTouch: true,
} as const

export function LocationField({ districts }: { districts: DictionaryItem[] }) {
  const {
    register,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useFormContext<EventFormValues, unknown, EventFormOutput>()

  const location = useWatch({ control, name: 'location' })
  const address = useWatch({ control, name: 'address' })
  const districtId = useWatch({ control, name: 'districtId' })
  const district = districts.find((d) => d.id === districtId)

  const [focus, setFocus] = useState<LatLng | null>(() => getValues('location'))
  const [results, setResults] = useState<GeocodeResult[]>([])
  const [suggestedAddress, setSuggestedAddress] = useState<string | null>(null)
  const [searching, setSearching] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const requestId = useRef(0)

  const setAddress = (value: string) => {
    setValue('address', value, update)
    setSuggestedAddress(null)
  }

  const search = async () => {
    const query = getValues('address').trim()
    if (!query) {
      setMessage('Введите адрес или ориентир')
      return
    }

    const id = ++requestId.current
    setSearching(true)
    setMessage(null)
    setResults([])
    try {
      const found = await geocoder.search(query)
      if (id !== requestId.current) return
      setResults(found)
      if (found.length === 0)
        setMessage(
          'Ничего не нашли. Уточните адрес или поставьте точку на карте'
        )
    } catch {
      if (id === requestId.current)
        setMessage('Поиск адреса не сработал. Поставьте точку на карте')
    } finally {
      if (id === requestId.current) setSearching(false)
    }
  }

  const pick = (place: GeocodeResult) => {
    requestId.current++
    setSearching(false)
    setResults([])
    setMessage(null)
    setValue('location', place.location, update)
    setValue('districtId', findDistrictId(place.areas, districts), update)
    setAddress(place.address)
    setFocus(place.location)
  }

  const movePoint = async (position: LatLng) => {
    const id = ++requestId.current
    setSearching(false)
    setResults([])
    setMessage(null)
    setSuggestedAddress(null)
    setValue('location', position, update)
    setValue('districtId', '', { shouldDirty: true })

    try {
      const place = await geocoder.reverse(position)
      if (id !== requestId.current) return
      setValue('districtId', findDistrictId(place?.areas, districts), update)
      if (!place) return
      if (getValues('address').trim()) setSuggestedAddress(place.address)
      else setAddress(place.address)
    } catch {
      if (id !== requestId.current) return
      setValue('districtId', '', update)
      setMessage(
        'Не удалось определить адрес и район по точке. Попробуйте передвинуть её ещё раз'
      )
    }
  }

  const mapError = errors.location?.message ?? errors.districtId?.message

  return (
    <div className="flex flex-col gap-3">
      <TextField
        label="Адрес / точка на карте *"
        placeholder="ул. Ленина, 1"
        error={errors.address?.message}
        trailing={
          <button
            type="button"
            onClick={() => void search()}
            disabled={searching}
            className="text-primary text-sm font-medium disabled:opacity-60"
          >
            {searching ? 'Ищем…' : 'Найти'}
          </button>
        }
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            void search()
          }
        }}
        {...register('address')}
      />

      {results.length > 0 && (
        <ul className="border-line rounded-control divide-line divide-y border">
          {results.map((place) => (
            <li key={`${place.location.lat},${place.location.lng}`}>
              <button
                type="button"
                onClick={() => pick(place)}
                className="hover:bg-page w-full px-3 py-2 text-left text-sm"
              >
                {place.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      {message && <p className="text-muted text-sm">{message}</p>}

      {suggestedAddress && suggestedAddress !== address && (
        <div className="bg-warning-soft rounded-control flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm">
          <p>
            <span className="text-warning-text">Адрес по новой точке:</span>{' '}
            {suggestedAddress}
          </p>
          <button
            type="button"
            onClick={() => setAddress(suggestedAddress)}
            className={cn(buttonClass('secondary'), 'h-8 px-3 text-sm')}
          >
            Подставить
          </button>
        </div>
      )}

      <LocationPickerMap
        value={location}
        onChange={(position) => void movePoint(position)}
        focus={focus}
        className="h-64"
      />

      <p className="text-muted text-xs">
        Поиск адресов:{' '}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer"
          className="hover:text-primary underline"
        >
          © OpenStreetMap
        </a>
      </p>

      <p
        className={cn('text-sm', mapError ? 'text-danger-text' : 'text-muted')}
      >
        {mapError ??
          (district
            ? `Район: ${district.name}`
            : 'Нажмите на карту, чтобы поставить точку, или найдите адрес')}
      </p>
    </div>
  )
}
