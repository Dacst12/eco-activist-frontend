import axios from 'axios'
import { mocksReady } from '@/shared/lib/mocks-ready'

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

if (process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
  api.interceptors.request.use(async (config) => {
    await mocksReady
    return config
  })
}
