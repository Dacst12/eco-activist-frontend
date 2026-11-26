'use client'

import { QRCodeSVG } from 'qrcode.react'
import { useVolunteerQr } from '@/entities/application'
import { useSession } from '@/entities/user'
import { getErrorMessage } from '@/shared/api'
import { CITY_TIMEZONE_LABEL } from '@/shared/config/locale'
import { formatDateTime } from '@/shared/lib/date'
import { Button } from '@/shared/ui'

export function VolunteerQrCard({ eventId }: { eventId: string }) {
  const { data: user } = useSession()
  const qr = useVolunteerQr(eventId, user?.id)

  if (qr.isError) {
    return (
      <div className="space-y-3">
        <p role="alert">{getErrorMessage(qr.error)}</p>
        <Button variant="secondary" onClick={() => void qr.refetch()}>
          Проверить снова
        </Button>
      </div>
    )
  }

  if (!qr.data) {
    return <p role="status">Загружаем QR-код…</p>
  }

  const { token, volunteerName, event } = qr.data

  return (
    <div className="grid items-start gap-4 md:grid-cols-[20rem_1fr]">
      <div className="bg-surface rounded-card flex flex-col items-center gap-3 p-5">
        <QRCodeSVG
          value={token}
          size={256}
          marginSize={4}
          level="M"
          title="Код участника для отметки посещения"
          className="h-auto max-w-full"
        />

        <p className="text-muted text-center">
          Покажите этот код организатору на мероприятии.
        </p>
      </div>

      <div className="space-y-4">
        <section className="bg-surface rounded-card space-y-3 p-5">
          <h2 className="text-xl font-semibold">{event.title}</h2>

          <p>
            {formatDateTime(event.startsAt)} — {formatDateTime(event.endsAt)} (
            {CITY_TIMEZONE_LABEL})
          </p>

          <p>Волонтёр: {volunteerName}</p>
        </section>

        <section className="bg-surface rounded-card space-y-2 p-5">
          <h2 className="text-xl font-semibold">После отметки</h2>

          <p>
            Организатор подтвердит посещение. После окончания мероприятия запись
            появится в истории ваших мероприятий.
          </p>
        </section>
      </div>
    </div>
  )
}
