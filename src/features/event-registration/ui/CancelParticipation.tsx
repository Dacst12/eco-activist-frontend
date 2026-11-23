import { getErrorMessage } from '@/shared/api'
import { ConfirmDialog } from '@/shared/ui'
import { useCancelApplication } from '../model/useCancelApplication'
import { cn } from '@/shared/lib/cn'

type Props = {
  eventId: string
  userId: string
  title?: string
  className?: string
}

export function CancelParticipation({
  eventId,
  userId,
  title,
  className,
}: Props) {
  const cancellation = useCancelApplication(eventId, userId)

  return (
    <ConfirmDialog
      trigger="Отменить участие"
      triggerClassName={cn(
        className,
        'border-danger text-danger min-h-11 h-auto flex-auto border px-3 py-2 lg:min-h-0 lg:min-w-0 lg:flex-none hover:bg-danger hover:text-white'
      )}
      title={title ? `Отменить участие в «${title}»?` : 'Отменить участие?'}
      description="Ваше место освободится. Вы сможете записаться снова, пока запись открыта и есть свободные места."
      confirmLabel="Да, отменить"
      backLabel="Сохранить участие"
      pending={cancellation.isPending}
      error={cancellation.isError && getErrorMessage(cancellation.error)}
      onConfirm={() => cancellation.mutate()}
    />
  )
}
