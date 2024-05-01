import { useEffect } from 'react'
import { useToolsStore } from '../store/toolsStore'

type ActionsKeyBoard = {
  [key: string]: string
  Digit1: string
  Digit2: string
  Digit3: string
  Digit4: string
}

const ACTIONS_KEYBOARD_MAP: ActionsKeyBoard = {
  Digit1: 'pan',
  Digit2: 'select',
  Digit3: 'rectangle',
  Digit4: 'line',
}

export const useCurrentTool = () => {
  const [currentTool, setCurrentTool] = useToolsStore((state) => [
    state.currentTool,
    state.setCurrentTool,
  ])

  const handleKeyDown = (event: KeyboardEvent) => {
    const action = ACTIONS_KEYBOARD_MAP[event.code]

    if (action) {
      setCurrentTool(action)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return { currentTool, setCurrentTool }
}
