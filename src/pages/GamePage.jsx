import React, { useState, useCallback, useEffect } from 'react'
import Hand from '../components/Hand'
import ResultBanner from '../components/ResultBanner'
import StatTracker from '../components/StatTracker'
import { dealHand } from '../utils/deck'
import { evaluate } from '../utils/evaluate'
import { useStats } from '../context/StatsContext'
import { useAutoRoll, FLIP_MS, MANUAL_LOCK_MS, AUTO_MS } from '../hooks/useAutoRoll'
import './GamePage.css'

export default function GamePage() {
  const { activeChapter, recordRoll } = useStats()
  const handSize = activeChapter.cards
  
  const [cards, setCards]         = useState(null)
  const [result, setResult]       = useState(null)
  const [lastCombo, setLastCombo] = useState(null)
  const [flipping, setFlipping]   = useState(false)
  const [manualKey, setManualKey] = useState(0)
  const [autoKey, setAutoKey]     = useState(0)
  
  // Reset table when chapter changes
  useEffect(() => {
    setCards(null)
    setResult(null)
    setLastCombo(null)
    setFlipping(false)
  }, [activeChapter.id])
  
  const rollOnce = useCallback((isAuto = false) => {
    if (isAuto) setAutoKey(k => k + 1)
    else        setManualKey(k => k + 1)
  
    setFlipping(true)
    setTimeout(() => {
      const newCards  = dealHand(handSize)
      const newResult = evaluate(newCards, activeChapter.id)
      setCards(newCards)
      setResult(newResult)
      setLastCombo(newResult.rank)
      recordRoll(newResult.rank)
    }, FLIP_MS)
    setTimeout(() => setFlipping(false), FLIP_MS * 2)
  }, [recordRoll, handSize, activeChapter.id])
  
  const { autoRolling, toggleAuto, tryRoll } = useAutoRoll(rollOnce)
  
  // Stop auto-roll when chapter changes
  useEffect(() => {
    if (autoRolling) toggleAuto()
  }, [activeChapter.id])
  
  function handleToggleAuto() {
    if (!autoRolling) setAutoKey(k => k + 1)
    toggleAuto()
  }
  
  useEffect(() => {
    function onKey(e) {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        tryRoll()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [tryRoll])
  
  const displayCards = cards ?? Array(handSize).fill(null)
  const faceDown     = cards === null
  
  return (
    <div className="game-page">
      <div className="felt">
        <div className="felt__title">{activeChapter.name}</div>
        <Hand cards={displayCards} flipping={flipping} faceDown={faceDown} />
        <ResultBanner result={result} />
        <div className="felt__buttons">
          <button
            className="roll-btn"
            onClick={tryRoll}
            disabled={autoRolling}
            style={{ '--cooldown-ms': `${MANUAL_LOCK_MS}ms` }}
          >
            Roll <span className="roll-btn__hint">Space</span>
            {manualKey > 0 && (
              <span key={manualKey} className="btn-cooldown-bar" />
            )}
          </button>
          <button
            className={`auto-btn${autoRolling ? ' auto-btn--active' : ''}`}
            onClick={handleToggleAuto}
            style={{ '--cooldown-ms': `${AUTO_MS}ms` }}
          >
            {autoRolling ? '⏹ Stop Auto' : '⏵ Auto Roll'}
            {autoRolling && (
              <span key={autoKey} className="btn-cooldown-bar" />
            )}
          </button>
        </div>
      </div>
      <StatTracker lastCombo={lastCombo} />
    </div>
  )
}