import React from 'react'
import { useClock, calcAngles } from '../hooks/useClock'

interface Props {
  size?: number
}

// Swiss Railway Clock (SBB-inspired design)
export const SwissClock: React.FC<Props> = ({ size = 320 }) => {
  const time = useClock()
  const { hourDeg, minuteDeg, secondDeg } = calcAngles(time)
  const c = size / 2
  const R = size / 2 - 10

  const pt = (angleDeg: number, r: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return { x: c + r * Math.cos(rad), y: c + r * Math.sin(rad) }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <filter id="swiss-shadow">
          <feDropShadow dx="1" dy="2" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* White face */}
      <circle cx={c} cy={c} r={R} fill="#ffffff" filter="url(#swiss-shadow)" />
      <circle cx={c} cy={c} r={R} fill="none" stroke="#222" strokeWidth={3} />

      {/* Hour markers - thick rectangles */}
      {Array.from({ length: 12 }, (_, i) => {
        const isMain = i % 3 === 0
        const outerR = R - 6
        const innerR = isMain ? R - 28 : R - 18
        const p1 = pt(i * 30, outerR)
        const p2 = pt(i * 30, innerR)
        return (
          <line
            key={i}
            x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke="#222" strokeWidth={isMain ? 8 : 4}
            strokeLinecap="square"
          />
        )
      })}

      {/* Minute markers */}
      {Array.from({ length: 60 }, (_, i) => {
        if (i % 5 === 0) return null
        const p1 = pt(i * 6, R - 6)
        const p2 = pt(i * 6, R - 14)
        return (
          <line
            key={i}
            x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke="#222" strokeWidth={2} strokeLinecap="square"
          />
        )
      })}

      {/* Hour numerals (4 main positions) */}
      {[
        { num: '12', deg: 0 },
        { num: '3', deg: 90 },
        { num: '6', deg: 180 },
        { num: '9', deg: 270 },
      ].map(({ num, deg }) => {
        const pos = pt(deg, R - 46)
        return (
          <text
            key={num}
            x={pos.x} y={pos.y}
            textAnchor="middle" dominantBaseline="central"
            fontFamily="'Helvetica Neue', Arial, sans-serif"
            fontSize={22} fontWeight="700"
            fill="#111"
          >
            {num}
          </text>
        )
      })}

      {/* Hour hand - Swiss style (wide paddle) */}
      {(() => {
        const angle = ((hourDeg - 90) * Math.PI) / 180
        const len = R * 0.52
        const w = 9
        const cos = Math.cos(angle), sin = Math.sin(angle)
        const perpX = -sin * w, perpY = cos * w
        const tailLen = R * 0.1
        return (
          <polygon
            points={[
              `${c + cos * len},${c + sin * len}`,
              `${c + perpX - cos * tailLen},${c + perpY - sin * tailLen}`,
              `${c - cos * tailLen},${c - sin * tailLen}`,
              `${c - perpX - cos * tailLen},${c - perpY - sin * tailLen}`,
            ].join(' ')}
            fill="#111" stroke="none"
          />
        )
      })()}

      {/* Minute hand - Swiss style */}
      {(() => {
        const angle = ((minuteDeg - 90) * Math.PI) / 180
        const len = R * 0.78
        const w = 5
        const cos = Math.cos(angle), sin = Math.sin(angle)
        const perpX = -sin * w, perpY = cos * w
        const tailLen = R * 0.1
        return (
          <polygon
            points={[
              `${c + cos * len},${c + sin * len}`,
              `${c + perpX - cos * tailLen},${c + perpY - sin * tailLen}`,
              `${c - cos * tailLen},${c - sin * tailLen}`,
              `${c - perpX - cos * tailLen},${c - perpY - sin * tailLen}`,
            ].join(' ')}
            fill="#111" stroke="none"
          />
        )
      })()}

      {/* Second hand - Swiss style (red with circle) */}
      {(() => {
        const tip = pt(secondDeg, R * 0.82)
        const tail = pt(secondDeg + 180, R * 0.22)
        const circlePos = pt(secondDeg + 180, R * 0.30)
        return (
          <>
            <line
              x1={tail.x} y1={tail.y} x2={tip.x} y2={tip.y}
              stroke="#e30613" strokeWidth={2} strokeLinecap="round"
            />
            <circle cx={circlePos.x} cy={circlePos.y} r={9}
              fill="#e30613"
            />
          </>
        )
      })()}

      {/* Center boss */}
      <circle cx={c} cy={c} r={7} fill="#111" />
      <circle cx={c} cy={c} r={4} fill="#e30613" />
    </svg>
  )
}
