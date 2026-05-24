import React from 'react'
import { useStats } from '../context/StatsContext'
import { COMBOS_BY_CHAPTER, COMBO_DETAILS_BY_CHAPTER } from '../data/constants'
import './StatsPage.css'

const ODDS_BY_CHAPTER = {
  1: {
    'Ace of Spades':   '1.92%',
    'Stray Bullets':   '5.77%',
    'Paint Cards':     '23.08%',
    'Pip Cards':       '69.23%',
  },
  2: {
    'Kalashnikovs':    '0.30%',
    'Pocket Rockets':  '0.45%',
    'Big Slicks':      '0.90%',
    'Suited Connectors':'3.62%',
    'Pocket Pairs':    '5.43%',
    'Connectors':      '10.86%',
    'Suited':          '19.61%',
    'High Card':       '58.82%',
  },
  3: {
    'Triple Aces':     '0.018%',
    'Royal Flush':     '0.018%',
    'Monotone Straight':'0.199%',
    'Three of a Kind': '0.217%',
    'Rainbow Straight':'1.303%',
    'Two-Tone Straight':'1.955%',
    'Monotone Flop':   '4.959%',
    'Paired Flop':     '16.941%',
    'Rainbow Flop':    '29.756%',
    'Two-Tone Flop':   '44.633%',
  },
  4: {
    'Quad Aces':       '0.00037%',
    'Royal Flush':     '0.0015%',
    'Four of a Kind':  '0.0044%',
    'Straight Flush':  '0.0148%',
    'Broadway Straight':'0.0931%',
    'Three of a Kind': '0.9220%',
    'Straight':        '0.9308%',
    'Two Pair':        '1.0373%',
    'Flush':           '1.0402%',
    'Jacks or Better': '9.3635%',
    'Low Pair':        '21.0634%',
    'High Card':       '65.5305%',
  },
  5: {
    'Royal Flush':     '0.000154%',
    'Straight Flush':  '0.00139%',
    'Quad Aces':       '0.00185%',
    'Four of a Kind':  '0.0240%',
    'Full House':      '0.1441%',
    'Flush':           '0.1965%',
    'Straight':        '0.3925%',
    'Three of a Kind': '2.1128%',
    'Two Pair':        '4.7539%',
    'One Pair':        '42.2569%',
    'High Card':       '50.1177%',
  },
}

export default function StatsPage() {
  const { activeChapter, totalRolls, rollCounts, resetStats } = useStats()
  const comboNames = COMBOS_BY_CHAPTER[activeChapter.id]
  const comboDetails = COMBO_DETAILS_BY_CHAPTER[activeChapter.id]
  const odds     = ODDS_BY_CHAPTER[activeChapter.id] ?? {}
  const maxCount = Math.max(...comboNames.map(c => rollCounts[c] ?? 0), 1)
  
  const descMap = {}
  for (const d of comboDetails) {
    descMap[d.name] = d.desc
  }
  
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
          {comboNames.map(name => {
            const count = rollCounts[name] ?? 0
            const pct   = totalRolls > 0 ? (count / totalRolls * 100).toFixed(2) + '%' : '—'
            const barW  = (count / maxCount * 100).toFixed(1) + '%'
            const desc = descMap[name] || ''
  
            return (
              <div key={name} className="stats-table__row">
                <div className="stats-table__name-col">
                  <span className="stats-table__name">{name}</span>
                  {desc && <span className="stats-table__desc">{desc}</span>}
                </div>
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