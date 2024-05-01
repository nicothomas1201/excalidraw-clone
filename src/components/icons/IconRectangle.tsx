import { IconType } from '../../types'

export function IconRectangle({ fill, width, height }: IconType) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 24 24"
      fill={fill}
      width={width}
      height={height}
      strokeWidth="2"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g strokeWidth="1.5">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <rect x="4" y="4" width="16" height="16" rx="2"></rect>
      </g>
    </svg>
  )
}
