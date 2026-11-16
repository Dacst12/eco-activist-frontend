'use server'

import { revalidatePath } from 'next/cache'

export async function refreshPublicPages(eventId: string) {
  revalidatePath('/')
  revalidatePath(`/events/${eventId}`)
}
