import { useEffect, useState, type RefObject } from 'react'

export function useQrDecoder(
  videoRef: RefObject<HTMLVideoElement | null>,
  frameRef: RefObject<HTMLDivElement | null>,
  onCode: (code: string) => void
) {
  const [state, setState] = useState<'reading' | 'done' | 'error'>('reading')

  useEffect(() => {
    let disposed = false
    let timer: number | undefined

    async function start() {
      try {
        const { default: decode } = await import('jsqr')
        if (disposed) return

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) throw new Error('canvas_unavailable')

        function read() {
          const video = videoRef.current
          const width = frameRef.current?.getBoundingClientRect().width

          if (disposed || !video || !ctx) return

          try {
            if (
              width &&
              video.readyState >= 2 &&
              video.videoWidth &&
              video.videoHeight
            ) {
              const scale = Math.max(
                video.clientWidth / video.videoWidth,
                video.clientHeight / video.videoHeight
              )
              const side = width / scale
              const size = Math.min(720, Math.max(1, Math.round(side)))

              if (canvas.width !== size || canvas.height !== size) {
                canvas.width = size
                canvas.height = size
              }

              ctx.drawImage(
                video,
                (video.videoWidth - side) / 2,
                (video.videoHeight - side) / 2,
                side,
                side,
                0,
                0,
                size,
                size
              )

              const frame = ctx.getImageData(0, 0, size, size)
              const code = decode(frame.data, size, size)

              if (code) {
                setState('done')
                onCode(code.data)
                return
              }
            }

            timer = window.setTimeout(read, 160)
          } catch {
            setState('error')
          }
        }

        read()
      } catch {
        if (!disposed) setState('error')
      }
    }

    void start()

    return () => {
      disposed = true
      window.clearTimeout(timer)
    }
  }, [videoRef, frameRef, onCode])

  return state
}
