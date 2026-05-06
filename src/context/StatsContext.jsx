import React, { createContext, useContext, useState, useEffect } from 'react'
import { COMBOS } from '../data/constants'
 
const StatsContext = createContext(null)
 
const STORAGE_KEY = 'pokerRollerStats'
 
function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveStats(totalRolls, rollCounts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ totalRolls, rollCounts }))
  } catch {
    // Storage unavailable — fail silently
  }
}
 
export function StatsProvider({ children }) {
  const saved = loadStats()
 
  const [totalRolls, setTotalRolls] = useState(saved?.totalRolls ?? 0)
  const [rollCounts, setRollCounts] = useState(
    saved?.rollCounts ?? Object.fromEntries(COMBOS.map(c => [c, 0]))
  )
 
  // Persist whenever stats change
  useEffect(() => {
    saveStats(totalRolls, rollCounts)
  }, [totalRolls, rollCounts])
 
  function recordRoll(comboName) {
    setTotalRolls(t => t + 1)
    setRollCounts(prev => ({ ...prev, [comboName]: prev[comboName] + 1 }))
  }
 
  function resetStats() {
    setTotalRolls(0)
    setRollCounts(Object.fromEntries(COMBOS.map(c => [c, 0])))
  }
 
  return (
    <StatsContext.Provider value={{ totalRolls, rollCounts, recordRoll, resetStats }}>
      {children}
    </StatsContext.Provider>
  )
}
 
export function useStats() {
  return useContext(StatsContext)
}