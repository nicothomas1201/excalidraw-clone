import { useCanvas } from '@/hooks/useCanvas'

export function Canvas() {
  const {
    canvas,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleWheel,
  } = useCanvas()

  return (
    <canvas
      id="canvas"
      ref={canvas}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    />
  )
}
