import { isAxiosError } from 'axios'

export type ProblemDetails = {
  title?: string
  detail?: string
  status?: number
  errors?: Record<string, string[]>
}

export const isUnauthorized = (error: unknown) =>
  isAxiosError(error) && error.response?.status === 401

export const getProblem = (error: unknown): ProblemDetails | null => {
  if (!isAxiosError(error)) return null
  const data: unknown = error.response?.data
  return data && typeof data === 'object' ? (data as ProblemDetails) : null
}

export const getErrorMessage = (error: unknown) => {
  const problem = getProblem(error)
  if (problem?.detail || problem?.title) return problem.detail ?? problem.title!
  if (isAxiosError(error) && !error.response)
    return 'Нет связи с сервером. Проверьте интернет'
  return 'Что-то пошло не так. Попробуйте ещё раз'
}
