import type { BadgeTone } from '@/shared/ui'

type Props = {
  title: string
  message?: string
  tone: BadgeTone
  alert?: boolean
}

const accent: Record<BadgeTone, string> = {
  success: 'border-emerald-400',
  neutral: 'border-slate-400',
  warning: 'border-amber-400',
  danger: 'border-red-400',
}

export function ScanResultCard({ title, message, tone, alert }: Props) {
  return (
    <div className="max-h-[45%] shrink-0 overflow-y-auto px-4 py-3">
      <div
        role={alert ? 'alert' : 'status'}
        className={`mx-auto max-w-lg space-y-1 rounded-r-lg border-l-4 bg-white/10 px-4 py-3 text-left text-white ${accent[tone]}`}
      >
        <p className="text-lg font-semibold">{title}</p>

        {message && (
          <p className="text-sm leading-relaxed text-white/80">{message}</p>
        )}
      </div>
    </div>
  )
}
