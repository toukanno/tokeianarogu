import React, { useState } from 'react'
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar, Dimensions,
} from 'react-native'
import { ClassicClock } from './src/clocks/ClassicClock'
import { ModernClock } from './src/clocks/ModernClock'
import { NeonClock } from './src/clocks/NeonClock'
import { SwissClock } from './src/clocks/SwissClock'
import { SkeletonClock } from './src/clocks/SkeletonClock'
import { ClockSelector, ClockType } from './src/components/ClockSelector'

const BG_COLORS: Record<ClockType, string> = {
  classic: '#2d1600',
  modern: '#0f172a',
  neon: '#0d0221',
  swiss: '#e8e8e0',
  skeleton: '#111111',
}

const IS_DARK: Record<ClockType, boolean> = {
  classic: true,
  modern: true,
  neon: true,
  swiss: false,
  skeleton: true,
}

export default function App() {
  const [selected, setSelected] = useState<ClockType>('classic')
  const { width } = Dimensions.get('window')
  const clockSize = Math.min(width - 48, 340)
  const isDark = IS_DARK[selected]

  const renderClock = () => {
    switch (selected) {
      case 'classic': return <ClassicClock size={clockSize} />
      case 'modern': return <ModernClock size={clockSize} dark />
      case 'neon': return <NeonClock size={clockSize} />
      case 'swiss': return <SwissClock size={clockSize} />
      case 'skeleton': return <SkeletonClock size={clockSize} />
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: BG_COLORS[selected] }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={BG_COLORS[selected]}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.titleJa, { color: isDark ? '#eee' : '#111' }]}>
          時計アナログ
        </Text>
        <Text style={[styles.titleEn, { color: isDark ? '#888' : '#666' }]}>
          ANALOG CLOCK
        </Text>
      </View>

      {/* Clock display */}
      <View style={styles.clockStage}>
        {renderClock()}
      </View>

      {/* Selector */}
      <View style={styles.selectorArea}>
        <ClockSelector
          selected={selected}
          onSelect={setSelected}
          isDark={isDark}
        />
      </View>

      {/* Footer */}
      <Text style={[styles.footer, { color: isDark ? '#444' : '#999' }]}>
        Expo · React Native · iOS & Android
      </Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 8,
    alignItems: 'flex-start',
  },
  titleJa: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 1,
  },
  titleEn: {
    fontSize: 11,
    letterSpacing: 3,
    marginTop: 2,
  },
  clockStage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorArea: {
    paddingBottom: 8,
  },
  footer: {
    textAlign: 'center',
    fontSize: 11,
    letterSpacing: 1,
    paddingVertical: 12,
  },
})
