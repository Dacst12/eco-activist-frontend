import { RequireRole } from '@/features/auth'

export default function OrganizerLayout({
  children,
}: LayoutProps<'/organizer'>) {
  return <RequireRole roles={['organizer']}>{children}</RequireRole>
}
