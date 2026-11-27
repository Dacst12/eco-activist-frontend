import { isAxiosError } from 'axios'
import { getErrorMessage, getProblem } from '@/shared/api'
import type { BadgeTone } from '@/shared/ui'

type Feedback = {
  title: string
  message: string
  tone: BadgeTone
}

const errors: Record<string, Feedback | undefined> = {
  invalid_qr: {
    title: 'Код недействителен',
    message: 'Попросите волонтёра открыть свой QR-код в кабинете.',
    tone: 'danger',
  },
  wrong_event: {
    title: 'Код другого мероприятия',
    message: 'Сверьте название мероприятия на экране волонтёра.',
    tone: 'danger',
  },
  not_confirmed: {
    title: 'Запись не подтверждена',
    message: 'Проверьте статус заявки в списке участников.',
    tone: 'warning',
  },
  attendance_not_open: {
    title: 'Отметка пока недоступна',
    message: 'Отмечать участников можно с начала мероприятия.',
    tone: 'neutral',
  },
  attendance_closed: {
    title: 'Срок отметки истёк',
    message: 'Прошло 48 часов после окончания мероприятия.',
    tone: 'danger',
  },
  event_unavailable: {
    title: 'Отметка недоступна',
    message: 'Проверьте статус мероприятия в кабинете.',
    tone: 'warning',
  },
}

export function getScanErrorFeedback(error: unknown): Feedback {
  if (isAxiosError(error) && !error.response) {
    return {
      title: 'Нет связи с сервером',
      message:
        'После восстановления связи проверьте участника в списке. Запрос мог успеть сохраниться.',
      tone: 'warning',
    }
  }

  return (
    errors[getProblem(error)?.code ?? ''] ?? {
      title: 'Не удалось проверить код',
      message: getErrorMessage(error),
      tone: 'danger',
    }
  )
}
