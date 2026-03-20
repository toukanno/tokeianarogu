import React from 'react'
import { useClock, calcAngles } from '../hooks/useClock'

interface Props {
  size?: number
}

// Skeleton / Mechanical watch style
export const SkeletonClock: React.FC<Props> = ({ size = 320 }) => {
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
  const darkSilver = '#808080'

  // Gear teeth path around a circle
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

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <filter id="metal-shadow">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.5" />
        </filter>
        <radialGradient id="goldGrad" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#f0d060" />
          <stop offset="60%" stopColor={gold} />
          <stop offset="100%" stopColor={darkGold} />
        </radialGradient>
        <radialGradient id="silverGrad" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#e8e8e8" />
          <stop offset="60%" stopColor={silver} />
          <stop offset="100%" stopColor={darkSilver} />
        </radialGradient>
        <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#1a1a1a" strokeWidth="1" opacity="0.3" />
        </pattern>
      </defs>

      {/* Background plate */}
      <circle cx={c} cy={c} r={R} fill="#1c1c1c" />
      <circle cx={c} cy={c} r={R} fill="url(#hatch)" />

      {/* Outer ring gear */}
      <path
        d={gearPath(c, c, R - 4, R + 2, 48)}
        fill={gold} stroke={darkGold} strokeWidth={0.5}
        filter="url(#metal-shadow)"
      />
      <circle cx={c} cy={c} r={R - 4} fill="none" stroke={gold} strokeWidth={2} />

      {/* Hour markers - small gears look */}
      {Array.from({ length: 12 }, (_, i) => {
        const isMain = i % 3 === 0
        const pos = pt(i * 30, R - 22)
        if (isMain) {
          return (
            <g key={i}>
              <path
                d={gearPath(pos.x, pos.y, 6, 9, 8)}
                fill={gold} stroke={darkGold} strokeWidth={0.5}
              />
              <circle cx={pos.x} cy={pos.y} r={4} fill="#1c1c1c" />
              <circle cx={pos.x} cy={pos.y} r={2} fill={gold} />
            </g>
          )
        }
        return (
          <circle key={i} cx={pos.x} cy={pos.y} r={3}
            fill={silver} stroke={darkSilver} strokeWidth={0.5}
          />
        )
      })}

      {/* Decorative inner ring */}
      <circle cx={c} cy={c} r={R - 40} fill="none"
        stroke={gold} strokeWidth={1} strokeDasharray="4 4"
      />

      {/* Hour hand - ornate */}
      {(() => {
        const angle = ((hourDeg - 90) * Math.PI) / 180
        const len = R * 0.46
        const w = 7
        const cos = Math.cos(angle), sin = Math.sin(angle)
        const perp = { x: -sin * w, y: cos * w }
        const mid = { x: c + cos * len * 0.5, y: c + sin * len * 0.5 }
        return (
          <g filter="url(#metal-shadow)">
            <polygon
              points={`
                ${c + cos * len},${c + sin * len}
                ${mid.x + perp.x},${mid.y + perp.y}
                ${c - cos * R * 0.08},${c - sin * R * 0.08}
                ${mid.x - perp.x},${mid.y - perp.y}
              `}
              fill="url(#goldGrad)" stroke={darkGold} strokeWidth={0.5}
            />
          </g>
        )
      })()}

      {/* Minute hand */}
      {(() => {
        const angle = ((minuteDeg - 90) * Math.PI) / 180
        const len = R * 0.68
        const w = 4
        const cos = Math.cos(angle), sin = Math.sin(angle)
        const perp = { x: -sin * w, y: cos * w }
        const mid = { x: c + cos * len * 0.5, y: c + sin * len * 0.5 }
        return (
          <g filter="url(#metal-shadow)">
            <polygon
              points={`
                ${c + cos * len},${c + sin * len}
                ${mid.x + perp.x},${mid.y + perp.y}
                ${c - cos * R * 0.08},${c - sin * R * 0.08}
                ${mid.x - perp.x},${mid.y - perp.y}
              `}
              fill="url(#silverGrad)" stroke={darkSilver} strokeWidth={0.5}
            />
          </g>
        )
      })()}

      {/* Second hand - skeleton style */}
      {(() => {
        const tip = pt(secondDeg, R * 0.76)
        const tail = pt(secondDeg + 180, R * 0.22)
        const ballPos = pt(secondDeg, R * 0.55)
        return (
          <>
            <line
              x1={tail.x} y1={tail.y} x2={tip.x} y2={tip.y}
              stroke="#e55" strokeWidth={1.5} strokeLinecap="round"
            />
            <circle cx={ballPos.x} cy={ballPos.y} r={5}
              fill="#e55" stroke="#900" strokeWidth={1}
            />
          </>
        )
      })()}

      {/* Center mechanism */}
      <path
        d={gearPath(c, c, 10, 15, 10)}
        fill={gold} stroke={darkGold} strokeWidth={0.5}
      />
      <circle cx={c} cy={c} r={8} fill="#1c1c1c" stroke={gold} strokeWidth={1} />
      <circle cx={c} cy={c} r={4} fill={gold} />
      <circle cx={c} cy={c} r={2} fill="#1c1c1c" />
    </svg>
  )
}
