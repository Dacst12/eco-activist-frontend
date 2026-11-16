import { RequireRole } from '@/features/auth'

export default function VolunteerEventsLayout({
  children,
}: LayoutProps<'/account/events'>) {
  return <RequireRole roles={['volunteer']}>{children}</RequireRole>
}
