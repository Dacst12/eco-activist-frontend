'use client'

import { useState } from 'react'
import { getErrorMessage } from '@/shared/api'
import { Button } from '@/shared/ui'
import { useScanAttendance } from '../model/useScanAttendance'
import { QrCamera } from './QrCamera'

export function AttendanceScanner({ eventId }: { eventId: string }) {
  const [open, setOpen] = useState(false)
  const scan = useScanAttendance(eventId)

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        className="lg:bg-surface lg:text-primary lg:border-line lg:hover:bg-success-soft w-full lg:w-auto lg:border"
      >
        Сканировать QR
      </Button>
    )
  }

  return (
    <section
      aria-label="Сканирование QR"
      className="rounded-card bg-surface space-y-3 p-4"
    >
      {scan.isIdle && <QrCamera onCode={scan.mutate} />}

      {scan.isPending && <p role="status">Проверяем код…</p>}

      {scan.isError && <p role="alert">{getErrorMessage(scan.error)}</p>}

      {scan.data && (
        <p role="status">
          {scan.data.volunteerName} ·{' '}
          {scan.data.result === 'marked'
            ? 'Посещение отмечено'
            : 'Уже отмечено'}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {(scan.isSuccess || scan.isError) && (
          <Button onClick={() => scan.reset()}>Сканировать ещё</Button>
        )}

        <Button
          variant="secondary"
          disabled={scan.isPending}
          onClick={() => {
            setOpen(false)
            scan.reset()
          }}
        >
          К ручной отметке
        </Button>
      </div>
    </section>
  )
}
