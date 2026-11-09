export const replaceSearchParam = (key: string, value: string | null) => {
  const url = new URL(window.location.href)
  if (value) url.searchParams.set(key, value)
  else url.searchParams.delete(key)
  window.history.replaceState(null, '', url)
}
