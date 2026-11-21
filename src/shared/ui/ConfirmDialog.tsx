'use client'

import { useId, useRef, type ReactNode } from 'react'
import { Button } from './Button'

type Props = {
  trigger: string
  title: string
  description: string
  confirmLabel: string
  backLabel: string
  pending: boolean
  error?: ReactNode
  onConfirm: () => void
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  backLabel,
  pending,
  error,
  onConfirm,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  return (
    <>
      <Button
        variant="danger"
        className="w-full"
        onClick={() => dialog.current?.showModal()}
      >
        {trigger}
      </Button>

      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onCancel={(event) => {
          if (pending) event.preventDefault()
        }}
        className="bg-surface text-foreground rounded-control fixed inset-0 m-auto w-[min(28rem,calc(100%-2rem))] p-6 shadow-lg backdrop:bg-black/40"
      >
        <h2 id={titleId} className="text-xl font-semibold">
          {title}
        </h2>

        <p id={descriptionId} className="text-muted mt-2">
          {description}
        </p>

        {error && (
          <p role="alert" className="text-danger-text mt-3">
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            autoFocus
            variant="secondary"
            disabled={pending}
            onClick={() => dialog.current?.close()}
          >
            {backLabel}
          </Button>

          <Button variant="danger" disabled={pending} onClick={onConfirm}>
            {pending ? 'Подождите…' : confirmLabel}
          </Button>
        </div>
      </dialog>
    </>
  )
}
