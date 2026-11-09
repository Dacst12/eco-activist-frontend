import type { Metadata } from 'next'
import Link from 'next/link'
import {
  getSafeNext,
  parseRegisterRole,
  RegisterForm,
  registerHref,
} from '@/features/auth'
import { cn } from '@/shared/lib/cn'

export const metadata: Metadata = { title: 'Создание аккаунта — Эко Активист' }

const roleCards = [
  {
    role: 'volunteer',
    title: 'Волонтёр',
    text: 'Участвуйте в мероприятиях и отслеживайте личный вклад. Доступ после регистрации.',
  },
  {
    role: 'organizer',
    title: 'Организатор',
    text: 'Создавайте события и управляйте участниками после проверки администратора.',
  },
] as const

export default async function RegisterPage({
  searchParams,
}: PageProps<'/register'>) {
  const params = await searchParams
  const role = parseRegisterRole(params.role)
  const next = getSafeNext(params.next)

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-title font-semibold">Создание аккаунта</h1>
      <p className="text-muted mt-2">
        Тип аккаунта выбирается при регистрации.
      </p>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
        <section className="bg-surface rounded-card p-6 sm:p-8">
          <RegisterForm role={role} next={next} />
        </section>

        <aside className="flex flex-col gap-4">
          {roleCards.map((card) => (
            <Link
              key={card.role}
              href={registerHref(card.role, next)}
              aria-current={card.role === role ? 'true' : undefined}
              className={cn(
                'bg-surface rounded-card block p-6 transition-shadow hover:shadow-md',
                card.role === role && 'ring-primary ring-2'
              )}
            >
              <h2 className="text-subtitle font-semibold">{card.title}</h2>
              <p className="text-muted mt-2">{card.text}</p>
            </Link>
          ))}
        </aside>
      </div>
    </main>
  )
}
