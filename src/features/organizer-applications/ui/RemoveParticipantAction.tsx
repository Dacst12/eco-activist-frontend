import type { Application } from '@/entities/application'
import { getErrorMessage } from '@/shared/api'
import { ConfirmDialog } from '@/shared/ui'
import { useReviewApplication } from '../model/useReviewApplication'

export function RemoveParticipantAction({
  application,
}: {
  application: Application
}) {
  const removal = useReviewApplication(application)

  return (
    <ConfirmDialog
      trigger="Снять с мероприятия"
      triggerClassName="border-danger text-danger min-h-11 h-auto w-full border px-3 py-2 lg:min-h-0 lg:min-w-0 lg:w-auto hover:bg-danger hover:text-white"
      title="Снять участника с мероприятия?"
      description={`Участник: ${application.volunteer.name}. Место освободится, волонтёр получит уведомление и больше не сможет записаться на это мероприятие.`}
      backLabel="Оставить"
      confirmLabel="Снять"
      pending={removal.isPending}
      error={removal.isError && getErrorMessage(removal.error)}
      onConfirm={() => removal.mutate('remove')}
    />
  )
}
