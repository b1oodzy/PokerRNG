import React from 'react'
import { useStats } from '../context/StatsContext'
import { COMBOS_BY_CHAPTER } from '../data/constants'
import './StatTracker.css'

export default function StatTracker({ currentCombo, lastCombo }) {
  const { activeChapter, totalRolls, rollCounts } = useStats()
  const comboNames = COMBOS_BY_CHAPTER[activeChapter.id]
  const maxCount = Math.max(...comboNames.map(c => rollCounts[c] ?? 0), 1)

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
        {comboNames.map(name => {
          // Stats (count, bar, pct) reflect only played hands via lastCombo/rollCounts
          const count = rollCounts[name] ?? 0
          const pct   = totalRolls > 0 ? (count / totalRolls * 100).toFixed(1) + '%' : '—'
          const barW  = (count / maxCount * 100).toFixed(1) + '%'
          // Highlight tracks the live current hand, not the last played one
          const isHighlighted = name === currentCombo

          return (
            <div key={name} className={`tracker__row${isHighlighted ? ' tracker__row--highlight' : ''}`}>
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
    </div>
  )
}