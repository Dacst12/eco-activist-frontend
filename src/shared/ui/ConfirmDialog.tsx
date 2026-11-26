'use client'

import { useId, useRef, type ReactNode } from 'react'
import { Button } from './Button'

type Props = {
  trigger: string
  title: string
  description: string
  confirmLabel: string
  confirmVariant?: 'primary' | 'danger'
  backLabel: string
  pending: boolean
  error?: ReactNode
  triggerClassName?: string
  onConfirm: () => void
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  confirmVariant = 'danger',
  backLabel,
  pending,
  error,
  triggerClassName = 'w-full',
  onConfirm,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  return (
    <>
      <Button
        variant="secondary"
        className={triggerClassName}
        disabled={pending}
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
        className="bg-surface text-foreground rounded-control fixed inset-0 m-auto w-[min(29rem,calc(100%-2rem))] p-6 shadow-lg backdrop:bg-black/40"
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
            className="border-success-text flex-1 border"
            disabled={pending}
            onClick={() => dialog.current?.close()}
          >
            {backLabel}
          </Button>

          <Button
            variant={confirmVariant}
            disabled={pending}
            onClick={onConfirm}
          >
            {pending ? 'Подождите…' : confirmLabel}
          </Button>
        </div>
      </dialog>
    </>
  )
}
