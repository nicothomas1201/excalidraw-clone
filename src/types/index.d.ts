export * from './icons'
import type { Drawable } from 'roughjs/bin/core'

export interface ElementType {
  id: number
  x: number
  y: number
  x2: number
  y2: number
  width: number
  height: number
  focused: boolean
  drawable: Drawable
}
