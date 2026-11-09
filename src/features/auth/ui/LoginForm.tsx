'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { Route } from 'next'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { routes } from '@/shared/config/routes'
import { applyServerErrors } from '@/shared/lib/form'
import { Button, FormError, PasswordField, TextField } from '@/shared/ui'
import { loginSchema } from '../model/loginSchema'
import { useLogin } from '../model/useLogin'
import { useRedirectIfAuthenticated } from '../model/useRedirectIfAuthenticated'

export function LoginForm({ next }: { next: Route }) {
  const login = useLogin(next)
  useRedirectIfAuthenticated(next)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: '', password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login.mutateAsync(values)
    } catch (error) {
      applyServerErrors(error, setError, ['login', 'password'])
    }
  })

  const registerHref =
    `${routes.register}?next=${encodeURIComponent(next)}` as Route

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <FormError message={errors.root?.server?.message} />

      <TextField
        label="Email или телефон"
        placeholder="name@example.ru"
        autoComplete="username"
        error={errors.login?.message}
        {...register('login')}
      />

      <PasswordField
        label="Пароль"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" disabled={login.isPending} className="mt-2 w-full">
        {login.isPending ? 'Входим…' : 'Войти'}
      </Button>

      <Link
        href={registerHref}
        className="text-primary text-center font-semibold"
      >
        Создать аккаунт
      </Link>
    </form>
  )
}
