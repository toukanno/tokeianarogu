import React from 'react'
import Svg, {
  Circle, Line, Text, Defs, RadialGradient, Stop
} from 'react-native-svg'
import { useClock, calcAngles } from '../hooks/useClock'

interface Props {
  size?: number
}

// Note: SVG filters (glow effects) have limited support in React Native.
// We simulate the neon glow by drawing multiple strokes with increasing opacity/width.
export const NeonClock: React.FC<Props> = ({ size = 300 }) => {
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

  // Helper: draw a glowing line (3 layers)
  const GlowLine = ({
    x1, y1, x2, y2, color, width,
  }: { x1: number; y1: number; x2: number; y2: number; color: string; width: number }) => (
    <>
      <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width * 4} strokeOpacity={0.1} strokeLinecap="round" />
      <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width * 2} strokeOpacity={0.3} strokeLinecap="round" />
      <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeOpacity={1} strokeLinecap="round" />
    </>
  )

  const GlowCircle = ({
    cx, cy, r, color, sw,
  }: { cx: number; cy: number; r: number; color: string; sw: number }) => (
    <>
      <Circle cx={cx} cy={cy} r={r + sw * 2} fill="none" stroke={color} strokeWidth={sw} strokeOpacity={0.1} />
      <Circle cx={cx} cy={cy} r={r + sw} fill="none" stroke={color} strokeWidth={sw} strokeOpacity={0.3} />
      <Circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeOpacity={1} />
    </>
  )

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <RadialGradient id="darkBg" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#0d0221" />
          <Stop offset="100%" stopColor="#000000" />
        </RadialGradient>
      </Defs>

      <Circle cx={c} cy={c} r={R} fill="url(#darkBg)" />

      {/* Outer neon ring */}
      <GlowCircle cx={c} cy={c} r={R} color={neonBlue} sw={2} />

      {/* Hour markers */}
      {Array.from({ length: 12 }, (_, i) => {
        const isMain = i % 3 === 0
        const p1 = pt(i * 30, R - 6)
        const p2 = pt(i * 30, isMain ? R - 22 : R - 14)
        const color = isMain ? neonPink : neonBlue
        return (
          <GlowLine
            key={i}
            x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            color={color} width={isMain ? 3 : 1.5}
          />
        )
      })}

      {/* Minute dots */}
      {Array.from({ length: 60 }, (_, i) => {
        if (i % 5 === 0) return null
        const pos = pt(i * 6, R - 10)
        return (
          <Circle key={i} cx={pos.x} cy={pos.y} r={1.5} fill={neonBlue} fillOpacity={0.5} />
        )
      })}

      {/* Labels */}
      {[12, 3, 6, 9].map((num, i) => {
        const pos = pt(i * 90, R - 36)
        return (
          <Text
            key={num}
            x={pos.x} y={pos.y}
            textAnchor="middle" alignmentBaseline="central"
            fontFamily="monospace"
            fontSize={16} fontWeight="bold"
            fill={neonPink}
          >
            {num}
          </Text>
        )
      })}

      {/* Hour hand */}
      {(() => {
        const tip = pt(hourDeg, R * 0.50)
        const tail = pt(hourDeg + 180, R * 0.10)
        return <GlowLine x1={tail.x} y1={tail.y} x2={tip.x} y2={tip.y} color={neonBlue} width={4} />
      })()}

      {/* Minute hand */}
      {(() => {
        const tip = pt(minuteDeg, R * 0.72)
        const tail = pt(minuteDeg + 180, R * 0.12)
        return <GlowLine x1={tail.x} y1={tail.y} x2={tip.x} y2={tip.y} color={neonBlue} width={2.5} />
      })()}

      {/* Second hand */}
      {(() => {
        const tip = pt(secondDeg, R * 0.82)
        const tail = pt(secondDeg + 180, R * 0.18)
        return <GlowLine x1={tail.x} y1={tail.y} x2={tip.x} y2={tip.y} color={neonGreen} width={1.5} />
      })()}

      {/* Center */}
      <Circle cx={c} cy={c} r={10} fill={neonPink} fillOpacity={0.3} />
      <Circle cx={c} cy={c} r={6} fill={neonPink} />
      <Circle cx={c} cy={c} r={3} fill="#fff" />
    </Svg>
  )
}
