import type { Route } from 'next'
import Link from 'next/link'
import { buttonClass } from '@/shared/ui'

type EventMessageProps = {
  title: string
  text?: string
  link: { href: Route; label: string }
}

export function EventMessage({ title, text, link }: EventMessageProps) {
  return (
    <section className="mx-auto max-w-md py-16 text-center">
      <h1 className="text-title font-semibold">{title}</h1>
      {text && <p className="text-muted mt-2">{text}</p>}
      <div className="mt-6">
        <Link href={link.href} className={buttonClass('primary')}>
          {link.label}
        </Link>
      </div>
    </section>
  )
}
