'use client'

import { useEffect } from 'react'
import { markMocksReady } from '@/shared/lib/mocks-ready'
import { worker } from './browser'

let started = false

export default function MswWorker() {
  useEffect(() => {
    if (started) return
    started = true
    worker.start({ onUnhandledFrame: 'bypass' }).then(markMocksReady)
  }, [])

  return null
}
