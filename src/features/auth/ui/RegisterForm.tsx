'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { roleLabel } from '@/entities/user'
import { applyServerErrors } from '@/shared/lib/form'
import {
  Badge,
  Button,
  CheckboxField,
  FormError,
  PasswordField,
  TextField,
} from '@/shared/ui'
import { organizerPendingHref, type RegisterRole } from '../lib/role'
import { registerSchema } from '../model/registerSchema'
import { useRegister } from '../model/useRegister'
import Link from 'next/link'
import { routes } from '@/shared/config/routes'

type RegisterFormProps = { role: RegisterRole; next: Route }

export function RegisterForm({ role, next }: RegisterFormProps) {
  const router = useRouter()
  const registration = useRegister()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      login: '',
      password: '',
      passwordConfirm: '',
      consent: false,
    },
  })

  const onSubmit = handleSubmit(async ({ name, login, password }) => {
    try {
      await registration.mutateAsync({
        name,
        login,
        password,
        role,
        consent: true,
      })
      router.replace(role === 'organizer' ? organizerPendingHref(next) : next)
    } catch (error) {
      applyServerErrors(error, setError, [
        'name',
        'login',
        'password',
        'consent',
      ])
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <Badge tone="success" className="w-full px-4 py-3">
        Выбрано: {roleLabel[role]}
      </Badge>

      <FormError message={errors.root?.server?.message} />

      <TextField
        label="Имя"
        placeholder={
          role === 'organizer'
            ? 'Введите название организации'
            : 'Введите ваше имя'
        }
        autoComplete={role === 'organizer' ? 'organization' : 'given-name'}
        error={errors.name?.message}
        {...register('name')}
      />

      <TextField
        label="Email или телефон"
        placeholder="name@example.ru"
        autoComplete="username"
        error={errors.login?.message}
        {...register('login')}
      />

      <PasswordField
        label="Пароль"
        placeholder="Введите пароль"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />

      <PasswordField
        label="Повторите пароль"
        placeholder="Введите пароль ещё раз"
        autoComplete="new-password"
        error={errors.passwordConfirm?.message}
        {...register('passwordConfirm')}
      />

      <CheckboxField
        label={
          <>
            Согласен на{' '}
            <Link
              href={routes.privacy}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              обработку персональных данных
            </Link>
          </>
        }
        error={errors.consent?.message}
        {...register('consent')}
      />

      <Button
        type="submit"
        disabled={registration.isPending}
        className="mt-2 w-full"
      >
        {registration.isPending ? 'Создаём аккаунт…' : 'Создать аккаунт'}
      </Button>
    </form>
  )
}
