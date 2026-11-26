import { Button } from '@/shared/ui'

type Props = {
  page: number
  pages: number
  onChange: (page: number) => void
}

export function ApplicationsPagination({ page, pages, onChange }: Props) {
  if (pages === 1 && page === 1) return null

  return (
    <nav
      aria-label="Страницы заявок"
      className="flex flex-wrap items-center gap-3"
    >
      <Button
        variant="secondary"
        disabled={page === 1}
        onClick={() => onChange(Math.min(page - 1, pages))}
      >
        Назад
      </Button>

      {page <= pages && (
        <span>
          Страница {page} из {pages}
        </span>
      )}

      <Button
        variant="secondary"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
      >
        Далее
      </Button>
    </nav>
  )
}
