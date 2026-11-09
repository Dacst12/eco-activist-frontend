import axios, { type AxiosInstance } from 'axios'
import { mocksReady } from '@/shared/lib/mocks-ready'
import { getAccessToken, setAccessToken } from './token'

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean
  }
}

const createClient = () => {
  const client = axios.create({
    baseURL: '/api',
    withCredentials: true,
  })

  if (process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
    client.interceptors.request.use(async (config) => {
      await mocksReady
      return config
    })
  }
  return client
}

export const api: AxiosInstance = createClient()

const refreshClient = createClient()

let refreshPromise: Promise<string | null> | null = null

export const refreshAccessToken = () => {
  refreshPromise ??= refreshClient
    .post<{ accessToken: string }>('/auth/refresh')
    .then((response) => response.data.accessToken)
    .catch(() => null)
    .then((token) => {
      setAccessToken(token)
      return token
    })
    .finally(() => {
      refreshPromise = null
    })
  return refreshPromise
}

let unauthorizedHandler: (() => void) | null = null

export const onUnauthorized = (handler: () => void) => {
  unauthorizedHandler = handler
  return () => {
    if (unauthorizedHandler === handler) unauthorizedHandler = null
  }
}

const NO_REFRESH_URLS = ['/auth/login', '/auth/register', '/auth/refresh']

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.set('Authorization', `Bearer ${token}`)
  return config
})

api.interceptors.response.use(undefined, async (error) => {
  const config = axios.isAxiosError(error) ? error.config : undefined
  const canRefresh =
    axios.isAxiosError(error) &&
    error.response?.status === 401 &&
    config &&
    !config._retry &&
    !NO_REFRESH_URLS.some((url) => config.url?.startsWith(url))

  if (!canRefresh || !config) throw error

  config._retry = true
  const token = await refreshAccessToken()

  if (!token) {
    unauthorizedHandler?.()
    throw error
  }

  config.headers.set('Authorization', `Bearer ${token}`)
  return api(config)
})
