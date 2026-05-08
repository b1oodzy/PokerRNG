import React from 'react'
import { useStats } from '../context/StatsContext'
import { COMBOS_BY_CHAPTER } from '../data/constants'
import './StatsPage.css'
 
// Fill in odds per chapter when ready — keyed as { chapterId: { comboName: '%' } }
const ODDS_BY_CHAPTER = {
  1: {
    'High Card': '100%',
  },
  2: {},
  3: {},
  4: {},
  5: {
    'Royal Flush':    '0.000154%',
    'Straight Flush': '0.00139%',
    'Four of a Kind': '0.0240%',
    'Full House':     '0.1441%',
    'Flush':          '0.1965%',
    'Straight':       '0.3925%',
    'Three of a Kind':'2.1128%',
    'Two Pair':       '4.7539%',
    'One Pair':       '42.2569%',
    'High Card':      '50.1177%',
  },
}
 
export default function StatsPage() {
  const { activeChapter, totalRolls, rollCounts, resetStats } = useStats()
  const combos   = COMBOS_BY_CHAPTER[activeChapter.id]
  const odds     = ODDS_BY_CHAPTER[activeChapter.id] ?? {}
  const maxCount = Math.max(...combos.map(c => rollCounts[c] ?? 0), 1)
 
  return (
    <div className="stats-page">
      <div className="stats-panel">
        <div className="stats-panel__header">
          <div>
            <h1 className="stats-panel__title">{activeChapter.name}</h1>
            <p className="stats-panel__sub">Your results vs. real-world odds</p>
          </div>
          <div className="stats-panel__total-wrap">
            <div className="stats-panel__total">{totalRolls}</div>
            <div className="stats-panel__total-label">Total Rolls</div>
          </div>
        </div>
 
        <div className="stats-table">
          <div className="stats-table__head">
            <span>Hand</span>
            <span>Rolled</span>
            <span>Your %</span>
            <span>True Odds</span>
          </div>
          {combos.map(name => {
            const count = rollCounts[name] ?? 0
            const pct   = totalRolls > 0 ? (count / totalRolls * 100).toFixed(2) + '%' : '—'
            const barW  = (count / maxCount * 100).toFixed(1) + '%'
 
            return (
              <div key={name} className="stats-table__row">
                <span className="stats-table__name">{name}</span>
                <span className="stats-table__count">{count}</span>
                <div className="stats-table__pct-wrap">
                  <div className="stats-table__bar-track">
                    <div className="stats-table__bar-fill" style={{ width: barW }} />
                  </div>
                  <span className="stats-table__pct">{pct}</span>
                </div>
                <span className="stats-table__odds">{odds[name] ?? '—'}</span>
              </div>
            )
          })}
        </div>
 
        {totalRolls > 0 && (
          <button className="stats-reset-btn" onClick={resetStats}>Reset All Stats</button>
        )}
      </div>
    </div>
  )
}