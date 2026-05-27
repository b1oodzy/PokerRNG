import { SUITS, RANKS } from '../data/constants'

/** Build and return a freshly shuffled 52-card deck */
export function buildDeck() {
  const deck = []
  for (const suit of SUITS)
    for (const rank of RANKS)
      deck.push({ suit, rank })
  return deck
}

/** Draw `count` unique cards at random from a full deck */
export function dealHand(count = 5) {
  const deck = buildDeck()
  const hand = []
  while (hand.length < count) {
    const i = Math.floor(Math.random() * deck.length)
    hand.push(deck.splice(i, 1)[0])
  }
  return hand
}

/**
 * Draw `count` unique cards from a deck that excludes the given `excludeCards`.
 * Used for discard redraws — kept cards cannot be drawn again.
 */
export function dealExcluding(excludeCards, count) {
  const excluded = new Set(
    excludeCards.map(c => `${c.suit.name}-${c.rank.v}`)
  )
  const deck = buildDeck().filter(
    c => !excluded.has(`${c.suit.name}-${c.rank.v}`)
  )
  const hand = []
  while (hand.length < count) {
    const i = Math.floor(Math.random() * deck.length)
    hand.push(deck.splice(i, 1)[0])
  }
  return hand
}