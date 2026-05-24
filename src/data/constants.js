export const SUITS = [
  { name: 'Spades',   sym: '♠', color: 'black' },
  { name: 'Clubs',    sym: '♣', color: 'black' },
  { name: 'Hearts',   sym: '♥', color: 'red'   },
  { name: 'Diamonds', sym: '♦', color: 'red'   },
]

export const RANKS = [
  { l: 'A',  n: 'Ace',   v: 14 },
  { l: '2',  n: 'Two',   v: 2  },
  { l: '3',  n: 'Three', v: 3  },
  { l: '4',  n: 'Four',  v: 4  },
  { l: '5',  n: 'Five',  v: 5  },
  { l: '6',  n: 'Six',   v: 6  },
  { l: '7',  n: 'Seven', v: 7  },
  { l: '8',  n: 'Eight', v: 8  },
  { l: '9',  n: 'Nine',  v: 9  },
  { l: '10', n: 'Ten',   v: 10 },
  { l: 'J',  n: 'Jack',  v: 11 },
  { l: 'Q',  n: 'Queen', v: 12 },
  { l: 'K',  n: 'King',  v: 13 },
]

export const CHAPTERS = [
  { id: 1, name: 'Chapter I',   cards: 1 },
  { id: 2, name: 'Chapter II',  cards: 2 },
  { id: 3, name: 'Chapter III', cards: 3 },
  { id: 4, name: 'Chapter IV',  cards: 4 },
  { id: 5, name: 'Chapter V',   cards: 5 },
]

// Each combo: { name, desc, count }
// Chapter 1 (52 total)
export const COMBOS_CH1 = [
  { name: 'Ace of Spades',     desc: 'The most iconic card in the deck.', count: 1 },
  { name: 'Stray Bullets',     desc: 'The Aces are deadly, but they\'re flying alone.', count: 3 },
  { name: 'Paint Cards',       desc: 'Refers to the colored ink used to print the Royal cards.', count: 12 },
  { name: 'Pip Cards',         desc: 'Small and easily countable.', count: 36 },
]

// Chapter 2 (1,326 total)
export const COMBOS_CH2 = [
  { name: 'Kalashnikovs',      desc: 'Ace and King of the same suit. ', count: 4 },
  { name: 'Pocket Rockets',    desc: 'A pair of Aces in your pocket.', count: 6 },
  { name: 'Big Slicks',        desc: 'Ace and King of different suits.', count: 12 },
  { name: 'Suited Connectors', desc: 'Two consecutive ranks of the same suit.', count: 48 },
  { name: 'Pocket Pairs',      desc: 'Any pair of matching ranks.', count: 72 },
  { name: 'Connectors',        desc: 'Two consecutive ranks.', count: 144 },
  { name: 'Suited',            desc: 'Two cards of the same suit.', count: 260 },
  { name: 'High Card',         desc: 'Sometimes, luck just isn\'t on your side.', count: 780 },
]

// Chapter 3 (22,100 total)
export const COMBOS_CH3 = [
  { name: 'Triple Aces',       desc: 'Three Aces on the flop.', count: 4 },
  { name: 'Royal Flush',       desc: 'Ace, King and Queen all suited.', count: 4 },
  { name: 'Monotone Straight', desc: 'Three consecutive cards of the same suit.', count: 44 },
  { name: 'Three of a Kind',   desc: 'Three cards of the same rank.', count: 48 },
  { name: 'Rainbow Straight',  desc: 'Colorful and connected.', count: 288 },
  { name: 'Two-Tone Straight', desc: 'Three consecutive cards, two sharing a suit.', count: 432 },
  { name: 'Monotone Flop',     desc: 'All three cards share the same suit.', count: 1096 },
  { name: 'Paired Flop',       desc: 'A pair on the board.', count: 3744 },
  { name: 'Rainbow Flop',      desc: 'Three cards of different suits.', count: 6576 },
  { name: 'Two-Tone Flop',     desc: 'Two cards share a suit, the third is different.', count: 9864 },
]

// Chapter 4 (270,725 total)
export const COMBOS_CH4 = [
  { name: 'Quad Aces',         desc: 'All four Aces in one hand.', count: 1 },
  { name: 'Royal Flush',       desc: 'Ace, King, Queen, and Jack all suited.', count: 4 },
  { name: 'Four of a Kind',    desc: 'Four cards of the same rank.', count: 12 },
  { name: 'Straight Flush',    desc: 'Four consecutive cards of the same suit.', count: 40 },
  { name: 'Broadway Straight', desc: 'Ace, King, Queen, and Jack offsuit.', count: 252 },
  { name: 'Three of a Kind',   desc: 'Three cards of the same rank.', count: 2496 },
  { name: 'Straight',          desc: 'Four consecutive ranks of mixed suits.', count: 2520 },
  { name: 'Two Pair',          desc: 'Two distinct pairs.', count: 2808 },
  { name: 'Flush',             desc: 'All four cards of the same suit.', count: 2816 },
  { name: 'Jacks or Better',   desc: 'A pair of Jacks, Queens, Kings, or Aces.', count: 25344 },
  { name: 'Low Pair',          desc: 'A pair of Tens or lower.', count: 57024 },
  { name: 'High Card',         desc: 'Sometimes, luck just isn\'t on your side.', count: 177408 },
]

// Chapter 5 (2,598,960 total)
export const COMBOS_CH5 = [
  { name: 'Royal Flush',       desc: 'Ace, King, Queen, Jack, and Ten all suited.', count: 4 },
  { name: 'Straight Flush',    desc: 'Five consecutive cards of the same suit.', count: 36 },
  { name: 'Quad Aces',         desc: 'All four Aces in one hand.', count: 48 },
  { name: 'Four of a Kind',    desc: 'Four cards of the same rank.', count: 576 },
  { name: 'Full House',        desc: 'Three of a kind and a pair.', count: 3744 },
  { name: 'Flush',             desc: 'Five cards of the same suit.', count: 5108 },
  { name: 'Straight',          desc: 'Five consecutive ranks of mixed suits.', count: 10200 },
  { name: 'Three of a Kind',   desc: 'Three cards of the same rank.', count: 54912 },
  { name: 'Two Pair',          desc: 'Two distinct pairs.', count: 123552 },
  { name: 'One Pair',          desc: 'Two cards of the same rank.', count: 1098240 },
  { name: 'High Card',         desc: 'Sometimes, luck just isn\'t on your side.', count: 1301520 },
]

// Map chapter ID to combo arrays (names only for backward compat)
export const COMBOS_BY_CHAPTER = {
  1: COMBOS_CH1.map(c => c.name),
  2: COMBOS_CH2.map(c => c.name),
  3: COMBOS_CH3.map(c => c.name),
  4: COMBOS_CH4.map(c => c.name),
  5: COMBOS_CH5.map(c => c.name),
}

// Full combo details by chapter
export const COMBO_DETAILS_BY_CHAPTER = {
  1: COMBOS_CH1,
  2: COMBOS_CH2,
  3: COMBOS_CH3,
  4: COMBOS_CH4,
  5: COMBOS_CH5,
}

// Keep COMBOS as an alias for chapter 5 so existing evaluate.js still works
export const COMBOS = COMBOS_BY_CHAPTER[5]