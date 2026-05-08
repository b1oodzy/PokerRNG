import React, { createContext, useContext, useState, useEffect } from 'react'
import { CHAPTERS, COMBOS_BY_CHAPTER } from '../data/constants'
 
const StatsContext = createContext(null)
 
function storageKey(chapterId) {
  return `pokerRollerStats_ch${chapterId}`
}
 
function loadStats(chapterId) {
  try {
    const raw = localStorage.getItem(storageKey(chapterId))
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}
 
function saveStats(chapterId, totalRolls, rollCounts) {
  try {
    localStorage.setItem(storageKey(chapterId), JSON.stringify({ totalRolls, rollCounts }))
  } catch {}
}
 
function emptyStats(chapterId) {
  return {
    totalRolls: 0,
    rollCounts: Object.fromEntries(COMBOS_BY_CHAPTER[chapterId].map(c => [c, 0])),
  }
}
 
export function StatsProvider({ children }) {
  const [activeChapter, setActiveChapter] = useState(CHAPTERS[0])
 
  // Per-chapter stats cache — load all chapters upfront
  const [statsMap, setStatsMap] = useState(() => {
    const map = {}
    for (const ch of CHAPTERS) {
      const saved = loadStats(ch.id)
      map[ch.id] = saved ?? emptyStats(ch.id)
    }
    return map
  })
 
  const chId         = activeChapter.id
  const totalRolls   = statsMap[chId]?.totalRolls ?? 0
  const rollCounts   = statsMap[chId]?.rollCounts ?? {}
 
  // Persist whenever stats for any chapter change
  useEffect(() => {
    for (const ch of CHAPTERS) {
      const s = statsMap[ch.id]
      if (s) saveStats(ch.id, s.totalRolls, s.rollCounts)
    }
  }, [statsMap])
 
  function recordRoll(comboName) {
    setStatsMap(prev => {
      const cur = prev[chId]
      return {
        ...prev,
        [chId]: {
          totalRolls: cur.totalRolls + 1,
          rollCounts: {
            ...cur.rollCounts,
            [comboName]: (cur.rollCounts[comboName] ?? 0) + 1,
          },
        },
      }
    })
  }
 
  function resetStats() {
    setStatsMap(prev => ({
      ...prev,
      [chId]: emptyStats(chId),
    }))
  }
 
  return (
    <StatsContext.Provider value={{
      activeChapter,
      setActiveChapter,
      totalRolls,
      rollCounts,
      recordRoll,
      resetStats,
    }}>
      {children}
    </StatsContext.Provider>
  )
}
 
export function useStats() {
  return useContext(StatsContext)
}