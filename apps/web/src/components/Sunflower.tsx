/** 单朵向日葵 SVG — 复用,无 id 冲突 */
export default function Sunflower({
  size = 90,
  color = '#ffb84d',
  centerColor = '#7a4a1f',
  stem = true,
}: {
  size?: number
  color?: string
  centerColor?: string
  stem?: boolean
}) {
  const petals = Array.from({ length: 12 }, (_, i) => i * 30)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(50 50)">
        {petals.map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-30"
            rx="10"
            ry="20"
            fill={color}
            transform={`rotate(${deg})`}
          />
        ))}
        <circle cx="0" cy="0" r="14" fill={centerColor} />
        <circle cx="-3" cy="-3" r="2" fill="#5a3a1c" />
        <circle cx="4" cy="-2" r="2" fill="#5a3a1c" />
        <circle cx="-2" cy="4" r="2" fill="#5a3a1c" />
      </g>
      {stem && (
        <>
          <rect x="48" y="50" width="4" height="40" fill="#4f8a25" />
          <ellipse
            cx="38"
            cy="72"
            rx="10"
            ry="5"
            fill="#79b34d"
            transform="rotate(-30 38 72)"
          />
        </>
      )}
    </svg>
  )
}