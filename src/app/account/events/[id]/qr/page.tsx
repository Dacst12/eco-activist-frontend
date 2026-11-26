import { VolunteerQrCard } from '@/widgets/volunteer-qr'

export default async function Page({
  params,
}: PageProps<'/account/events/[id]/qr'>) {
  const { id } = await params

  return (
    <>
      <h1 className="text-title font-semibold">Ваш QR-код</h1>
      <VolunteerQrCard key={id} eventId={id} />
    </>
  )
}
