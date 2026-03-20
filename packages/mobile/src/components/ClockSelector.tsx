import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native'

export type ClockType = 'classic' | 'modern' | 'neon' | 'swiss' | 'skeleton'

interface ClockOption {
  id: ClockType
  labelJa: string
  label: string
  activeColor: string
  textColor: string
}

const OPTIONS: ClockOption[] = [
  { id: 'classic', labelJa: 'クラシック', label: 'Classic', activeColor: '#a0522d', textColor: '#fff' },
  { id: 'modern', labelJa: 'モダン', label: 'Modern', activeColor: '#6366f1', textColor: '#fff' },
  { id: 'neon', labelJa: 'ネオン', label: 'Neon', activeColor: '#00f5ff', textColor: '#000' },
  { id: 'swiss', labelJa: 'スイス', label: 'Swiss', activeColor: '#e30613', textColor: '#fff' },
  { id: 'skeleton', labelJa: 'スケルトン', label: 'Skeleton', activeColor: '#c9a84c', textColor: '#000' },
]

interface Props {
  selected: ClockType
  onSelect: (type: ClockType) => void
  isDark: boolean
}

export const ClockSelector: React.FC<Props> = ({ selected, onSelect, isDark }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {OPTIONS.map(opt => {
        const isActive = selected === opt.id
        return (
          <TouchableOpacity
            key={opt.id}
            onPress={() => onSelect(opt.id)}
            style={[
              styles.btn,
              isDark ? styles.btnDark : styles.btnLight,
              isActive && { backgroundColor: opt.activeColor, borderColor: opt.activeColor },
            ]}
          >
            <Text style={[
              styles.labelJa,
              isDark ? styles.textDark : styles.textLight,
              isActive && { color: opt.textColor },
            ]}>
              {opt.labelJa}
            </Text>
            <Text style={[
              styles.labelEn,
              isDark ? styles.textDark : styles.textLight,
              isActive && { color: opt.textColor },
            ]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  btn: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 80,
  },
  btnDark: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.15)',
  },
  btnLight: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderColor: 'rgba(0,0,0,0.15)',
  },
  labelJa: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  labelEn: {
    fontSize: 10,
    letterSpacing: 1,
    opacity: 0.7,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  textDark: {
    color: 'rgba(255,255,255,0.8)',
  },
  textLight: {
    color: 'rgba(0,0,0,0.7)',
  },
})
