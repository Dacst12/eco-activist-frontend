'use client'

import { useEffect, useState, type ReactNode } from 'react'

const enabled = process.env.NEXT_PUBLIC_USE_MOCKS === 'true'

export function MswProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!enabled)

  useEffect(() => {
    if (!enabled) return
    import('./browser')
      .then(({ worker }) => worker.start({ onUnhandledFrame: 'bypass' }))
      .then(() => setReady(true))
  }, [])

  return ready ? children : null
}
