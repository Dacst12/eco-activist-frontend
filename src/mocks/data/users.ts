import type { User } from '@/entities/user'
export const MOCK_PASSWORD = 'password123'

export const users: User[] = [
  {
    id: 'u1',
    name: 'Алексей',
    login: 'volunteer@example.ru',
    role: 'volunteer',
  },
  {
    id: 'u2',
    name: 'Зелёный город',
    login: 'organizer@example.ru',
    role: 'organizer',
    organizerStatus: 'approved',
  },
  {
    id: 'u3',
    name: 'Новый организатор',
    login: 'pending@example.ru',
    role: 'organizer',
    organizerStatus: 'pending',
  },
  { id: 'u4', name: 'Администратор', login: 'admin@example.ru', role: 'admin' },
  { id: 'u5', name: 'Мария', login: '+79001234567', role: 'volunteer' },
]
