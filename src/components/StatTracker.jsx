import React from 'react'
import { useStats } from '../context/StatsContext'
import { COMBOS } from '../data/constants'
import './StatTracker.css'
 
export default function StatTracker({ lastCombo }) {
  const { totalRolls, rollCounts, resetStats } = useStats()
  const maxCount = Math.max(...Object.values(rollCounts), 1)
 
  return (
    <div className="tracker">
      <div className="tracker__header">
        <div className="tracker__title">Stats</div>
        <div className="tracker__total-wrap">
          <div className="tracker__total">{totalRolls}</div>
          <div className="tracker__total-label">Total rolls</div>
        </div>
      </div>
 
      <div className="tracker__rows">
        {COMBOS.map(name => {
          const count = rollCounts[name]
          const pct   = totalRolls > 0 ? (count / totalRolls * 100).toFixed(1) + '%' : '—'
          const barW  = (count / maxCount * 100).toFixed(1) + '%'
          const isLast = name === lastCombo
 
          return (
            <div key={name} className={`tracker__row${isLast ? ' tracker__row--highlight' : ''}`}>
              <div className="tracker__row-left">
                <div className="tracker__combo-name">{name}</div>
                <div className="tracker__bar-track">
                  <div className="tracker__bar-fill" style={{ width: barW }} />
                </div>
              </div>
              <div className="tracker__row-right">
                <div className="tracker__count">{count}</div>
                <div className="tracker__pct">{pct}</div>
              </div>
            </div>
          )
        })}
      </div>
 
      <button className="tracker__reset-btn" onClick={resetStats}>Reset</button>
    </div>
  )
}