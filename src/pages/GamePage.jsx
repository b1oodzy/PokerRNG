import React, { useState, useCallback, useEffect, useRef } from 'react'
import Hand from '../components/Hand'
import ResultBanner from '../components/ResultBanner'
import StatTracker from '../components/StatTracker'
import { dealHand, dealExcluding } from '../utils/deck'
import { evaluate } from '../utils/evaluate'
import { useStats } from '../context/StatsContext'
import { useAutoRoll, FLIP_MS, MANUAL_LOCK_MS, AUTO_MS } from '../hooks/useAutoRoll'
import './GamePage.css'

const MAX_DISCARDS = 3 // free for dev testing

export default function GamePage() {
  const { activeChapter, recordRoll } = useStats()
  const handSize = activeChapter.cards

  const [cards,          setCards]          = useState(null)
  const [result,         setResult]         = useState(null)
  const [lastCombo,      setLastCombo]       = useState(null)
  // flippingIndices: Set of card indices that should animate the flip.
  // Kept cards are excluded so they visually stay still during a discard draw.
  const [flippingIndices, setFlippingIndices] = useState(new Set())
  const [manualKey,      setManualKey]      = useState(0)
  const [autoKey,        setAutoKey]        = useState(0)

  const [keptIndices, setKeptIndices] = useState(new Set())
  const [discards,    setDiscards]    = useState(MAX_DISCARDS)
  // 'idle' = no hand dealt, 'holding' = hand dealt and waiting for player action
  const [phase,       setPhase]       = useState('idle')

  const flippingRef  = useRef(false)
  const manualLockRef = useRef(0)   // timestamp until which manual draw is locked

  // Reset everything when chapter changes
  useEffect(() => {
    setCards(null)
    setResult(null)
    setLastCombo(null)
    setFlippingIndices(new Set())
    setKeptIndices(new Set())
    setDiscards(MAX_DISCARDS)
    setPhase('idle')
    manualLockRef.current = 0
  }, [activeChapter.id])

  function toggleKept(idx) {
    if (phase !== 'holding' || discards <= 0) return
    setKeptIndices(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  // Deal a fresh hand. Does NOT touch phase until cards are ready,
  // so there's no idle flash between sequential deals.
  function dealFresh(isAuto = false) {
    if (isAuto) setAutoKey(k => k + 1)
    else        setManualKey(k => k + 1)

    flippingRef.current = true
    // All card positions flip on a fresh deal
    setFlippingIndices(new Set([...Array(handSize).keys()]))
    setKeptIndices(new Set())

    // At FLIP_MS (250ms) the card is fully face-down — swap the content
    setTimeout(() => {
      const newCards  = dealHand(handSize)
      const newResult = evaluate(newCards, activeChapter.id)
      setCards(newCards)
      setResult(newResult)
      setDiscards(MAX_DISCARDS)
      setPhase('holding')
      flippingRef.current = false
    }, FLIP_MS)
    // At FLIP_MS * 2 (500ms) the full flip animation has finished — remove class
    setTimeout(() => setFlippingIndices(new Set()), FLIP_MS * 2)
  }

  // Award coins and record the hand — does NOT change phase or cards
  function scoreHand() {
    if (!result) return
    recordRoll(result.rank)
    setLastCombo(result.rank)
  }

  // Discard unkept cards and redraw
  function doDiscard() {
    // Snapshot kept indices before clearing them
    const keptSnap  = new Set(keptIndices)
    const keptCards = cards.filter((_, i) => keptSnap.has(i))
    const newCount  = handSize - keptCards.length

    setManualKey(k => k + 1)
    flippingRef.current = true
    // Only the non-kept positions flip
    const discardedIndices = new Set(
      [...Array(handSize).keys()].filter(i => !keptSnap.has(i))
    )
    setFlippingIndices(discardedIndices)
    // Don't clear keptIndices here — held cards stay highlighted after the draw

    setTimeout(() => {
      const drawn    = dealExcluding(keptCards, newCount)
      const newCards = [...Array(handSize)]
      // Put kept cards back in their original slots
      const keptArr  = [...keptSnap].sort((a, b) => a - b)
      keptArr.forEach((origIdx, i) => { newCards[origIdx] = keptCards[i] })
      // Fill gaps with newly drawn cards
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
    // At FLIP_MS * 2 (500ms) the full flip animation has finished — remove class
    setTimeout(() => setFlippingIndices(new Set()), FLIP_MS * 2)
  }

  const handleDraw = useCallback(() => {
    if (flippingRef.current) return
    if (Date.now() < manualLockRef.current) return
    manualLockRef.current = Date.now() + MANUAL_LOCK_MS

    if (phase === 'idle') {
      dealFresh(false)
      return
    }

    if (keptIndices.size > 0 && discards > 0) {
      doDiscard()
    } else {
      scoreHand()
      dealFresh(false)
    }
  }, [phase, keptIndices, discards, cards, result, handSize, activeChapter.id])

  const autoDrawFn = useCallback((isAuto) => {
    if (flippingRef.current) return
    if (phase === 'holding' && keptIndices.size > 0) return

    if (phase === 'idle') {
      dealFresh(isAuto)
    } else {
      scoreHand()
      dealFresh(isAuto)
    }
  }, [phase, keptIndices, cards, result, handSize, activeChapter.id])

  const { autoRolling, toggleAuto, tryRoll } = useAutoRoll(autoDrawFn)

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
        if (!autoRolling) handleDraw()
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
  }, [handleDraw, autoRolling, phase, discards, handSize])

  const displayCards = cards ?? Array(handSize).fill(null)
  const faceDown     = cards === null

  // Button shows "Draw" while idle or when cards are selected (discard action),
  // "Play" when holding with no selection (or no discards left).
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
            disabled={autoRolling}
            style={{ '--cooldown-ms': `${MANUAL_LOCK_MS}ms` }}
          >
            {/* Badge always present to prevent resize; dims when at 0 */}
            <span className={`roll-btn__discard-badge${discards === 0 ? ' roll-btn__discard-badge--empty' : ''}`}>
              {discards}
            </span>
            {/* Fixed-width label container so cooldown bar never changes shape */}
            <span className="roll-btn__label">{btnLabel}</span>
            <span className="roll-btn__hint">Space</span>
            {manualKey > 0 && (
              <span key={manualKey} className="btn-cooldown-bar" />
            )}
          </button>

          <button
            className={`auto-btn${autoRolling ? ' auto-btn--active' : ''}`}
            onClick={handleToggleAuto}
            style={{ '--cooldown-ms': `${AUTO_MS}ms` }}
          >
            {autoRolling ? '⏹ Stop Auto' : '▵ Auto Draw'}
            {autoRolling && (
              <span key={autoKey} className="btn-cooldown-bar" />
            )}
          </button>
        </div>
      </div>
      <StatTracker currentCombo={result?.rank ?? null} lastCombo={lastCombo} />
    </div>
  )
}