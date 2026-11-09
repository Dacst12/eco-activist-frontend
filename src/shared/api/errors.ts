import { isAxiosError } from 'axios'

export const isUnauthorized = (error: unknown) =>
  isAxiosError(error) && error.response?.status === 401
