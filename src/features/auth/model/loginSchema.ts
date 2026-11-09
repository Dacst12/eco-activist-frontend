import { z } from 'zod'
import { loginField } from '@/shared/lib/validation'

export const loginSchema = z.object({
  login: loginField,
  password: z.string().min(1, 'Введите пароль'),
})
