import React from 'react'
import { useClock, calcAngles } from '../hooks/useClock'

interface Props {
  size?: number
  dark?: boolean
}

export const ModernClock: React.FC<Props> = ({ size = 320, dark = true }) => {
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
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <filter id="glow-modern">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Face */}
      <circle cx={c} cy={c} r={R} fill={bg} />
      <circle cx={c} cy={c} r={R} fill="none" stroke={accent} strokeWidth={2} opacity={0.4} />

      {/* Hour dots */}
      {Array.from({ length: 12 }, (_, i) => {
        const pos = pt(i * 30, R - 16)
        const isMain = i % 3 === 0
        return (
          <circle
            key={i}
            cx={pos.x} cy={pos.y}
            r={isMain ? 5 : 3}
            fill={isMain ? accent : fg}
            opacity={isMain ? 1 : 0.4}
          />
        )
      })}

      {/* Minute ticks */}
      {Array.from({ length: 60 }, (_, i) => {
        if (i % 5 === 0) return null
        const p1 = pt(i * 6, R - 8)
        const p2 = pt(i * 6, R - 14)
        return (
          <line
            key={i}
            x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke={fg} strokeWidth={1} opacity={0.3}
          />
        )
      })}

      {/* Hour hand */}
      {(() => {
        const tip = pt(hourDeg, R * 0.50)
        const tail = pt(hourDeg + 180, R * 0.10)
        return (
          <line
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
          <line
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
          <line
            x1={tail.x} y1={tail.y} x2={tip.x} y2={tip.y}
            stroke={secondColor} strokeWidth={1.5} strokeLinecap="round"
            filter="url(#glow-modern)"
          />
        )
      })()}

      {/* Center */}
      <circle cx={c} cy={c} r={6} fill={fg} />
      <circle cx={c} cy={c} r={3} fill={secondColor} />
    </svg>
  )
}
