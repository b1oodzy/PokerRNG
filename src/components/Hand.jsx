import React from 'react'
import Card from './Card'
import './Hand.css'

const ROW_SIZE = 5

// Hotkey label for a given card index: 1-9 then 0
function hotkeyLabel(idx) {
  return idx === 9 ? '0' : String(idx + 1)
}

export default function Hand({
  cards,
  faceDown      = false,
  flippingIndices = new Set(),
  keptIndices   = new Set(),
  onCardClick,
  canSelect     = false,
  handSize      = 0,
}) {
  const rows = []
  for (let i = 0; i < cards.length; i += ROW_SIZE) {
    rows.push(
      cards.slice(i, i + ROW_SIZE).map((card, colIdx) => ({
        card,
        globalIdx: i + colIdx,
      }))
    )
  }

  return (
    <div className="hand">
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="hand__row">
          {row.map(({ card, globalIdx }) => {
            const isKept     = keptIndices.has(globalIdx)
            const isFlipping = flippingIndices.has(globalIdx)

            return (
              <div
                key={globalIdx}
                className={[
                  'hand__card-wrap',
                  isKept    ? 'hand__card-wrap--kept'      : '',
                  canSelect ? 'hand__card-wrap--selectable' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => onCardClick && onCardClick(globalIdx)}
              >
                {isKept && <div className="hand__kept-label">Hold</div>}
                <Card card={card} faceDown={faceDown} flipping={isFlipping} />
                {/* Hotkey hint — always shown so layout is stable */}
                <div className={`hand__hotkey${canSelect ? ' hand__hotkey--active' : ''}`}>
                  {hotkeyLabel(globalIdx)}
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}