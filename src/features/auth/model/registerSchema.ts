import { z } from 'zod'
import {
  loginField,
  newPasswordField,
  requiredString,
} from '@/shared/lib/validation'

export const registerSchema = z
  .object({
    name: requiredString('Введите имя').max(
      100,
      'Имя должно быть не длиннее 100 символов'
    ),
    login: loginField,
    password: newPasswordField,
    passwordConfirm: z.string().min(1, 'Повторите пароль'),
    consent: z
      .boolean()
      .refine(
        (value) => value,
        'Без согласия на обработку данных зарегистрироваться нельзя'
      ),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    error: 'Пароли не совпадают',
    path: ['passwordConfirm'],
  })
