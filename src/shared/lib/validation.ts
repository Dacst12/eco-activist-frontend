import { z } from 'zod'

const PHONE_REGEX = /^(\+7|8)\d{10}$/

const stripPhone = (value: string) => value.replace(/[\s()-]/g, '')

export const isPhone = (value: string) => PHONE_REGEX.test(stripPhone(value))

const isEmail = (value: string) => z.email().safeParse(value).success

export const loginField = z
  .string()
  .trim()
  .min(1, 'Введите email или телефон')
  .refine(
    (value) => isEmail(value) || isPhone(value),
    'Введите email или телефон в формате +7XXXXXXXXXX'
  )
  .transform((value) =>
    isPhone(value) ? stripPhone(value).replace(/^8/, '+7') : value.toLowerCase()
  )

export const newPasswordField = z
  .string()
  .min(8, 'Пароль должен быть не короче 8 символов')
  .max(128, 'Пароль должен быть не длиннее 128 символов')

export const requiredString = (message: string) =>
  z.string().trim().min(1, message)
