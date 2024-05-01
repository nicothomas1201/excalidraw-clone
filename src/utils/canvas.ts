import { ElementType } from '@/types'
import { drawElement, drawSelectCorner } from './elements'

interface SelectorType {
  x: number
  y: number
  x2: number
  y2: number
  width: number
  height: number
}

export const getContext = (canvas: HTMLCanvasElement) => {
  return canvas.getContext('2d')
}

export const getScaledValues = (
  width: number,
  height: number,
  scale: number
) => {
  const scaledWidth = width * scale
  const scaledHeight = height * scale
  const scaleOffsetX = (scaledWidth - width) / 2
  const scaleOffsetY = (scaledHeight - height) / 2

  return { scaleOffsetX, scaleOffsetY }
}

export const contextTranslateAndScale = (
  canvas: HTMLCanvasElement,
  scaleOffsetX: number,
  scaleOffsetY: number,
  pan: { x: number; y: number },
  scale: number
) => {
  const context = getContext(canvas)

  context?.translate(pan.x * scale - scaleOffsetX, pan.y * scale - scaleOffsetY)
  context?.scale(scale, scale)
}

export const drawAllElements = (
  canvas: HTMLCanvasElement,
  elements: ElementType[],
  scale: number
) => {
  elements.forEach((element) => {
    const context = getContext(canvas)
    if (element.focused) {
      if (!context) return

      drawSelectCorner(context, element, scale, 10)
    }

    drawElement(element, canvas)
  })
}

export const getElementFocusedIndex = (
  elements: ElementType[],
  selector: SelectorType
): number => {
  return elements.findIndex((el) => {
    if (selector.x === 0 && selector.y === 0) return

    return (
      (selector.x < el.x &&
        selector.x < el.x2 &&
        selector.x2 > el.x &&
        selector.x2 > el.x2) ||
      (selector.x > el.x &&
        selector.x > el.x2 &&
        selector.x2 < el.x &&
        selector.x2 < el.x2)
    )
  })
}

export const updateElementFocus = (
  elements: ElementType[],
  selector: SelectorType
) => {
  const index = getElementFocusedIndex(elements, selector)
  if (index >= 0) elements[index].focused = true
}
export const drawSelectTool = (
  canvas: HTMLCanvasElement,
  elements: ElementType[],
  select: SelectorType
) => {
  const context = getContext(canvas)

  if (!context) return null

  // cuando se dibuja el select tool, se actualiza el focus de los elementos si estan dentro del select
  updateElementFocus(elements, select)

  context.strokeStyle = 'red'
  context.strokeRect(select.x, select.y, select.width, select.height)
}

export const resetFocusedElements = (elements: ElementType[]) => {
  elements.forEach((el) => {
    el.focused = false
  })
}
