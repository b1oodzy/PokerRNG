import React from 'react'
import Card from './Card'
import './Hand.css'
 
const ROW_SIZE = 5
 
export default function Hand({ cards, faceDown = false, flipping = false }) {
  const rows = []
  for (let i = 0; i < cards.length; i += ROW_SIZE) {
    rows.push(cards.slice(i, i + ROW_SIZE))
  }
 
  return (
    <div className="hand">
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="hand__row">
          {row.map((card, colIdx) => (
            <Card key={colIdx} card={card} faceDown={faceDown} flipping={flipping} />
          ))}
        </div>
      ))}
    </div>
  )
}