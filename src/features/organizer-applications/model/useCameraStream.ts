import { useEffect, useState, type RefObject } from 'react'

export function useCameraStream(
  ref: RefObject<HTMLVideoElement | null>,
  enabled: boolean
) {
  const [error, setError] = useState('')

  useEffect(() => {
    const video = ref.current
    if (!enabled || !video) return

    let disposed = false
    let stream: MediaStream | undefined

    function stop() {
      stream?.getTracks().forEach((track) => track.stop())

      if (video && video.srcObject === stream) {
        video.srcObject = null
      }

      stream = undefined
    }

    async function start(element: HTMLVideoElement) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        })

        if (disposed) {
          stop()
          return
        }

        element.srcObject = stream
        await element.play()
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
  }, [enabled, ref])

  return error
}
