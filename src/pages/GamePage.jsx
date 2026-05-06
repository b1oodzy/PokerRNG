import React, { useState } from 'react'
import Hand from '../components/Hand'
import ResultBanner from '../components/ResultBanner'
import StatTracker from '../components/StatTracker'
import { dealHand } from '../utils/deck'
import { evaluate } from '../utils/evaluate'
import { useStats } from '../context/StatsContext'
import './GamePage.css'
 
const HAND_SIZE = 5
 
export default function GamePage() {
  // null = not yet rolled; cards stay face-down
  const [cards, setCards]         = useState(null)
  const [result, setResult]       = useState(null)
  const [lastCombo, setLastCombo] = useState(null)
  const { recordRoll } = useStats()
 
  function roll() {
    const newCards  = dealHand(HAND_SIZE)
    const newResult = evaluate(newCards)
    setCards(newCards)
    setResult(newResult)
    setLastCombo(newResult.rank)
    recordRoll(newResult.rank)
  }
 
  const displayCards = cards ?? Array(HAND_SIZE).fill(null)
  const faceDown     = cards === null
 
  return (
    <div className="game-page">
      <div className="felt">
        <div className="felt__title">Card Draw</div>
        <Hand cards={displayCards} faceDown={faceDown} />
        <ResultBanner result={result} />
        <button className="roll-btn" onClick={roll}>Roll</button>
      </div>
      <StatTracker lastCombo={lastCombo} />
    </div>
  )
}