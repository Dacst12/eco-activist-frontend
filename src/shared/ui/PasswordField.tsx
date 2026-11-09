'use client'

import { useState, type ComponentProps } from 'react'
import { TextField } from './TextField'

type PasswordFieldProps = Omit<
  ComponentProps<typeof TextField>,
  'type' | 'trailing'
>

export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <TextField
      {...props}
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="text-primary text-sm font-medium"
          aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
        >
          {visible ? 'Скрыть' : 'Показать'}
        </button>
      }
    />
  )
}
