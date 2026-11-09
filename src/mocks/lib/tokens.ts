const ACCESS_TTL_MS = 60 * 1000

export const REFRESH_COOKIE = 'refreshToken'

export const createAccessToken = (userId: string) =>
  `mock-access.${userId}.${Date.now() + ACCESS_TTL_MS}`

export const readAccessToken = (header: string | null) => {
  const token = header?.replace(/^Bearer /, '')
  const [prefix, userId, expiresAt] = token?.split('.') ?? []
  if (prefix !== 'mock-access' || !userId || Number(expiresAt) < Date.now())
    return null
  return userId
}

export const createRefreshToken = (userId: string) => `mock-refresh.${userId}`

export const readRefreshToken = (token: string | undefined) => {
  const [prefix, userId] = token?.split('.') ?? []
  return prefix === 'mock-refresh' && userId ? userId : null
}

export const setRefreshCookie = (userId: string) =>
  `${REFRESH_COOKIE}=${createRefreshToken(userId)}; Path=/; SameSite=Lax`

export const clearRefreshCookie = () => `${REFRESH_COOKIE}=; Path=/; Max-Age=0`
