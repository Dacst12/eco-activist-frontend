import { MyEvents } from '@/widgets/my-events'

export default function Page() {
  return (
    <>
      <h1 className="text-title font-semibold">История мероприятий</h1>
      <MyEvents section="history" />
    </>
  )
}
