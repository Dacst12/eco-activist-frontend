import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'danger'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
  secondary: 'bg-surface text-primary hover:bg-success-soft',
  danger: 'bg-danger text-primary-foreground hover:bg-danger-hover',
}

export const buttonClass = (
  variant: ButtonVariant = 'primary',
  className?: string
) =>
  cn(
    'rounded-control inline-flex h-12 items-center justify-center px-6 font-medium transition-colors',
    'disabled:bg-disabled disabled:text-disabled-foreground disabled:pointer-events-none',
    variants[variant],
    className
  )

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

export function Button({
  variant,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClass(variant, className)}
      {...props}
    />
  )
}
