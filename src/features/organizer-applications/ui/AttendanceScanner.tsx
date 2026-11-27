'use client'

import { useCallback, useRef, useState } from 'react'
import { Button } from '@/shared/ui'
import { useScanAttendance } from '../model/useScanAttendance'
import { QrCamera } from './QrCamera'
import { getScanErrorFeedback } from '../model/getScanErrorFeedback'
import { formatDateTime } from '@/shared/lib/date'
import { ScanResultCard } from './ScanResultCard'
import { CITY_TIMEZONE_LABEL } from '@/shared/config/locale'
import { ScanPreview } from './ScanPreview'

type Props = {
  eventId: string
  title: string
}

export function AttendanceScanner({ eventId, title }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)
  const scan = useScanAttendance(eventId)

  const [frame, setFrame] = useState<ImageData | null>(null)
  const { mutate } = scan

  const onCode = useCallback(
    (token: string, captured: ImageData) => {
      setFrame(captured)
      mutate(token)
    },
    [mutate]
  )

  function resetScan() {
    setFrame(null)
    scan.reset()
  }

  function close() {
    dialog.current?.close()
  }

  return (
    <>
      <Button
        className="w-full"
        onClick={() => {
          dialog.current?.showModal()
          setOpen(true)
        }}
      >
        Сканировать QR
      </Button>

      <dialog
        ref={dialog}
        aria-label={`Сканирование QR · ${title}`}
        onClose={() => {
          setOpen(false)
          resetScan()
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-black p-0 text-white"
      >
        {open && (
          <div className="flex h-full flex-col">
            <header className="flex items-center justify-between gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
              <h2 className="truncate font-semibold">{title}</h2>

              <button type="button" onClick={close} className="min-h-11 px-2">
                Закрыть
              </button>
            </header>

            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
              {!frame && scan.isIdle && <QrCamera onCode={onCode} />}

              {scan.isPending && (
                <ScanResultCard tone="neutral" title="Проверяем код…" />
              )}

              {scan.isError && (
                <ScanResultCard alert {...getScanErrorFeedback(scan.error)} />
              )}

              {scan.data && (
                <ScanResultCard
                  tone={scan.data.result === 'marked' ? 'success' : 'neutral'}
                  title={
                    scan.data.result === 'marked'
                      ? 'Посещение отмечено'
                      : 'Уже отмечено'
                  }
                  message={`${scan.data.volunteerName} · ${formatDateTime(scan.data.attendedAt)} (${CITY_TIMEZONE_LABEL})`}
                />
              )}

              {frame && (
                <ScanPreview
                  frame={frame}
                  phase={
                    scan.isError
                      ? 'error'
                      : scan.isSuccess
                        ? 'success'
                        : 'pending'
                  }
                />
              )}
            </div>

            <footer className="flex flex-wrap justify-center gap-3 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <Button onClick={resetScan}>
                {scan.isSuccess
                  ? 'Сканировать следующего'
                  : 'Сканировать снова'}
              </Button>

              <Button variant="secondary" onClick={close}>
                К ручной отметке
              </Button>
            </footer>
          </div>
        )}
      </dialog>
    </>
  )
}
