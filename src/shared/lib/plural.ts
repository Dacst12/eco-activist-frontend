const rules = new Intl.PluralRules('ru-RU')

export const plural = (
  count: number,
  [one, few, many]: [string, string, string]
) => {
  const form = rules.select(count)
  return form === 'one' ? one : form === 'few' ? few : many
}
