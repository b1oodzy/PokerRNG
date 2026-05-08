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
 
// Combos per chapter — fill in chapters 1-4 when ready
export const COMBOS_BY_CHAPTER = {
  1: ['High Card'],
  2: ['High Card'],       // placeholder
  3: ['High Card'],       // placeholder
  4: ['High Card'],       // placeholder
  5: [
    'Royal Flush',
    'Straight Flush',
    'Four of a Kind',
    'Full House',
    'Flush',
    'Straight',
    'Three of a Kind',
    'Two Pair',
    'One Pair',
    'High Card',
  ],
}
 
// Keep COMBOS as an alias for chapter 5 so existing evaluate.js still works
export const COMBOS = COMBOS_BY_CHAPTER[5]