import type { IconSelector } from '../../types'
import { IconSelect } from './IconSelect'
import { IconLine } from './IconLine'
import { IconRectangle } from './IconRectangle'
import { IconEllipse } from './IconEllipse'
import { IconPan } from './IconPan'

export function Icon({ name, ...props }: IconSelector) {
  switch (name) {
    case 'select':
      return <IconSelect {...props} />
    case 'rectangle':
      return <IconRectangle {...props} />
    case 'line':
      return <IconLine {...props} />

    case 'ellipse':
      return <IconEllipse {...props} />

    case 'pan':
      return <IconPan {...props} />
  }
}

Icon.defaultProps = {
  fill: 'currentColor',
  width: 24,
  height: 24,
}
