import { RANKS, SUITS } from '../data/constants'
import { 
  COMBOS_CH1, COMBOS_CH2, COMBOS_CH3, COMBOS_CH4, COMBOS_CH5 
} from '../data/constants'

// Helper maps for quick lookup of flavor text
const FLAVOR_MAP = {
  1: Object.fromEntries(COMBOS_CH1.map(c => [c.name, c.flavor])),
  2: Object.fromEntries(COMBOS_CH2.map(c => [c.name, c.flavor])),
  3: Object.fromEntries(COMBOS_CH3.map(c => [c.name, c.flavor])),
  4: Object.fromEntries(COMBOS_CH4.map(c => [c.name, c.flavor])),
  5: Object.fromEntries(COMBOS_CH5.map(c => [c.name, c.flavor])),
}

/**
 * Helper: check if values form a straight (including wheel A-2-3-4-5)
 */
function isStraight(vals) {
  const unique = [...new Set(vals)]
  if (unique.length !== vals.length) return false
  const sorted = unique.sort((a, b) => a - b)
  // Normal straight
  if (sorted[sorted.length - 1] - sorted[0] === sorted.length - 1) return true
  // Wheel: A-2-3-4-5 (values: 2,3,4,5,14)
  if (sorted.join(',') === '2,3,4,5,14') return true
  return false
}

/**
 * Helper: count suit frequencies
 */
function suitCounts(hand) {
  const counts = {}
  for (const c of hand) {
    const s = c.suit.name
    counts[s] = (counts[s] || 0) + 1
  }
  return counts
}

/**
 * Helper: count rank frequencies
 */
function rankCounts(hand) {
  const counts = {}
  for (const c of hand) {
    const r = c.rank.v
    counts[r] = (counts[r] || 0) + 1
  }
  return counts
}

/**
 * Evaluate Chapter 1 (1 card)
 */
function evaluateCh1(hand) {
  const card = hand[0]
  const rank = card.rank
  const suit = card.suit
  
  let name = ''
  if (rank.v === 14 && suit.name === 'Spades') name = 'Ace of Spades'
  else if (rank.v === 14) name = 'Stray Bullets'
  else if (rank.v >= 11 && rank.v <= 13) name = 'Paint Cards'
  else name = 'Pip Cards'

  return { 
    rank: name, 
    desc: COMBOS_CH1.find(c => c.name === name)?.desc || '',
    flavor: FLAVOR_MAP[1][name] || ''
  }
}

/**
 * Evaluate Chapter 2 (2 cards)
 */
function evaluateCh2(hand) {
  const vals = hand.map(c => c.rank.v).sort((a, b) => a - b)
  const suits = hand.map(c => c.suit.name)
  const isSuited = suits[0] === suits[1]
  const isPair = vals[0] === vals[1]
  const isAK = vals[0] === 13 && vals[1] === 14 // K, A
  const isConnector = (vals[1] - vals[0] === 1) || (vals[0] === 2 && vals[1] === 14)
  
  let name = ''
  if (isAK && isSuited) name = 'Kalashnikovs'
  else if (isPair && vals[0] === 14) name = 'Pocket Rockets'
  else if (isAK && !isSuited) name = 'Big Slicks'
  else if (isConnector && isSuited) name = 'Suited Connectors'
  else if (isPair) name = 'Pocket Pairs'
  else if (isConnector && !isSuited) name = 'Connectors'
  else if (isSuited) name = 'Suited'
  else name = 'High Card'

  return { 
    rank: name, 
    desc: COMBOS_CH2.find(c => c.name === name)?.desc || '',
    flavor: FLAVOR_MAP[2][name] || ''
  }
}

/**
 * Evaluate Chapter 3 (3 cards)
 */
function evaluateCh3(hand) {
  const vals = hand.map(c => c.rank.v).sort((a, b) => a - b)
  const sc = suitCounts(hand)
  const rc = rankCounts(hand)
  const counts = Object.values(rc).sort((a, b) => b - a)
  const suitVals = Object.values(sc)
  
  const isStraight3 = isStraight(vals)
  const isMonotone = suitVals.some(c => c === 3)
  const isTwoTone = suitVals.some(c => c === 2) && !isMonotone
  const isRainbow = suitVals.every(c => c === 1)
  
  let name = ''
  if (rc[14] === 3) name = 'Triple Aces'
  else if (vals.join(',') === '12,13,14' && isMonotone) name = 'Royal Flush'
  else if (isStraight3 && isMonotone) name = 'Monotone Straight'
  else if (counts[0] === 3) name = 'Three of a Kind'
  else if (isStraight3 && isRainbow) name = 'Rainbow Straight'
  else if (isStraight3 && isTwoTone) name = 'Two-Tone Straight'
  else if (isMonotone) name = 'Monotone Flop'
  else if (counts[0] === 2) name = 'Paired Flop'
  else if (isRainbow) name = 'Rainbow Flop'
  else name = 'Two-Tone Flop'

  return { 
    rank: name, 
    desc: COMBOS_CH3.find(c => c.name === name)?.desc || '',
    flavor: FLAVOR_MAP[3][name] || ''
  }
}

/**
 * Evaluate Chapter 4 (4 cards)
 */
function evaluateCh4(hand) {
  const vals = hand.map(c => c.rank.v).sort((a, b) => a - b)
  const sc = suitCounts(hand)
  const rc = rankCounts(hand)
  const counts = Object.values(rc).sort((a, b) => b - a)
  const suitVals = Object.values(sc)
  
  const isStraight4 = isStraight(vals)
  const isFlush4 = suitVals.some(c => c === 4)
  
  let name = ''
  if (rc[14] === 4) name = 'Quad Aces'
  else if (vals.join(',') === '11,12,13,14' && isFlush4) name = 'Royal Flush'
  else if (counts[0] === 4) name = 'Four of a Kind'
  else if (isStraight4 && isFlush4) name = 'Straight Flush'
  else if (vals.join(',') === '11,12,13,14' && !isFlush4) name = 'Broadway Straight'
  else if (counts[0] === 3 && counts[1] === 1) name = 'Three of a Kind'
  else if (isStraight4) name = 'Straight'
  else if (counts[0] === 2 && counts[1] === 2) name = 'Two Pair'
  else if (isFlush4) name = 'Flush'
  else if (counts[0] === 2) {
    const pairRank = Object.keys(rc).find(r => rc[r] === 2)
    name = (parseInt(pairRank) >= 11) ? 'Jacks or Better' : 'Low Pair'
  }
  else name = 'High Card'

  return { 
    rank: name, 
    desc: COMBOS_CH4.find(c => c.name === name)?.desc || '',
    flavor: FLAVOR_MAP[4][name] || ''
  }
}

/**
 * Evaluate Chapter 5 (5 cards) - Standard poker hands
 */
function evaluateCh5(hand) {
  const vals = hand.map(c => c.rank.v).sort((a, b) => a - b)
  const suits = hand.map(c => c.suit.name)
  const sc = suitCounts(hand)
  const rc = rankCounts(hand)
  const counts = Object.values(rc).sort((a, b) => b - a)
  
  const isFlush = suits.every(s => s === suits[0])
  const isStr = isStraight(vals)
  
  let name = ''
  if (isFlush && isStr) {
    const isRoyal = vals.join(',') === '10,11,12,13,14'
    name = isRoyal ? 'Royal Flush' : 'Straight Flush'
  }
  else if (counts[0] === 4) {
    const quadRank = Object.keys(rc).find(r => rc[r] === 4)
    name = (parseInt(quadRank) === 14) ? 'Quad Aces' : 'Four of a Kind'
  }
  else if (counts[0] === 3 && counts[1] === 2) name = 'Full House'
  else if (isFlush) name = 'Flush'
  else if (isStr) name = 'Straight'
  else if (counts[0] === 3) name = 'Three of a Kind'
  else if (counts[0] === 2 && counts[1] === 2) name = 'Two Pair'
  else if (counts[0] === 2) name = 'One Pair'
  else name = 'High Card'

  return { 
    rank: name, 
    desc: COMBOS_CH5.find(c => c.name === name)?.desc || '',
    flavor: FLAVOR_MAP[5][name] || ''
  }
}

/**
 * Main evaluate function
 * @param {Array} hand - Array of { suit, rank } card objects
 * @param {number} chapterId - The chapter ID (1-5)
 * @returns {{ rank: string, desc: string, flavor: string }}
 */
export function evaluate(hand, chapterId) {
  const ch = chapterId ?? hand.length
  switch (ch) {
    case 1: return evaluateCh1(hand)
    case 2: return evaluateCh2(hand)
    case 3: return evaluateCh3(hand)
    case 4: return evaluateCh4(hand)
    case 5: return evaluateCh5(hand)
    default: return evaluateCh5(hand)
  }
}