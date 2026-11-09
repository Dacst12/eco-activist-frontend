export type UserRole = 'volunteer' | 'organizer' | 'admin'
export type OrganizerStatus = 'pending' | 'approved' | 'rejected'

export type User = {
  id: string
  name: string
  login: string
  role: UserRole
  organizerStatus?: OrganizerStatus
}

export type AuthResponse = {
  accessToken: string
  user: User
}

export type LoginRequest = {
  login: string
  password: string
}

export type RegisterRequest = {
  name: string
  login: string
  password: string
  role: Exclude<UserRole, 'admin'>
  consent: true
}
