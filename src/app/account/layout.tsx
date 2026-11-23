import { RequireRole } from '@/features/auth'
import { AccountNav } from '@/widgets/account-nav'

export default function AccountLayout({ children }: LayoutProps<'/account'>) {
  return (
    <RequireRole roles={['volunteer']}>
      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
        <AccountNav />
        {children}
      </main>
    </RequireRole>
  )
}
