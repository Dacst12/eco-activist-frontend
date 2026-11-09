import { api } from '@/shared/api'
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '../model/types'

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  register: (data: RegisterRequest) =>
    api.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  logout: () => api.post<void>('/auth/logout'),

  me: () => api.get<User>('/auth/me').then((r) => r.data),
}
