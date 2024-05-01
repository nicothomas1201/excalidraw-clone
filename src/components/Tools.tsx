import { MouseEvent, useEffect, useRef } from 'react'
import '../App.css'
import { Icon } from './icons'
import { useCurrentTool } from '../hooks/useCurrentTool'

export function Tools() {
  const container = useRef<HTMLDivElement>(null!)
  const { currentTool, setCurrentTool } = useCurrentTool()

  const removeActiveClass = () => {
    const allActiveButtons = container.current.querySelectorAll('.active')

    if (allActiveButtons.length > 0) {
      allActiveButtons.forEach((button) => button.classList.remove('active'))
    }
  }

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    removeActiveClass()

    const button = event.currentTarget

    if (!button.classList.contains('active')) {
      button.classList.add('active')
      setCurrentTool(button.id)
    }
  }

  useEffect(() => {
    const button = container.current.querySelector(`#${currentTool}`)

    if (button) {
      removeActiveClass()
      button.classList.add('active')
    }
  }, [currentTool])

  return (
    <div ref={container} className="tools-container">
      <button id="pan" onClick={handleClick}>
        <Icon name="pan" />
      </button>
      <button id="select" onClick={handleClick}>
        <Icon name="select" />
      </button>
      <button id="rectangle" onClick={handleClick}>
        <Icon name="rectangle" />
      </button>
      <button id="line" onClick={handleClick}>
        <Icon name="line" fill="white" />
      </button>
    </div>
  )
}
