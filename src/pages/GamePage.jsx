import React, { useState, useCallback, useEffect, useRef } from 'react'
import Hand from '../components/Hand'
import ResultBanner from '../components/ResultBanner'
import StatTracker from '../components/StatTracker'
import { dealHand, dealExcluding } from '../utils/deck'
import { evaluate } from '../utils/evaluate'
import { useStats } from '../context/StatsContext'
import './GamePage.css'

const FLIP_MS = 250
const MANUAL_LOCK_MS = 750

export default function GamePage() {
  const { activeChapter, recordRoll, unlockedCards, discardLevel } = useStats()
  const handSize = unlockedCards

  const [cards,          setCards]          = useState(null)
  const [result,         setResult]         = useState(null)
  const [lastCombo,      setLastCombo]      = useState(null)
  // flippingIndices: Set of card indices that should animate the flip.
  const [flippingIndices, setFlippingIndices] = useState(new Set())
  const [manualKey,      setManualKey]      = useState(0)

  const [keptIndices, setKeptIndices] = useState(new Set())
  const [discards,    setDiscards]    = useState(discardLevel)
  // 'idle' = no hand dealt, 'holding' = hand dealt and waiting for player action
  const [phase,       setPhase]       = useState('idle')

  const flippingRef  = useRef(false)
  const manualLockRef = useRef(0)   // timestamp until which manual draw is locked

  // Reset everything when chapter/upgrades change
  useEffect(() => {
    setCards(null)
    setResult(null)
    setLastCombo(null)
    setFlippingIndices(new Set())
    setKeptIndices(new Set())
    setDiscards(discardLevel)
    setPhase('idle')
    manualLockRef.current = 0
  }, [activeChapter.id, unlockedCards, discardLevel])

  function toggleKept(idx) {
    if (phase !== 'holding' || discards <= 0) return
    setKeptIndices(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  // Deal a fresh hand. Does NOT touch phase until cards are ready.
  function dealFresh() {
    setManualKey(k => k + 1)
    flippingRef.current = true
    setFlippingIndices(new Set([...Array(handSize).keys()]))
    setKeptIndices(new Set())

    setTimeout(() => {
      const newCards  = dealHand(handSize)
      const newResult = evaluate(newCards, activeChapter.id)
      setCards(newCards)
      setResult(newResult)
      setDiscards(discardLevel)
      setPhase('holding')
      flippingRef.current = false
    }, FLIP_MS)
    setTimeout(() => setFlippingIndices(new Set()), FLIP_MS * 2)
  }

  // Award coins and record the hand
  function scoreHand() {
    if (!result) return
    recordRoll(result.rank)
    setLastCombo(result.rank)
  }

  // Discard unkept cards and redraw
  function doDiscard() {
    const keptSnap  = new Set(keptIndices)
    const keptCards = cards.filter((_, i) => keptSnap.has(i))
    const newCount  = handSize - keptCards.length

    setManualKey(k => k + 1)
    flippingRef.current = true
    const discardedIndices = new Set(
      [...Array(handSize).keys()].filter(i => !keptSnap.has(i))
    )
    setFlippingIndices(discardedIndices)

    setTimeout(() => {
      const drawn    = dealExcluding(keptCards, newCount)
      const newCards = [...Array(handSize)]
      const keptArr  = [...keptSnap].sort((a, b) => a - b)
      keptArr.forEach((origIdx, i) => { newCards[origIdx] = keptCards[i] })
      let drawPtr = 0
      for (let i = 0; i < handSize; i++) {
        if (!newCards[i]) newCards[i] = drawn[drawPtr++]
      }
      const newResult = evaluate(newCards, activeChapter.id)
      setCards(newCards)
      setResult(newResult)
      setDiscards(d => d - 1)
      flippingRef.current = false
    }, FLIP_MS)
    setTimeout(() => setFlippingIndices(new Set()), FLIP_MS * 2)
  }

  const handleDraw = useCallback(() => {
    if (flippingRef.current) return
    if (Date.now() < manualLockRef.current) return
    manualLockRef.current = Date.now() + MANUAL_LOCK_MS

    if (phase === 'idle') {
      dealFresh()
      return
    }

    if (keptIndices.size > 0 && discards > 0) {
      doDiscard()
    } else {
      scoreHand()
      dealFresh()
    }
  }, [phase, keptIndices, discards, cards, result, handSize, activeChapter.id, discardLevel])

  useEffect(() => {
    function onKey(e) {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        handleDraw()
        return
      }
      const numMatch = e.key.match(/^([1-9]|0)$/)
      if (numMatch) {
        const idx = e.key === '0' ? 9 : parseInt(e.key) - 1
        if (idx < handSize) toggleKept(idx)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleDraw, phase, discards, handSize])

  const displayCards = cards ?? Array(handSize).fill(null)
  const faceDown     = cards === null

  const isPlaying = phase === 'holding' && keptIndices.size === 0
  const btnLabel  = isPlaying ? 'Play' : 'Draw'

  return (
    <div className="game-page">
      <div className="felt">
        <div className="felt__title">{activeChapter.name}</div>

        <Hand
          cards={displayCards}
          flippingIndices={flippingIndices}
          faceDown={faceDown}
          keptIndices={keptIndices}
          onCardClick={toggleKept}
          canSelect={phase === 'holding' && discards > 0}
          handSize={handSize}
        />

        <ResultBanner result={result} />

        <div className="felt__buttons">
          <button
            className="roll-btn"
            onClick={handleDraw}
            style={{ '--cooldown-ms': `${MANUAL_LOCK_MS}ms` }}
          >
            <span className={`roll-btn__discard-badge${discards === 0 ? ' roll-btn__discard-badge--empty' : ''}`}>
              {discards}
            </span>
            <span className="roll-btn__label">{btnLabel}</span>
            <span className="roll-btn__hint">Space</span>
            {manualKey > 0 && (
              <span key={manualKey} className="btn-cooldown-bar" />
            )}
          </button>
        </div>
      </div>
      <StatTracker currentCombo={result?.rank ?? null} lastCombo={lastCombo} />
    </div>
  )
}