import { IconType } from '../../types'

export function IconLine({ fill, width, height }: IconType) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 20 20"
      fill="none"
      width={width}
      height={height}
      stroke={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.167 10h11.666" strokeWidth="1.5"></path>
    </svg>
  )
}
