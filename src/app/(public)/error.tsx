'use client'

import { Button } from '@/shared/ui'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <p>Не удалось загрузить мероприятия.</p>
      <Button onClick={reset} className="mt-4">
        Попробовать ещё раз
      </Button>
    </div>
  )
}
