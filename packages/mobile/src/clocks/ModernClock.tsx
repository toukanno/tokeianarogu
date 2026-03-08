import React from 'react'
import Svg, { Circle, Line, Defs, Filter, FeGaussianBlur, FeMerge, FeMergeNode } from 'react-native-svg'
import { useClock, calcAngles } from '../hooks/useClock'

interface Props {
  size?: number
  dark?: boolean
}

export const ModernClock: React.FC<Props> = ({ size = 300, dark = true }) => {
  const time = useClock()
  const { hourDeg, minuteDeg, secondDeg } = calcAngles(time)
  const c = size / 2
  const R = size / 2 - 10

  const pt = (angleDeg: number, r: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return { x: c + r * Math.cos(rad), y: c + r * Math.sin(rad) }
  }

  const bg = dark ? '#111827' : '#f9fafb'
  const fg = dark ? '#f3f4f6' : '#111827'
  const accent = '#6366f1'
  const secondColor = '#f43f5e'

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={c} cy={c} r={R} fill={bg} />
      <Circle cx={c} cy={c} r={R} fill="none" stroke={accent} strokeWidth={2} strokeOpacity={0.4} />

      {/* Hour dots */}
      {Array.from({ length: 12 }, (_, i) => {
        const pos = pt(i * 30, R - 16)
        const isMain = i % 3 === 0
        return (
          <Circle
            key={i}
            cx={pos.x} cy={pos.y}
            r={isMain ? 5 : 3}
            fill={isMain ? accent : fg}
            fillOpacity={isMain ? 1 : 0.4}
          />
        )
      })}

      {/* Minute ticks */}
      {Array.from({ length: 60 }, (_, i) => {
        if (i % 5 === 0) return null
        const p1 = pt(i * 6, R - 8)
        const p2 = pt(i * 6, R - 14)
        return (
          <Line
            key={i}
            x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke={fg} strokeWidth={1} strokeOpacity={0.3}
          />
        )
      })}

      {/* Hour hand */}
      {(() => {
        const tip = pt(hourDeg, R * 0.50)
        const tail = pt(hourDeg + 180, R * 0.10)
        return (
          <Line
            x1={tail.x} y1={tail.y} x2={tip.x} y2={tip.y}
            stroke={fg} strokeWidth={6} strokeLinecap="round"
          />
        )
      })()}

      {/* Minute hand */}
      {(() => {
        const tip = pt(minuteDeg, R * 0.72)
        const tail = pt(minuteDeg + 180, R * 0.10)
        return (
          <Line
            x1={tail.x} y1={tail.y} x2={tip.x} y2={tip.y}
            stroke={fg} strokeWidth={3} strokeLinecap="round"
          />
        )
      })()}

      {/* Second hand */}
      {(() => {
        const tip = pt(secondDeg, R * 0.80)
        const tail = pt(secondDeg + 180, R * 0.20)
        return (
          <Line
            x1={tail.x} y1={tail.y} x2={tip.x} y2={tip.y}
            stroke={secondColor} strokeWidth={1.5} strokeLinecap="round"
          />
        )
      })()}

      <Circle cx={c} cy={c} r={6} fill={fg} />
      <Circle cx={c} cy={c} r={3} fill={secondColor} />
    </Svg>
  )
}
