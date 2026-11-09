import { cn } from '@/shared/lib/cn'

type FormErrorProps = { message?: string; className?: string }

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null
  return (
    <div
      role="alert"
      className={cn(
        'bg-danger-soft text-danger-text rounded-control px-4 py-3 text-sm',
        className
      )}
    >
      {message}
    </div>
  )
}
