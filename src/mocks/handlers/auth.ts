import { http, HttpResponse } from 'msw'
import type { LoginRequest, RegisterRequest, User } from '@/entities/user'
import { MOCK_PASSWORD, users } from '../data/users'
import {
  clearRefreshCookie,
  createAccessToken,
  readAccessToken,
  readRefreshToken,
  REFRESH_COOKIE,
  setRefreshCookie,
} from '../lib/tokens'

const normalize = (login: string) => login.trim().toLowerCase()
const findByLogin = (login: string) =>
  users.find((u) => normalize(u.login) === normalize(login))

const authResponse = (user: User, status = 200) =>
  HttpResponse.json(
    { accessToken: createAccessToken(user.id), user },
    { status, headers: { 'Set-Cookie': setRefreshCookie(user.id) } }
  )

export const authHandlers = [
  http.post('*/api/auth/login', async ({ request }) => {
    const { login, password } = (await request.json()) as LoginRequest
    const user = findByLogin(login)

    if (!user || password !== MOCK_PASSWORD) {
      return HttpResponse.json(
        { title: 'Неверный логин или пароль', status: 401 },
        { status: 401 }
      )
    }
    return authResponse(user)
  }),

  http.post('*/api/auth/register', async ({ request }) => {
    const data = (await request.json()) as RegisterRequest

    if (findByLogin(data.login)) {
      return HttpResponse.json(
        {
          title: 'Ошибка валидации',
          status: 409,
          errors: {
            login: ['Пользователь с таким email или телефоном уже есть'],
          },
        },
        { status: 409 }
      )
    }

    const user: User = {
      id: `u${users.length + 1}`,
      name: data.name,
      login: data.login,
      role: data.role,
      ...(data.role === 'organizer' && { organizerStatus: 'pending' as const }),
    }
    users.push(user)
    return authResponse(user, 201)
  }),

  http.post('*/api/auth/refresh', ({ cookies }) => {
    const userId = readRefreshToken(cookies[REFRESH_COOKIE])
    const user = users.find((u) => u.id === userId)

    if (!user) return new HttpResponse(null, { status: 401 })
    return HttpResponse.json(
      { accessToken: createAccessToken(user.id) },
      { headers: { 'Set-Cookie': setRefreshCookie(user.id) } }
    )
  }),

  http.post(
    '*/api/auth/logout',
    () =>
      new HttpResponse(null, {
        status: 204,
        headers: { 'Set-Cookie': clearRefreshCookie() },
      })
  ),

  http.get('*/api/auth/me', ({ request }) => {
    const userId = readAccessToken(request.headers.get('Authorization'))
    const user = users.find((u) => u.id === userId)
    return user
      ? HttpResponse.json(user)
      : new HttpResponse(null, { status: 401 })
  }),
]
