import React from 'react'
import ReactDOM from 'react-dom'
import type {} from '@yandex/ymaps3-types'

const SCRIPT_URL = 'https://api-maps.yandex.ru/v3/'

let scriptPromise: Promise<void> | null = null

function loadScript() {
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const key = process.env.NEXT_PUBLIC_YMAPS_KEY
    if (!key) {
      reject(new Error('Не задан ключ NEXT_PUBLIC_YMAPS_KEY'))
      return
    }
    const script = document.createElement('script')
    script.src = `${SCRIPT_URL}?apikey=${key}&lang=ru_RU`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      scriptPromise = null
      reject(new Error('Не удалось загрузить Яндекс Карты'))
    }
    document.head.append(script)
  })
  return scriptPromise
}

async function load() {
  await loadScript()
  const [ymaps3React] = await Promise.all([
    ymaps3.import('@yandex/ymaps3-reactify'),
    ymaps3.ready,
  ])
  const reactify = ymaps3React.reactify.bindTo(React, ReactDOM)
  const clusterer = await import('@yandex/ymaps3-clusterer')

  return {
    ...reactify.module(ymaps3),
    YMapClusterer: reactify.module(clusterer).YMapClusterer,
    clusterByGrid: clusterer.clusterByGrid,
  }
}

export type YandexMaps = Awaited<ReturnType<typeof load>>

let mapsPromise: Promise<YandexMaps> | null = null

export const loadYandexMaps = () => {
  mapsPromise ??= load().catch((error) => {
    mapsPromise = null
    throw error
  })
  return mapsPromise
}
