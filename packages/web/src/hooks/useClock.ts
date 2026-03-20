import { useState, useEffect } from 'react'

export interface ClockTime {
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

export function useClock(): ClockTime {
  const getTime = (): ClockTime => {
    const now = new Date()
    return {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
      milliseconds: now.getMilliseconds(),
    }
  }

  const [time, setTime] = useState<ClockTime>(getTime)

  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 50)
    return () => clearInterval(id)
  }, [])

  return time
}

export function calcAngles(time: ClockTime) {
  const { hours, minutes, seconds, milliseconds } = time
  const s = seconds + milliseconds / 1000
  const m = minutes + s / 60
  const h = (hours % 12) + m / 60
  return {
    hourDeg: h * 30,        // 360/12
    minuteDeg: m * 6,       // 360/60
    secondDeg: s * 6,       // 360/60
  }
}
