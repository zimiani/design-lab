import { type CSSProperties } from 'react'
import { useReactFlow } from '@xyflow/react'

interface HelperLinesProps {
  horizontal?: number
  vertical?: number
}

const lineStyle: CSSProperties = {
  position: 'absolute',
  pointerEvents: 'none',
  zIndex: 5,
}

/**
 * Renders alignment guide lines on the canvas.
 * Coordinates are in flow-space; we convert to screen-space via the viewport.
 */
export default function HelperLines({ horizontal, vertical }: HelperLinesProps) {
  const { getViewport } = useReactFlow()
  const { x: tx, y: ty, zoom } = getViewport()

  return (
    <>
      {horizontal !== undefined && (
        <div
          style={{
            ...lineStyle,
            left: 0,
            right: 0,
            top: horizontal * zoom + ty,
            height: 1,
            backgroundColor: '#F472B6',
            opacity: 0.7,
          }}
        />
      )}
      {vertical !== undefined && (
        <div
          style={{
            ...lineStyle,
            top: 0,
            bottom: 0,
            left: vertical * zoom + tx,
            width: 1,
            backgroundColor: '#F472B6',
            opacity: 0.7,
          }}
        />
      )}
    </>
  )
}
