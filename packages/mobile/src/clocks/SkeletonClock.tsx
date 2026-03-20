import React from 'react'
import Svg, {
  Circle, Line, Polygon, Path, Defs, RadialGradient, Stop, Pattern, G
} from 'react-native-svg'
import { useClock, calcAngles } from '../hooks/useClock'

interface Props {
  size?: number
}

const gearPath = (cx: number, cy: number, innerR: number, outerR: number, teeth: number) => {
  const step = (2 * Math.PI) / (teeth * 2)
  let d = ''
  for (let i = 0; i < teeth * 2; i++) {
    const angle = i * step
    const r = i % 2 === 0 ? outerR : innerR
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
  }
  return d + ' Z'
}

export const SkeletonClock: React.FC<Props> = ({ size = 300 }) => {
  const time = useClock()
  const { hourDeg, minuteDeg, secondDeg } = calcAngles(time)
  const c = size / 2
  const R = size / 2 - 10

  const pt = (angleDeg: number, r: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return { x: c + r * Math.cos(rad), y: c + r * Math.sin(rad) }
  }

  const gold = '#c9a84c'
  const darkGold = '#8b6914'
  const silver = '#c0c0c0'

  const ornateHand = (deg: number, len: number, w: number, color: string) => {
    const angle = ((deg - 90) * Math.PI) / 180
    const cos = Math.cos(angle), sin = Math.sin(angle)
    const perp = { x: -sin * w, y: cos * w }
    const mid = { x: c + cos * len * 0.5, y: c + sin * len * 0.5 }
    const tail = R * 0.08
    return [
      `${c + cos * len},${c + sin * len}`,
      `${mid.x + perp.x},${mid.y + perp.y}`,
      `${c - cos * tail},${c - sin * tail}`,
      `${mid.x - perp.x},${mid.y - perp.y}`,
    ].join(' ')
  }

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <RadialGradient id="goldGrad" cx="40%" cy="35%" r="60%">
          <Stop offset="0%" stopColor="#f0d060" />
          <Stop offset="100%" stopColor={darkGold} />
        </RadialGradient>
      </Defs>

      {/* Background */}
      <Circle cx={c} cy={c} r={R} fill="#1c1c1c" />

      {/* Outer gear ring */}
      <Path d={gearPath(c, c, R - 4, R + 2, 48)} fill={gold} />
      <Circle cx={c} cy={c} r={R - 4} fill="none" stroke={gold} strokeWidth={2} />

      {/* Inner decoration ring */}
      <Circle cx={c} cy={c} r={R - 40} fill="none" stroke={gold} strokeWidth={1} strokeDasharray="4 4" />

      {/* Hour gear markers */}
      {Array.from({ length: 12 }, (_, i) => {
        const isMain = i % 3 === 0
        const pos = pt(i * 30, R - 22)
        if (isMain) {
          return (
            <G key={i}>
              <Path d={gearPath(pos.x, pos.y, 6, 9, 8)} fill={gold} />
              <Circle cx={pos.x} cy={pos.y} r={4} fill="#1c1c1c" />
              <Circle cx={pos.x} cy={pos.y} r={2} fill={gold} />
            </G>
          )
        }
        return (
          <Circle key={i} cx={pos.x} cy={pos.y} r={3}
            fill={silver} stroke="#808080" strokeWidth={0.5}
          />
        )
      })}

      {/* Hour hand */}
      <Polygon points={ornateHand(hourDeg, R * 0.46, 7, gold)} fill="url(#goldGrad)" />

      {/* Minute hand */}
      <Polygon points={ornateHand(minuteDeg, R * 0.68, 4, silver)} fill={silver} />

      {/* Second hand */}
      {(() => {
        const tip = pt(secondDeg, R * 0.76)
        const tail = pt(secondDeg + 180, R * 0.22)
        const ball = pt(secondDeg, R * 0.55)
        return (
          <>
            <Line
              x1={tail.x} y1={tail.y} x2={tip.x} y2={tip.y}
              stroke="#e55" strokeWidth={1.5} strokeLinecap="round"
            />
            <Circle cx={ball.x} cy={ball.y} r={5} fill="#e55" stroke="#900" strokeWidth={1} />
          </>
        )
      })()}

      {/* Center gear */}
      <Path d={gearPath(c, c, 10, 15, 10)} fill={gold} />
      <Circle cx={c} cy={c} r={8} fill="#1c1c1c" stroke={gold} strokeWidth={1} />
      <Circle cx={c} cy={c} r={4} fill={gold} />
      <Circle cx={c} cy={c} r={2} fill="#1c1c1c" />
    </Svg>
  )
}
