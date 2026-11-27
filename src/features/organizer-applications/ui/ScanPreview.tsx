import { useLayoutEffect, useRef } from 'react'
import styles from './ScanPreview.module.css'

type Props = {
  frame: ImageData
  phase: 'pending' | 'success' | 'error'
}

export function ScanPreview({ frame, phase }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useLayoutEffect(() => {
    canvas.current?.getContext('2d')?.putImageData(frame, 0, 0)
  }, [frame])

  return (
    <div className={styles.stage} data-phase={phase} aria-hidden="true">
      <div className={styles.crop}>
        <canvas ref={canvas} width={frame.width} height={frame.height} />
      </div>

      <svg className={styles.indicator} viewBox="0 0 64 64" fill="none">
        <circle className={styles.disc} cx="32" cy="32" r="29" />

        <g className={styles.rotor}>
          <circle
            className={styles.ring}
            cx="32"
            cy="32"
            r="28"
            pathLength="100"
          />
        </g>

        {phase !== 'pending' && (
          <path
            className={styles.mark}
            pathLength="1"
            d={
              phase === 'success'
                ? 'M18 32l9 9 19-20'
                : 'M22 22l20 20 M42 22L22 42'
            }
          />
        )}
      </svg>
    </div>
  )
}
