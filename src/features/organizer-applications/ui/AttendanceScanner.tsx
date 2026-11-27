'use client'

import { useRef, useState } from 'react'
import { getErrorMessage } from '@/shared/api'
import { Button } from '@/shared/ui'
import { useScanAttendance } from '../model/useScanAttendance'
import { QrCamera } from './QrCamera'

type Props = {
  eventId: string
  title: string
}

export function AttendanceScanner({ eventId, title }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)
  const scan = useScanAttendance(eventId)

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
          scan.reset()
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

            <div className="relative grid min-h-0 flex-1 place-items-center overflow-hidden">
              {scan.isIdle && <QrCamera onCode={scan.mutate} />}

              {scan.isPending && <p role="status">Проверяем код…</p>}

              {scan.isError && (
                <p role="alert" className="p-4">
                  {getErrorMessage(scan.error)}
                </p>
              )}

              {scan.data && (
                <p role="status" className="p-4">
                  {scan.data.volunteerName} ·{' '}
                  {scan.data.result === 'marked'
                    ? 'Посещение отмечено'
                    : 'Уже отмечено'}
                </p>
              )}
            </div>

            <footer className="flex flex-wrap justify-center gap-3 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              {(scan.isSuccess || scan.isError) && (
                <Button onClick={() => scan.reset()}>Сканировать ещё</Button>
              )}

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
