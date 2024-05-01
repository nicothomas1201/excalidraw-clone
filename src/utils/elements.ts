import rough from 'roughjs'
import type { ElementType } from '../types'
import type { Drawable } from 'roughjs/bin/core'

export interface ElementOptions {
  x: number
  y: number
  x2: number
  y2: number
  width: number
  height: number
  type: string
}

export interface Corner {
  slug: string
  x: number
  y: number
}

const generator = rough.generator()

export const createRectangle = (options: ElementOptions): Drawable => {
  const { x, y, width, height } = options
  return generator.rectangle(x, y, width, height, {
    stroke: 'white',
  })
}

export const createEllipse = (options: ElementOptions): Drawable => {
  const { x, y, width, height } = options
  return generator.ellipse(x, y, width, height, {
    stroke: 'white',
  })
}

export const createLine = (options: ElementOptions): Drawable => {
  const { x, y, x2, y2 } = options
  return generator.line(x, y, x2, y2, {
    stroke: 'white',
  })
}

const selectElementTypeGenerator = (
  type: string
): ((options: ElementOptions) => Drawable) => {
  switch (type) {
    case 'rectangle':
      return createRectangle
    case 'line':
      return createLine
    default:
      return createRectangle
  }
}

export const createElement = (
  id: number,
  options: ElementOptions
): ElementType => {
  const generator = selectElementTypeGenerator(options.type)
  const element = generator(options)

  return {
    id,
    x: options.x,
    y: options.y,
    x2: options.x2,
    y2: options.y2,
    width: options.width,
    height: options.height,
    focused: false,
    drawable: {
      ...element,
    },
  }
}

export function getFocuseDemention(element: ElementType, padding: number) {
  const { x, y, x2, y2 } = element

  if (element.drawable.shape == 'line') return { fx: x, fy: y, fw: x2, fh: y2 }

  const p = { min: padding, max: padding * 2 }
  const minX = Math.min(x, x2)
  const maxX = Math.max(x, x2)
  const minY = Math.min(y, y2)
  const maxY = Math.max(y, y2)

  return {
    fx: minX - p.min,
    fy: minY - p.min,
    fw: maxX - minX + p.max,
    fh: maxY - minY + p.max,
  }
}

export function getFocuseCorners(
  element: ElementType,
  padding: number,
  position: number
) {
  const { fx, fy, fw, fh } = getFocuseDemention(element, padding)

  if (element.drawable.shape == 'line') {
    return {
      line: { fx, fy, fw, fh },
      corners: [
        {
          slug: 'l1',
          x: fx - position,
          y: fy - position,
        },
        {
          slug: 'l2',
          x: fw - position,
          y: fh - position,
        },
      ],
    }
  }
  return {
    line: { fx, fy, fw, fh },
    corners: [
      {
        slug: 'tl',
        x: fx - position,
        y: fy - position,
      },
      {
        slug: 'tr',
        x: fx + fw - position,
        y: fy - position,
      },
      {
        slug: 'bl',
        x: fx - position,
        y: fy + fh - position,
      },
      {
        slug: 'br',
        x: fx + fw - position,
        y: fy + fh - position,
      },
      {
        slug: 'tt',
        x: fx + fw / 2 - position,
        y: fy - position,
      },
      {
        slug: 'rr',
        x: fx + fw - position,
        y: fy + fh / 2 - position,
      },
      {
        slug: 'll',
        x: fx - position,
        y: fy + fh / 2 - position,
      },
      {
        slug: 'bb',
        x: fx + fw / 2 - position,
        y: fy + fh - position,
      },
    ],
  }
}

export function getResizeBySlug(
  corner: Corner,
  focusedElement: ElementType,
  clientX: number,
  clientY: number
): ElementType | null {
  switch (corner.slug) {
    case 'rr': {
      const width = focusedElement.width + (clientX - focusedElement.x2)
      const height = focusedElement.height
      return createElement(focusedElement.id, {
        x: focusedElement.x,
        y: focusedElement.y,
        x2: clientX,
        y2: focusedElement.y2,
        width,
        height,
        type: 'rectangle',
      })
    }
    case 'll': {
      const width = focusedElement.width + (focusedElement.x - clientX)
      return createElement(focusedElement.id, {
        x: clientX,
        y: focusedElement.y,
        x2: focusedElement.x2,
        y2: focusedElement.y2,
        width,
        height: focusedElement.height,
        type: 'rectangle',
      })
    }
    case 'tt': {
      const height = focusedElement.height + (focusedElement.y - clientY)
      return createElement(focusedElement.id, {
        x: focusedElement.x,
        y: clientY,
        x2: focusedElement.x2,
        y2: focusedElement.y2,
        width: focusedElement.width,
        height,
        type: 'rectangle',
      })
    }
    case 'bb': {
      const height = focusedElement.height + (clientY - focusedElement.y2)
      return createElement(focusedElement.id, {
        x: focusedElement.x,
        y: focusedElement.y,
        x2: focusedElement.x2,
        y2: clientY,
        width: focusedElement.width,
        height,
        type: 'rectangle',
      })
    }
    case 'l2': {
      return createElement(focusedElement.id, {
        x: focusedElement.x,
        y: focusedElement.y,
        x2: clientX,
        y2: clientY,
        width: focusedElement.width,
        height: focusedElement.height,
        type: 'line',
      })
    }
    case 'l1': {
      return createElement(focusedElement.id, {
        x: clientX,
        y: clientY,
        x2: focusedElement.x2,
        y2: focusedElement.y2,
        width: focusedElement.width,
        height: focusedElement.height,
        type: 'line',
      })
    }
    case 'br': {
      const width = focusedElement.width + (clientX - focusedElement.x2)
      const height = focusedElement.height + (clientY - focusedElement.y2)
      return createElement(focusedElement.id, {
        x: focusedElement.x,
        y: focusedElement.y,
        x2: clientX,
        y2: clientY,
        width,
        height,
        type: 'rectangle',
      })
    }
    case 'tr': {
      const width = focusedElement.width + (clientX - focusedElement.x2)
      const height = focusedElement.height + (focusedElement.y - clientY)
      return createElement(focusedElement.id, {
        x: focusedElement.x,
        y: clientY,
        x2: clientX,
        y2: focusedElement.y2,
        width,
        height,
        type: 'rectangle',
      })
    }
    case 'tl': {
      const width = focusedElement.width + (focusedElement.x - clientX)
      const height = focusedElement.height + (focusedElement.y - clientY)
      return createElement(focusedElement.id, {
        x: clientX,
        y: clientY,
        x2: focusedElement.x2,
        y2: focusedElement.y2,
        width,
        height,
        type: 'rectangle',
      })
    }
    case 'bl': {
      const width = focusedElement.width + (focusedElement.x - clientX)
      const height = focusedElement.height + (clientY - focusedElement.y2)
      return createElement(focusedElement.id, {
        x: clientX,
        y: focusedElement.y,
        x2: focusedElement.x2,
        y2: clientY,
        width,
        height,
        type: 'rectangle',
      })
    }
    default: {
      return null
    }
  }
}

export const drawSelectCorner = (
  context: CanvasRenderingContext2D,
  element: ElementType,
  scale: number,
  padding: number
) => {
  const lineWidth = 1 / scale
  const square = 10 / scale
  let round = square
  const position = square / 2

  const demention = getFocuseCorners(element, padding, position)
  const { fx, fy, fw, fh } = demention.line
  const corners = demention.corners

  context.lineWidth = lineWidth
  context.strokeStyle = 'blue'
  context.fillStyle = '#EEF5FF'

  if (element.drawable.shape != 'line') {
    context.beginPath()
    context.rect(fx, fy, fw, fh)
    context.setLineDash([0, 0])
    context.stroke()
    context.closePath()
    round = 3 / scale
  }

  context.beginPath()
  corners.forEach((corner) => {
    context.roundRect(corner.x, corner.y, square, square, round)
  })
  context.fill()
  context.stroke()
  context.closePath()
}

export const drawElement = (
  element: ElementType,
  canvas: HTMLCanvasElement
  // scale: number = 1,
  // padding: number = 10
) => {
  const rc = rough.canvas(canvas)
  rc.draw(element.drawable)
}

export const inSelectCorner = (
  element: ElementType,
  x: number,
  y: number,
  scale: number,
  padding: number = 10
) => {
  const square = 10 / scale
  const position = square / 2

  const corners = getFocuseCorners(element, padding, position).corners

  const hoveredCorner = corners.find(
    (corner) =>
      x - corner.x <= square &&
      x - corner.x >= 0 &&
      y - corner.y <= square &&
      y - corner.y >= 0
  )

  return hoveredCorner
}
