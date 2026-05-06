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
 
export const COMBOS = [
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
]