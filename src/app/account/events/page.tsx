import { MyEvents } from '@/widgets/my-events'

export default function Page() {
  return (
    <>
      <h1 className="text-title font-semibold">Активные мероприятия</h1>
      <MyEvents section="active" />
    </>
  )
}
