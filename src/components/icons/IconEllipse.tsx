import { IconType } from '../../types'

export function IconEllipse({ fill, width, height }: IconType) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={fill}
      strokeWidth="2"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g strokeWidth="1.5">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <circle cx="12" cy="12" r="9"></circle>
      </g>
    </svg>
  )
}
