import { useRef } from 'react'
import { useCameraStream } from '../model/useCameraStream'
import { useQrDecoder } from '../model/useQrDecoder'
import { ScanResultCard } from './ScanResultCard'

export function QrCamera({
  onCode,
}: {
  onCode: (code: string, frame: ImageData) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)

  const decoder = useQrDecoder(videoRef, frameRef, onCode)
  const cameraError = useCameraStream(videoRef, decoder === 'reading')

  const error =
    cameraError ||
    (decoder === 'error' &&
      'Не удалось прочитать изображение. Используйте ручную отметку.')

  if (error) {
    return (
      <ScanResultCard
        alert
        tone="warning"
        title={cameraError ? 'Камера недоступна' : 'Ошибка считывания'}
        message={error}
      />
    )
  }

  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden">
      <video
        ref={videoRef}
        muted
        playsInline
        aria-label="Камера для сканирования QR"
        className="absolute inset-0 size-full object-cover"
      />

      <div
        ref={frameRef}
        aria-hidden="true"
        className="relative aspect-square w-[min(72vw,48dvh,22rem)] shadow-[0_0_0_100vmax_rgb(0_0_0/0.5)]"
      >
        {[
          'left-0 top-0 border-l-4 border-t-4 rounded-tl-lg',
          'right-0 top-0 border-r-4 border-t-4 rounded-tr-lg',
          'left-0 bottom-0 border-l-4 border-b-4 rounded-bl-lg',
          'right-0 bottom-0 border-r-4 border-b-4 rounded-br-lg',
        ].map((corner) => (
          <span
            key={corner}
            className={`absolute size-7 border-white ${corner}`}
          />
        ))}
      </div>

      <p className="absolute inset-x-0 bottom-1 text-center text-sm text-white">
        Поместите QR-код в рамку
      </p>
    </div>
  )
}
