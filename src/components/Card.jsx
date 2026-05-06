import React from 'react'
import './Card.css'
 
export default function Card({ card, faceDown = false }) {
  if (faceDown || !card) {
    return (
      <div className="card card--back">
        <div className="card__back-pattern" />
      </div>
    )
  }
 
  const { suit, rank } = card
  const colorClass = suit.color === 'red' ? 'card--red' : 'card--black'
 
  return (
    <div className={`card ${colorClass}`}>
      <div className="card__corner card__corner--tl">
        <div className="card__rank">{rank.l}</div>
        <div className="card__suit">{suit.sym}</div>
      </div>
      <div className="card__center">{suit.sym}</div>
      <div className="card__corner card__corner--br">
        <div className="card__rank">{rank.l}</div>
        <div className="card__suit">{suit.sym}</div>
      </div>
    </div>
  )
}