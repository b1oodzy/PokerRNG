import React, { useState } from 'react'
import { useStats } from '../context/StatsContext'
import { COMBOS_BY_CHAPTER, COMBO_DETAILS_BY_CHAPTER, CHAPTER_TOTALS } from '../data/constants'
import './StatsPage.css'

function formatOdds(chapterTotal, combos) {
  if (!combos) return '—'
  const ratio = chapterTotal / combos
  const fixed = parseFloat(ratio.toFixed(3))
  return `1 in ${fixed.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  })}`
}

function formatPct(value, total) {
  if (!total) return '—'
  const pct = value / total * 100
  if (pct === 0) return '0%'
  if (pct < 0.001) return pct.toFixed(4) + '%'
  if (pct < 0.01)  return pct.toFixed(3) + '%'
  if (pct < 0.1)   return pct.toFixed(2) + '%'
  return pct.toFixed(2) + '%'
}

export default function StatsPage() {
  const { activeChapter, totalRolls, rollCounts, resetStats, resetEconomy } = useStats()
  const chId         = activeChapter.id
  const comboNames   = COMBOS_BY_CHAPTER[chId]
  const comboDetails = COMBO_DETAILS_BY_CHAPTER[chId]
  const chapterTotal = CHAPTER_TOTALS[chId]

  const [confirmStats,   setConfirmStats]   = useState(false)
  const [confirmEconomy, setConfirmEconomy] = useState(false)

  const detailMap = {}
  for (const d of comboDetails) detailMap[d.name] = d

  const maxTruePct = Math.max(
    ...comboNames.map(n => (detailMap[n]?.count ?? 0) / chapterTotal * 100),
    0.001
  )

  return (
    <div className="stats-page">
      <div className="stats-panel">

        <div className="stats-panel__header">
          <div>
            <h1 className="stats-panel__title">{activeChapter.name}</h1>
            <p className="stats-panel__sub">
              Your results vs. real-world odds &nbsp;·&nbsp;
              <span className="stats-panel__total-inline">{chapterTotal.toLocaleString()} total combinations</span>
            </p>
          </div>
          <div className="stats-panel__total-wrap">
            <div className="stats-panel__total">{totalRolls.toLocaleString()}</div>
            <div className="stats-panel__total-label">Total Rolls</div>
          </div>
        </div>

        <div className="stats-table">
          <div className="stats-table__head">
            <span>Hand</span>
            <div className="stats-table__group">
              <span className="stats-table__group-label">Frequency</span>
              <div className="stats-table__group-cols">
                <span>Rolled</span>
                <span>Combos</span>
              </div>
            </div>
            <div className="stats-table__group">
              <span className="stats-table__group-label">Probability</span>
              <div className="stats-table__group-cols">
                <span>Yours</span>
                <span>True</span>
              </div>
            </div>
            <span className="stats-table__odds-head">Odds</span>
          </div>

          {comboNames.map(name => {
            const detail  = detailMap[name]
            const rolled  = rollCounts[name] ?? 0
            const combos  = detail?.count ?? 0

            const yourPctNum = totalRolls > 0 ? rolled / totalRolls * 100 : 0
            const truePctNum = combos / chapterTotal * 100
            const yourBarW   = (yourPctNum / maxTruePct * 100).toFixed(1) + '%'
            const trueBarW   = (truePctNum / maxTruePct * 100).toFixed(1) + '%'

            return (
              <div key={name} className="stats-table__row">
                <div className="stats-table__name-col">
                  <span className="stats-table__name">{name}</span>
                  {detail?.desc && <span className="stats-table__desc">{detail.desc}</span>}
                </div>

                <div className="stats-table__group stats-table__group--data">
                  <span className="stats-table__val stats-table__val--gold">{rolled.toLocaleString()}</span>
                  <span className="stats-table__val">{combos.toLocaleString()}</span>
                </div>

                <div className="stats-table__group stats-table__group--data">
                  <div className="stats-table__bar-cell">
                    <div className="stats-table__bar-track">
                      <div className="stats-table__bar-fill stats-table__bar-fill--yours" style={{ width: yourBarW }} />
                    </div>
                    <span className="stats-table__val stats-table__val--gold">{formatPct(rolled, totalRolls)}</span>
                  </div>
                  <div className="stats-table__bar-cell">
                    <div className="stats-table__bar-track">
                      <div className="stats-table__bar-fill stats-table__bar-fill--true" style={{ width: trueBarW }} />
                    </div>
                    <span className="stats-table__val">{formatPct(combos, chapterTotal)}</span>
                  </div>
                </div>

                <span className="stats-table__odds">{formatOdds(chapterTotal, combos)}</span>
              </div>
            )
          })}
        </div>

        <div className="stats-actions">
          {!confirmStats ? (
            <button className="stats-reset-btn" onClick={() => setConfirmStats(true)}>Reset All Stats</button>
          ) : (
            <div className="stats-confirm">
              <span className="stats-confirm__label">Reset all roll stats?</span>
              <button className="stats-confirm__yes" onClick={() => { resetStats(); setConfirmStats(false) }}>Yes, reset</button>
              <button className="stats-confirm__no"  onClick={() => setConfirmStats(false)}>Cancel</button>
            </div>
          )}
          {!confirmEconomy ? (
            <button className="stats-reset-btn stats-reset-btn--economy" onClick={() => setConfirmEconomy(true)}>Reset Progress</button>
          ) : (
            <div className="stats-confirm">
              <span className="stats-confirm__label">Reset all coins &amp; XP?</span>
              <button className="stats-confirm__yes" onClick={() => { resetEconomy(); setConfirmEconomy(false) }}>Yes, reset</button>
              <button className="stats-confirm__no"  onClick={() => setConfirmEconomy(false)}>Cancel</button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}