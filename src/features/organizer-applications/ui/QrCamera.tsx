import { useEffect, useRef, useState } from 'react'

export function QrCamera({ onCode }: { onCode: (code: string) => void }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const video = ref.current
    if (!video) return

    let disposed = false
    let stream: MediaStream | undefined
    let timer: number | undefined

    function stop() {
      window.clearTimeout(timer)
      stream?.getTracks().forEach((track) => track.stop())
      if (video && video.srcObject === stream) video.srcObject = null
    }

    async function start(video: HTMLVideoElement) {
      try {
        const { default: decode } = await import('jsqr')
        if (disposed) return

        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('camera_unavailable')
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        })

        if (disposed) {
          stop()
          return
        }

        video.srcObject = stream
        await video.play()

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) throw new Error('canvas_unavailable')

        function read() {
          if (disposed || !ctx) return

          if (video.readyState >= 2 && video.videoWidth && video.videoHeight) {
            const scale = Math.min(
              1,
              720 / Math.max(video.videoWidth, video.videoHeight)
            )

            canvas.width = Math.max(1, Math.round(video.videoWidth * scale))
            canvas.height = Math.max(1, Math.round(video.videoHeight * scale))
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

            const frame = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const code = decode(frame.data, frame.width, frame.height)

            if (code) {
              stop()
              onCode(code.data)
              return
            }
          }

          timer = window.setTimeout(read, 160)
        }

        read()
      } catch {
        stop()
        if (!disposed) {
          setError(
            'Камера недоступна. Проверьте разрешение или отметьте участника вручную.'
          )
        }
      }
    }

    void start(video)

    return () => {
      disposed = true
      stop()
    }
  }, [onCode])

  if (error) return <p role="alert">{error}</p>

  return (
    <div className="space-y-2">
      <p>Наведите камеру на QR-код волонтёра.</p>
      <video
        ref={ref}
        muted
        playsInline
        aria-label="Камера для сканирования QR"
        className="rounded-control aspect-video w-full max-w-lg bg-black object-contain"
      />
    </div>
  )
}
