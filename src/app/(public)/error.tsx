'use client'

import { Button } from '@/shared/ui'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex flex-1 flex-col items-center justify-center px-4 py-12">
      <h1 className="text-subtitle font-semibold">
        Не удалось загрузить мероприятия.
      </h1>
      <Button onClick={reset} className="mt-4">
        Попробовать ещё раз
      </Button>
    </div>
  )
}
