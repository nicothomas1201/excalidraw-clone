import { MouseEvent } from 'react'

export const getMouseCoordinates = (
  event: MouseEvent,
  pan: { x: number; y: number },
  scale: number,
  scaleOffset: { x: number; y: number }
) => {
  const clientX = (event.clientX - pan.x * scale + scaleOffset.x) / scale
  const clientY = (event.clientY - pan.y * scale + scaleOffset.y) / scale

  return { clientX, clientY }
}
