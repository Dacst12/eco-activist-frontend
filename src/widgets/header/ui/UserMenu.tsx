'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import { roleLabel, type User } from '@/entities/user'
import { useLogout } from '@/features/auth'
import { getUserLinks } from '../lib/userLinks'

export function UserMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const logout = useLogout()
  const links = getUserLinks(user)

  // Пока меню открыто, слушаем нажатия мимо него и Esc
  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={menuId}
        className="hover:bg-page rounded-control flex items-center gap-2 px-2 py-1.5"
      >
        <span
          aria-hidden
          className="bg-primary flex size-8 items-center justify-center rounded-full text-sm font-semibold text-white"
        >
          {user.name.charAt(0).toUpperCase()}
        </span>
        <span className="hidden max-w-40 truncate font-medium sm:block">
          {user.name}
        </span>
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className="text-muted size-4"
          fill="currentColor"
        >
          <path
            d="M5.5 7.5 10 12l4.5-4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </button>

      {open && (
        <div
          id={menuId}
          className="bg-surface border-line rounded-card absolute top-full right-0 z-20 mt-2 w-64 border p-2 shadow-md"
        >
          <div className="border-line border-b px-3 pt-1 pb-3">
            <p className="truncate font-semibold">{user.name}</p>
            <p className="text-muted text-sm">{roleLabel[user.role]}</p>
          </div>

          <ul className="py-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="hover:bg-page rounded-control block px-3 py-2"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-line border-t pt-1">
            <button
              type="button"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="text-danger hover:bg-page rounded-control w-full px-3 py-2 text-left disabled:opacity-60"
            >
              Выйти
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
