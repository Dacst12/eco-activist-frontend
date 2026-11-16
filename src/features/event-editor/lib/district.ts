import type { DictionaryItem } from '@/entities/dictionary'

const normalize = (name: string) =>
  name
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/район|р-н/g, '')
    .trim()

export function findDistrictId(
  areas: string[] | undefined,
  districts: DictionaryItem[]
) {
  const targets = (areas ?? []).map(normalize)
  return (
    districts.find((district) => targets.includes(normalize(district.name)))
      ?.id ?? ''
  )
}
