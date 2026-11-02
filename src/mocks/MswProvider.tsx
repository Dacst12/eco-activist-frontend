'use client'

import dynamic from 'next/dynamic'
import type { ReactNode } from 'react'

const enabled = process.env.NEXT_PUBLIC_USE_MOCKS === 'true'

const MswWorker = dynamic(() => import('./MswWorker'), { ssr: false })

export function MswProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {enabled && <MswWorker />}
      {children}
    </>
  )
}
