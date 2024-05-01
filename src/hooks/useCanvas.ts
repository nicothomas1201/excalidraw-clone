import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  WheelEvent,
  type MouseEvent,
} from 'react'
import type { ElementType } from '../types'
import {
  contextTranslateAndScale,
  Corner,
  createElement,
  drawAllElements,
  drawSelectTool,
  getContext,
  getElementFocusedIndex,
  getMouseCoordinates,
  getResizeBySlug,
  getScaledValues,
  inSelectCorner,
  resetFocusedElements,
} from '../utils'
import { useCurrentTool } from './useCurrentTool'

interface SelectType {
  x: number
  y: number
  x2: number
  y2: number
  width: number
  height: number
}

export function useCanvas() {
  const canvas = useRef<HTMLCanvasElement>(null!)

  const { currentTool, setCurrentTool } = useCurrentTool()

  const [elements, setElements] = useState<ElementType[]>([])
  const [scale, setScale] = useState<number>(1)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 })
  const [selector, setSelector] = useState<SelectType>({
    x: 0,
    y: 0,
    x2: 0,
    y2: 0,
    height: 0,
    width: 0,
  })
  const [focusedElement, setFocusedElement] = useState<ElementType>(null!)
  const [action, setAction] = useState<string>('')
  const [isClicked, setIsClicked] = useState<boolean>(false)
  const [corner, setCurrentCorner] = useState<Corner>(null!)

  const initialPositionX = useRef<number>(0)
  const initialPositionY = useRef<number>(0)

  const setupCanvas = () => {
    const { width, height } = canvas.current
    const context = getContext(canvas.current)

    context?.clearRect(0, 0, width, height)
    context?.save()

    const { scaleOffsetX, scaleOffsetY } = getScaledValues(width, height, scale)
    setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY })

    contextTranslateAndScale(
      canvas.current,
      scaleOffsetX,
      scaleOffsetY,
      pan,
      scale
    )

    if (action === 'select') {
      drawSelectTool(canvas.current, elements, selector)
      const focusIndex = getElementFocusedIndex(elements, selector)

      if (focusIndex >= 0) {
        setFocusedElement(elements[focusIndex])
      }
    }

    if (action === 'draw') {
      resetFocusedElements(elements)
    }

    drawAllElements(canvas.current, elements, scale)

    context?.restore()
  }

  useLayoutEffect(() => {
    setupCanvas()
  }, [elements, scale, pan, selector])

  // Dependiendo de la tool se crear una accion diferente
  useEffect(() => {
    switch (currentTool) {
      case 'pan':
        setAction('pan')
        break
      case 'select':
        setAction('select')
        break

      default:
        setAction('draw')
    }
  }, [currentTool])

  // Se setea la posición inicial del mouse y si se va a dibujar se crean los elementos
  const handleMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    setIsClicked(true)
    const { clientX, clientY } = getMouseCoordinates(
      event,
      pan,
      scale,
      scaleOffset
    )

    const x = clientX
    const y = clientY

    initialPositionX.current = x
    initialPositionY.current = y

    if (focusedElement && action === 'select') {
      const corner = inSelectCorner(focusedElement, x, y, scale)

      // aqui va como es cuando es una linea
      if (focusedElement.drawable.shape === 'line') {
        const m =
          (focusedElement.y2 - focusedElement.y) /
          (focusedElement.x2 - focusedElement.x)
        const b = focusedElement.y - m * focusedElement.x
        const expectedY = m * x + b

        if (
          (clientX > focusedElement.x && clientX < focusedElement.x2) ||
          (clientX < focusedElement.x && clientX > focusedElement.x2)
        ) {
          if (Math.abs(y - expectedY) < 5) {
            setAction('move')
          }
        }
      }

      //  este es cuando es de tipo cuadrado
      if (focusedElement.drawable.shape === 'rectangle') {
        if (clientX > focusedElement.x && clientX < focusedElement.x2) {
          if (clientY > focusedElement.y && clientY < focusedElement.y2) {
            setAction('move')
          }
        }
      }

      if (corner) {
        setAction('resize')
        setCurrentCorner(corner)
        return
      }
    }

    if (event.altKey) {
      setCurrentTool('pan')
      return
    }

    if (action === 'draw') {
      const element = createElement(elements.length, {
        x: initialPositionX.current,
        y: initialPositionY.current,
        x2: x,
        y2: y,
        width: 0,
        height: 0,
        type: currentTool,
      })
      setElements((prev) => [...prev, element])
    }
  }

  const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!isClicked) return

    const { clientX, clientY } = getMouseCoordinates(
      event,
      pan,
      scale,
      scaleOffset
    )

    const id = elements.length - 1
    const width = clientX - initialPositionX.current
    const height = clientY - initialPositionY.current
    const elementsCopy = [...elements]

    if (action === 'pan') {
      const deltaX = event.clientX - initialPositionX.current
      const deltaY = event.clientY - initialPositionY.current
      setPan({
        x: deltaX,
        y: deltaY,
      })
      return
    }

    if (action === 'select') {
      const selector = {
        x: initialPositionX.current,
        y: initialPositionY.current,
        x2: clientX,
        y2: clientY,
        width,
        height,
      }

      setSelector(selector)

      return
    }

    if (action === 'resize' && corner) {
      const element = getResizeBySlug(corner, focusedElement, clientX, clientY)

      if (!element) return

      elementsCopy[focusedElement.id] = element

      setElements(elementsCopy)
      return
    }

    if (action === 'move' && focusedElement) {
      const x = clientX - focusedElement.width / 2
      const y = clientY - focusedElement.height / 2
      elementsCopy[focusedElement.id] = createElement(focusedElement.id, {
        ...focusedElement,
        x,
        y,
        x2: x + focusedElement.width,
        y2: y + focusedElement.height,
        type: focusedElement.drawable.shape,
      })
      setElements(elementsCopy)
    }

    if (action === 'draw') {
      elementsCopy[id] = createElement(id, {
        x: initialPositionX.current,
        y: initialPositionY.current,
        x2: clientX,
        y2: clientY,
        width,
        height,
        type: currentTool,
      })
      setElements(elementsCopy)
    }
  }

  const handleMouseUp = () => {
    setIsClicked(false)

    if (action !== 'select') {
      setFocusedElement(null!)
    }

    if (action === 'pan') {
      setCurrentTool('select')
    }

    if (action === 'move') {
      setAction('select')
    }

    if (action === 'resize') {
      setAction('select')
    }

    if (action === 'draw') {
      setCurrentTool('select')
    }

    if (action === 'select') {
      setSelector({
        x: 0,
        y: 0,
        x2: 0,
        y2: 0,
        width: 0,
        height: 0,
      })
    }
  }

  const handleWheel = (event: WheelEvent) => {
    const zoom = event.deltaY * -0.001
    setScale((prevState) => Math.min(Math.max(prevState + zoom, 0.1), 20))
  }

  return {
    canvas,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
  }
}
