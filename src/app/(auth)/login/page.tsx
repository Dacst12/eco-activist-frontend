import type { Metadata } from 'next'
import { getSafeNext, LoginForm } from '@/features/auth'

export const metadata: Metadata = { title: 'Вход — Эко Активист' }

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const next = getSafeNext((await searchParams).next)
  const returnsToEvent = next.startsWith('/events/')

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-title font-semibold">Вход</h1>
      <p className="text-muted mt-2">
        {returnsToEvent
          ? 'После входа вы вернётесь к выбранному мероприятию.'
          : 'Войдите, чтобы записываться на мероприятия и следить за своим вкладом.'}
      </p>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
        <section className="bg-surface rounded-card p-6 sm:p-8">
          <LoginForm next={next} />
        </section>

        <aside className="bg-success-soft rounded-card p-6">
          <h2 className="text-subtitle font-semibold">Выберите своё участие</h2>
          <p className="text-muted mt-3">
            Волонтёр записывается на события. Организатор создаёт события после
            проверки. Для разных ролей нужны отдельные аккаунты.
          </p>
        </aside>
      </div>
    </main>
  )
}
