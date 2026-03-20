import React from 'react'
import Svg, { Circle, Line, Polygon, Text } from 'react-native-svg'
import { useClock, calcAngles } from '../hooks/useClock'

interface Props {
  size?: number
}

export const SwissClock: React.FC<Props> = ({ size = 300 }) => {
  const time = useClock()
  const { hourDeg, minuteDeg, secondDeg } = calcAngles(time)
  const c = size / 2
  const R = size / 2 - 10

  const pt = (angleDeg: number, r: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return { x: c + r * Math.cos(rad), y: c + r * Math.sin(rad) }
  }

  const paddleHand = (deg: number, len: number, w: number) => {
    const angle = ((deg - 90) * Math.PI) / 180
    const cos = Math.cos(angle), sin = Math.sin(angle)
    const perp = { x: -sin * w, y: cos * w }
    const tail = R * 0.1
    return [
      `${c + cos * len},${c + sin * len}`,
      `${c + perp.x - cos * tail},${c + perp.y - sin * tail}`,
      `${c - cos * tail},${c - sin * tail}`,
      `${c - perp.x - cos * tail},${c - perp.y - sin * tail}`,
    ].join(' ')
  }

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={c} cy={c} r={R} fill="#ffffff" />
      <Circle cx={c} cy={c} r={R} fill="none" stroke="#222" strokeWidth={3} />

      {/* Hour markers */}
      {Array.from({ length: 12 }, (_, i) => {
        const isMain = i % 3 === 0
        const p1 = pt(i * 30, R - 6)
        const p2 = pt(i * 30, isMain ? R - 28 : R - 18)
        return (
          <Line
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
          <Line
            key={i}
            x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke="#222" strokeWidth={2} strokeLinecap="square"
          />
        )
      })}

      {/* Numerals */}
      {[
        { num: '12', deg: 0 },
        { num: '3', deg: 90 },
        { num: '6', deg: 180 },
        { num: '9', deg: 270 },
      ].map(({ num, deg }) => {
        const pos = pt(deg, R - 46)
        return (
          <Text
            key={num}
            x={pos.x} y={pos.y}
            textAnchor="middle" alignmentBaseline="central"
            fontFamily="sans-serif" fontSize={22} fontWeight="700" fill="#111"
          >
            {num}
          </Text>
        )
      })}

      {/* Hour hand */}
      <Polygon
        points={paddleHand(hourDeg, R * 0.52, 9)}
        fill="#111"
      />

      {/* Minute hand */}
      <Polygon
        points={paddleHand(minuteDeg, R * 0.78, 5)}
        fill="#111"
      />

      {/* Second hand */}
      {(() => {
        const tip = pt(secondDeg, R * 0.82)
        const tail = pt(secondDeg + 180, R * 0.22)
        const ballPos = pt(secondDeg + 180, R * 0.30)
        return (
          <>
            <Line
              x1={tail.x} y1={tail.y} x2={tip.x} y2={tip.y}
              stroke="#e30613" strokeWidth={2} strokeLinecap="round"
            />
            <Circle cx={ballPos.x} cy={ballPos.y} r={9} fill="#e30613" />
          </>
        )
      })()}

      <Circle cx={c} cy={c} r={7} fill="#111" />
      <Circle cx={c} cy={c} r={4} fill="#e30613" />
    </Svg>
  )
}
