import { RANKS } from '../data/constants'
 
/**
 * Evaluates a 5-card poker hand.
 * @param {Array} hand - Array of { suit, rank } card objects
 * @returns {{ rank: string, desc: string }}
 */
export function evaluate(hand) {
  const vals  = hand.map(c => c.rank.v).sort((a, b) => a - b)
  const suits = hand.map(c => c.suit.name)
 
  const isFlush = suits.every(s => s === suits[0])
  const isStr   = (vals[4] - vals[0] === 4 && new Set(vals).size === 5)
               || vals.join(',') === '2,3,4,5,14' // wheel: A-2-3-4-5
 
  const freq = {}
  for (const v of vals) freq[v] = (freq[v] || 0) + 1
  const counts = Object.values(freq).sort((a, b) => b - a)
 
  if (isFlush && isStr) {
    const isRoyal = vals.join(',') === '10,11,12,13,14'
    return isRoyal
      ? { rank: 'Royal Flush',    desc: 'A, K, Q, J, 10 — all same suit' }
      : { rank: 'Straight Flush', desc: 'Five consecutive cards, same suit' }
  }
  if (counts[0] === 4) return { rank: 'Four of a Kind',  desc: 'Four cards of the same rank' }
  if (counts[0] === 3 && counts[1] === 2)
                        return { rank: 'Full House',      desc: 'Three of a kind + a pair' }
  if (isFlush)          return { rank: 'Flush',           desc: 'Five cards of the same suit' }
  if (isStr)            return { rank: 'Straight',        desc: 'Five consecutive cards' }
  if (counts[0] === 3)  return { rank: 'Three of a Kind', desc: 'Three cards of the same rank' }
  if (counts[0] === 2 && counts[1] === 2)
                        return { rank: 'Two Pair',        desc: 'Two different pairs' }
  if (counts[0] === 2)  return { rank: 'One Pair',        desc: 'Two cards of the same rank' }
 
  const highName = RANKS.find(r => r.v === vals[4]).n
  return { rank: 'High Card', desc: `Highest card: ${highName}` }
}