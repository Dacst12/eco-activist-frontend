export type SearchParams = Record<string, string | string[] | undefined>

export const toQueryString = (params: Record<string, string | undefined>) => {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value) query.set(key, value)
  }
  return query.toString()
}
