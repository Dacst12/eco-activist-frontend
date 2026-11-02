'use client'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <p>Не удалось загрузить мероприятия.</p>
      <button
        onClick={reset}
        className="bg-primary text-primary-foreground hover:bg-primary-hover rounded-control mt-4 h-12 px-6 font-medium"
      >
        Попробовать ещё раз
      </button>
    </div>
  )
}
