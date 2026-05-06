import React, { createContext, useContext, useState } from 'react'
import { COMBOS } from '../data/constants'
 
const StatsContext = createContext(null)
 
export function StatsProvider({ children }) {
  const [totalRolls, setTotalRolls] = useState(0)
  const [rollCounts, setRollCounts] = useState(
    Object.fromEntries(COMBOS.map(c => [c, 0]))
  )
 
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