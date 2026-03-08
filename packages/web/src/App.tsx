import React, { useState } from 'react'
import { ClassicClock } from './clocks/ClassicClock'
import { ModernClock } from './clocks/ModernClock'
import { NeonClock } from './clocks/NeonClock'
import { SwissClock } from './clocks/SwissClock'
import { SkeletonClock } from './clocks/SkeletonClock'
import './App.css'

type ClockType = 'classic' | 'modern' | 'neon' | 'swiss' | 'skeleton'

const CLOCKS: { id: ClockType; label: string; labelJa: string; bg: string }[] = [
  { id: 'classic', label: 'Classic', labelJa: 'クラシック', bg: '#2d1600' },
  { id: 'modern', label: 'Modern', labelJa: 'モダン', bg: '#0f172a' },
  { id: 'neon', label: 'Neon', labelJa: 'ネオン', bg: '#0d0221' },
  { id: 'swiss', label: 'Swiss', labelJa: 'スイス', bg: '#e8e8e0' },
  { id: 'skeleton', label: 'Skeleton', labelJa: 'スケルトン', bg: '#111' },
]

function App() {
  const [selected, setSelected] = useState<ClockType>('classic')
  const current = CLOCKS.find(c => c.id === selected)!

  const renderClock = () => {
    const size = Math.min(window.innerWidth * 0.85, 360)
    switch (selected) {
      case 'classic': return <ClassicClock size={size} />
      case 'modern': return <ModernClock size={size} dark />
      case 'neon': return <NeonClock size={size} />
      case 'swiss': return <SwissClock size={size} />
      case 'skeleton': return <SkeletonClock size={size} />
    }
  }

  const isLight = selected === 'swiss'

  return (
    <div className="app" style={{ background: current.bg }}>
      <header className="header" style={{ borderBottomColor: isLight ? '#ccc' : '#333' }}>
        <h1 style={{ color: isLight ? '#111' : '#eee' }}>
          <span className="title-ja">時計アナログ</span>
          <span className="title-en">Analog Clock</span>
        </h1>
      </header>

      <main className="main">
        <div className="clock-stage">
          {renderClock()}
        </div>

        <nav className="clock-nav">
          {CLOCKS.map(clock => (
            <button
              key={clock.id}
              className={`nav-btn ${selected === clock.id ? 'active' : ''}`}
              onClick={() => setSelected(clock.id)}
              data-theme={clock.id}
            >
              <span className="nav-label-ja">{clock.labelJa}</span>
              <span className="nav-label-en">{clock.label}</span>
            </button>
          ))}
        </nav>
      </main>

      <footer className="footer" style={{ color: isLight ? '#666' : '#555' }}>
        React + Vite &nbsp;|&nbsp; Web / Desktop / Android / iOS
      </footer>
    </div>
  )
}

export default App
