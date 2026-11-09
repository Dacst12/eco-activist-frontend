import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { getErrorMessage, getProblem } from '@/shared/api'

export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly Path<T>[]
) {
  const problem = getProblem(error)
  let hasFieldErrors = false

  for (const [key, messages] of Object.entries(problem?.errors ?? {})) {
    const field = (key.charAt(0).toLowerCase() + key.slice(1)) as Path<T>
    if (fields.includes(field) && messages[0]) {
      setError(field, { message: messages[0] })
      hasFieldErrors = true
    }
  }

  if (!hasFieldErrors)
    setError('root.server', { message: getErrorMessage(error) })
}
