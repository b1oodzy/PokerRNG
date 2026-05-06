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