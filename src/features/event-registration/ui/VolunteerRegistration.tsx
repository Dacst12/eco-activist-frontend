import { useRouter } from 'next/navigation'
import { startTransition } from 'react'
import { useApplication } from '@/entities/application'
import { getErrorMessage } from '@/shared/api'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui'
import { ApplicationStatusBlock } from './ApplicationStatusBlock'
import { useSubmitApplication } from '../model/useSubmitApplication'

export type VolunteerRegistrationProps = {
  userId: string
  eventId: string
  label: string
  open: boolean
  registrationEndsAt: string
  refreshEventAction: () => Promise<void>
  className?: string
}

export function VolunteerRegistration({
  eventId,
  userId,
  label,
  open,
  registrationEndsAt,
  refreshEventAction,
  className,
}: VolunteerRegistrationProps) {
  const router = useRouter()
  const mine = useApplication(eventId, userId)

  function refreshSeats() {
    startTransition(async () => {
      try {
        await refreshEventAction()
      } catch {
        router.refresh()
      }
    })
  }

  const submission = useSubmitApplication(eventId, userId, refreshSeats)

  async function checkApplication() {
    const result = await mine.refetch()

    if (result.isSuccess && submission.isError) {
      submission.reset()
      if (result.data && result.data.status !== 'cancelled') {
        refreshSeats()
      }
    }
  }

  if (mine.isPending) {
    return (
      <p role="status" className={cn('text-muted text-sm', className)}>
        Проверяем статус заявки…
      </p>
    )
  }

  if (mine.isError) {
    return (
      <div className={cn('space-y-2', className)}>
        <p role="alert" className="text-danger-text text-sm">
          Не удалось проверить статус заявки.
        </p>
        <Button
          variant="secondary"
          disabled={mine.isFetching || submission.isPending}
          onClick={() => void checkApplication()}
        >
          {mine.isFetching ? 'Проверяем…' : 'Проверить заявку'}
        </Button>
      </div>
    )
  }

  const application = mine.data
  const canApply = !application || application.status === 'cancelled'

  return (
    <div className={cn('space-y-3', className)}>
      {application && (
        <ApplicationStatusBlock
          status={application.status}
          registrationEndsAt={registrationEndsAt}
        />
      )}

      {submission.isError && canApply && (
        <p role="alert" className="text-danger-text text-sm">
          {getErrorMessage(submission.error)}
        </p>
      )}

      {canApply && (
        <Button
          className="w-full"
          disabled={!open || submission.isPending || mine.isFetching}
          onClick={() => submission.mutate()}
        >
          {submission.isPending ? 'Отправляем заявку…' : label}
        </Button>
      )}
    </div>
  )
}
