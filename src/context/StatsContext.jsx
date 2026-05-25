import React, { createContext, useContext, useState, useEffect } from 'react'
import { CHAPTERS, COMBOS_BY_CHAPTER, COMBO_DETAILS_BY_CHAPTER, CHAPTER_TOTALS } from '../data/constants'

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

function loadEconomy() {
  try {
    const raw = localStorage.getItem('pokerRollerEconomy')
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveEconomy(coins, xp) {
  try {
    localStorage.setItem('pokerRollerEconomy', JSON.stringify({ coins, xp }))
  } catch {}
}

export function StatsProvider({ children }) {
  const [activeChapter, setActiveChapter] = useState(CHAPTERS[0])

  const [statsMap, setStatsMap] = useState(() => {
    const map = {}
    for (const ch of CHAPTERS) {
      const saved = loadStats(ch.id)
      map[ch.id] = saved ?? emptyStats(ch.id)
    }
    return map
  })

  const saved = loadEconomy()
  const [coins, setCoins] = useState(saved?.coins ?? 0)
  const [xp,    setXp]    = useState(saved?.xp    ?? 0)

  const chId       = activeChapter.id
  const totalRolls = statsMap[chId]?.totalRolls ?? 0
  const rollCounts = statsMap[chId]?.rollCounts ?? {}

  useEffect(() => {
    for (const ch of CHAPTERS) {
      const s = statsMap[ch.id]
      if (s) saveStats(ch.id, s.totalRolls, s.rollCounts)
    }
  }, [statsMap])

  useEffect(() => {
    saveEconomy(coins, xp)
  }, [coins, xp])

  function recordRoll(comboName) {
    // Calculate reward: round(totalCombos / comboCombos)
    const total     = CHAPTER_TOTALS[chId]
    const combos    = COMBO_DETAILS_BY_CHAPTER[chId]
    const combo     = combos.find(c => c.name === comboName)
    const reward    = combo ? Math.round(total / combo.count) : 1

    setCoins(prev => prev + reward)
    setXp(prev    => prev + reward)

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

  function resetEconomy() {
    setCoins(0)
    setXp(0)
  }

  return (
    <StatsContext.Provider value={{
      activeChapter,
      setActiveChapter,
      totalRolls,
      rollCounts,
      recordRoll,
      resetStats,
      coins,
      xp,
      resetEconomy,
    }}>
      {children}
    </StatsContext.Provider>
  )
}

export function useStats() {
  return useContext(StatsContext)
}