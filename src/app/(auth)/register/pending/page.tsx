import type { Metadata } from 'next'
import { getSafeNext, OrganizerPending } from '@/features/auth'

export const metadata: Metadata = { title: 'Заявка отправлена — Эко Активист' }

export default async function OrganizerPendingPage({
  searchParams,
}: PageProps<'/register/pending'>) {
  const next = getSafeNext((await searchParams).next)

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <section className="bg-surface rounded-card max-w-2xl p-6 sm:p-8">
        <OrganizerPending next={next} />
      </section>
    </main>
  )
}
