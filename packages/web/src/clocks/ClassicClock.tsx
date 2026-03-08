import React from 'react'
import { useClock, calcAngles } from '../hooks/useClock'

interface Props {
  size?: number
}

const ROMAN = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI']

export const ClassicClock: React.FC<Props> = ({ size = 320 }) => {
  const time = useClock()
  const { hourDeg, minuteDeg, secondDeg } = calcAngles(time)
  const c = size / 2
  const R = size / 2 - 8

  const pt = (angleDeg: number, r: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return { x: c + r * Math.cos(rad), y: c + r * Math.sin(rad) }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id="woodGrad" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#d4956a" />
          <stop offset="100%" stopColor="#7b3f00" />
        </radialGradient>
        <radialGradient id="faceGrad" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#fffdf5" />
          <stop offset="100%" stopColor="#f0e6c8" />
        </radialGradient>
        <filter id="shadow">
          <feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Outer bezel */}
      <circle cx={c} cy={c} r={R} fill="url(#woodGrad)" filter="url(#shadow)" />
      <circle cx={c} cy={c} r={R - 6} fill="#5c2c00" />
      <circle cx={c} cy={c} r={R - 10} fill="url(#faceGrad)" />

      {/* Minute tick marks */}
      {Array.from({ length: 60 }, (_, i) => {
        const isHour = i % 5 === 0
        const outerR = R - 12
        const innerR = isHour ? R - 24 : R - 18
        const p1 = pt(i * 6, outerR)
        const p2 = pt(i * 6, innerR)
        return (
          <line
            key={i}
            x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke={isHour ? '#5c2c00' : '#a08060'}
            strokeWidth={isHour ? 2.5 : 1}
          />
        )
      })}

      {/* Roman numerals */}
      {ROMAN.map((label, i) => {
        const pos = pt(i * 30, R - 38)
        const isMain = i === 0 || i === 3 || i === 6 || i === 9
        return (
          <text
            key={i}
            x={pos.x} y={pos.y}
            textAnchor="middle" dominantBaseline="central"
            fontFamily="'Times New Roman', serif"
            fontSize={isMain ? 18 : 13}
            fontWeight="bold"
            fill="#3d1c00"
          >
            {label}
          </text>
        )
      })}

      {/* Hour hand */}
      {(() => {
        const tip = pt(hourDeg, R * 0.48)
        const tail = pt(hourDeg + 180, R * 0.12)
        return (
          <line
            x1={tail.x} y1={tail.y} x2={tip.x} y2={tip.y}
            stroke="#2a1200" strokeWidth={8} strokeLinecap="round"
          />
        )
      })()}

      {/* Minute hand */}
      {(() => {
        const tip = pt(minuteDeg, R * 0.68)
        const tail = pt(minuteDeg + 180, R * 0.1)
        return (
          <line
            x1={tail.x} y1={tail.y} x2={tip.x} y2={tip.y}
            stroke="#2a1200" strokeWidth={5} strokeLinecap="round"
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
            stroke="#cc2200" strokeWidth={2} strokeLinecap="round"
          />
        )
      })()}

      {/* Center cap */}
      <circle cx={c} cy={c} r={8} fill="#2a1200" />
      <circle cx={c} cy={c} r={4} fill="#cc2200" />
    </svg>
  )
}
