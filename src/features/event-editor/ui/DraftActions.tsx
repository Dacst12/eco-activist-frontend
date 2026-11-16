import { buttonClass } from '@/shared/ui'

export function DraftActions({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <>
      <button
        type="submit"
        name="intent"
        value="draft"
        disabled={isSubmitting}
        className={buttonClass('secondary')}
      >
        Сохранить черновик
      </button>
      <button
        type="submit"
        name="intent"
        value="preview"
        disabled={isSubmitting}
        className={buttonClass('primary')}
      >
        Предпросмотр
      </button>
    </>
  )
}
