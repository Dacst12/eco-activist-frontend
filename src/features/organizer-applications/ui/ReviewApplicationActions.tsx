import type { Application } from '@/entities/application'
import { getErrorMessage } from '@/shared/api'
import { ConfirmDialog } from '@/shared/ui'
import { useReviewApplication } from '../model/useReviewApplication'

export function ReviewApplicationActions({
  application,
}: {
  application: Application
}) {
  const review = useReviewApplication(application)
  const error = review.isError && getErrorMessage(review.error)

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={review.isPending}
        onClick={() => review.mutate('confirm')}
        className="rounded-control bg-primary min-h-11 flex-auto px-3 py-2 text-white disabled:opacity-60 lg:min-h-0 lg:flex-none"
      >
        {review.isPending && review.variables === 'confirm'
          ? 'Подтверждаем…'
          : 'Подтвердить'}
      </button>

      <ConfirmDialog
        trigger="Отклонить"
        triggerClassName="border-danger text-danger min-h-11 h-auto flex-auto border px-3 py-2 lg:min-h-0 lg:min-w-0 lg:flex-none hover:bg-danger hover:text-white"
        title="Отклонить заявку?"
        description={`Участник: ${application.volunteer.name}. После отказа место освободится.`}
        backLabel="Назад"
        confirmLabel="Отклонить заявку"
        pending={review.isPending}
        error={review.variables === 'reject' && error}
        onConfirm={() => review.mutate('reject')}
      />

      {review.variables === 'confirm' && error && (
        <p role="alert" className="text-danger-text w-full">
          {error}
        </p>
      )}
    </div>
  )
}
