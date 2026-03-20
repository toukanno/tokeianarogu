import React from 'react'
import { useClock, calcAngles } from '../hooks/useClock'

interface Props {
  size?: number
}

export const NeonClock: React.FC<Props> = ({ size = 320 }) => {
  const time = useClock()
  const { hourDeg, minuteDeg, secondDeg } = calcAngles(time)
  const c = size / 2
  const R = size / 2 - 10

  const pt = (angleDeg: number, r: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return { x: c + r * Math.cos(rad), y: c + r * Math.sin(rad) }
  }

  const neonBlue = '#00f5ff'
  const neonPink = '#ff2d9b'
  const neonGreen = '#39ff14'

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <filter id="neon-blue" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur1" />
          <feGaussianBlur stdDeviation="8" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="neon-pink" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur1" />
          <feGaussianBlur stdDeviation="8" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="neon-green" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur1" />
          <feGaussianBlur stdDeviation="6" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="darkBg" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#0d0221" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>
      </defs>

      {/* Dark background */}
      <circle cx={c} cy={c} r={R} fill="url(#darkBg)" />

      {/* Outer neon ring */}
      <circle
        cx={c} cy={c} r={R}
        fill="none" stroke={neonBlue} strokeWidth={2}
        filter="url(#neon-blue)"
      />

      {/* Hour markers */}
      {Array.from({ length: 12 }, (_, i) => {
        const isMain = i % 3 === 0
        const p1 = pt(i * 30, R - 6)
        const p2 = pt(i * 30, isMain ? R - 22 : R - 14)
        return (
          <line
            key={i}
            x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke={isMain ? neonPink : neonBlue}
            strokeWidth={isMain ? 3 : 1.5}
            filter={isMain ? 'url(#neon-pink)' : 'url(#neon-blue)'}
          />
        )
      })}

      {/* Minute dots */}
      {Array.from({ length: 60 }, (_, i) => {
        if (i % 5 === 0) return null
        const pos = pt(i * 6, R - 10)
        return (
          <circle key={i} cx={pos.x} cy={pos.y} r={1.5}
            fill={neonBlue} opacity={0.5}
          />
        )
      })}

      {/* Hour label digits */}
      {[12, 3, 6, 9].map((num, i) => {
        const pos = pt(i * 90, R - 36)
        return (
          <text
            key={num}
            x={pos.x} y={pos.y}
            textAnchor="middle" dominantBaseline="central"
            fontFamily="'Courier New', monospace"
            fontSize={16} fontWeight="bold"
            fill={neonPink}
            filter="url(#neon-pink)"
          >
            {num}
          </text>
        )
      })}

      {/* Hour hand */}
      {(() => {
        const tip = pt(hourDeg, R * 0.50)
        const tail = pt(hourDeg + 180, R * 0.10)
        return (
          <line
            x1={tail.x} y1={tail.y} x2={tip.x} y2={tip.y}
            stroke={neonBlue} strokeWidth={4} strokeLinecap="round"
            filter="url(#neon-blue)"
          />
        )
      })()}

      {/* Minute hand */}
      {(() => {
        const tip = pt(minuteDeg, R * 0.72)
        const tail = pt(minuteDeg + 180, R * 0.12)
        return (
          <line
            x1={tail.x} y1={tail.y} x2={tip.x} y2={tip.y}
            stroke={neonBlue} strokeWidth={2.5} strokeLinecap="round"
            filter="url(#neon-blue)"
          />
        )
      })()}

      {/* Second hand */}
      {(() => {
        const tip = pt(secondDeg, R * 0.82)
        const tail = pt(secondDeg + 180, R * 0.18)
        return (
          <line
            x1={tail.x} y1={tail.y} x2={tip.x} y2={tip.y}
            stroke={neonGreen} strokeWidth={1.5} strokeLinecap="round"
            filter="url(#neon-green)"
          />
        )
      })()}

      {/* Center */}
      <circle cx={c} cy={c} r={7} fill={neonPink} filter="url(#neon-pink)" />
      <circle cx={c} cy={c} r={3} fill="#fff" />
    </svg>
  )
}
