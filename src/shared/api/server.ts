import 'server-only'

type ServerFetchOptions = {
  revalidate?: number | false
}

export class ServerApiError extends Error {
  constructor(public status: number) {
    super(`Ошибка запроса к API (${status})`)
  }
}

export async function serverApi<T>(
  path: string,
  { revalidate = 60 }: ServerFetchOptions = {}
) {
  const res = await fetch(`${process.env.API_URL}${path}`, {
    next: { revalidate },
  })
  if (!res.ok) throw new ServerApiError(res.status)
  return (await res.json()) as T
}
