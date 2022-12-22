import shuffle from 'just-shuffle';

const deck = ['AC', '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', 'JC', 'QC', 'KC', 'AD', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', 'JD', 'QD', 'KD', 'AH', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', 'JH', 'QH', 'KH', 'AS', '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', 'JS', 'QS', 'KS'];

export function freshDeck() : string[] {
  return deck;
}

export function shuffledDeck() : string[] {
  return shuffle(deck);
}

/*
  returns: array of given number of cards
 */
export function deal(deck : string[], number: number):string[] {
  return deck.splice(0, number);
}

/*
  hand: array of cards to be mutated
  discards: array of indexes within hand to replace
  mutates: updated hand
 */
export function discard(hand : string[], discards : number[], deck: string[]) : void {
  discards.forEach((val : number) => {
    const newCard = deck.shift();

    if (newCard != null) {
      hand.splice(val, 1, newCard);
    }
  });
}

const getNumericValue = (value : string) : number => {
  if (value === 'A') return 14;
  if (value === 'K') return 13;
  if (value === 'Q') return 12;
  if (value === 'J') return 11;
  return parseInt(value, 10);
}

export function sortedHand(hand : string[]) : { suit: string | undefined; value: number }[] {
  const cards: { suit: string | undefined; value: number }[] = hand.map(card => {
    const suit = card.slice(-1);
    const stringValue = card.slice(-3, -1);
    const value = getNumericValue(stringValue);

    return { suit, value };
  });

  return cards.sort((a, b) => a.value - b.value);
}

export function sortedString(cards) : string[] {
  cards.forEach(card => {
    switch(card.value) {
      case 14:
        card.value = 'A';
        break;
      case 13:
        card.value = 'K';
        break;
      case 12:
        card.value = 'Q';
        break;
      case 11:
        card.value = 'J';
        break;
      default:
        card.value = card.value.toString();
    }
  });
  
  return cards.map(card => `${card.value}${card.suit}`);
}

export function isFlush(cards) : boolean {
  const firstSuit = cards[0].suit;
  return cards.every(card => card.suit === firstSuit);
}

export function isStraight(hand) : boolean {
  const values = hand.map(card => card.value);
  
  function checkForStraight(vals) {
    return vals.every((value, index, array) => {
      if (index === 0) return true;
      return array[index - 1] === value - 1;
    });
  }
  
  // typical straight
  if (checkForStraight(values)) {
    return true;
  }
  
  // low straight
  if (values[4] === 14) {
    let copy = values.slice();
    copy.pop();
    copy.unshift(1);
    return checkForStraight(copy);
  }
  
  return false;
}

/*
* Converts to array of arrays for each pair, three-of-a-kind, and four-of-a-kind
* */
export function groups(cards) : number[] {
  const values = cards.map(card => card.value);
  let result = [];

  for (let i = 1; i <= 14; i++) {
    let pairOrHigher = values.filter(val => val === i);
    if (pairOrHigher.length > 1) {
      result.push(pairOrHigher);
    }
  }
  return result;
}

/*
  hand: array of five cards
  returns: highest value of hand
*/
export function evaluate(hand) : string {
  const sortedHand = module.exports.sortedHand(hand);
  
  const isFlush = module.exports.isFlush(sortedHand);
  const isStraight = module.exports.isStraight(sortedHand);
  
  if (isFlush && isStraight && sortedHand[0].value === 10) {
    return 'ROYAL_FLUSH';
  }
  
  if (isFlush && isStraight) {
    return 'STRAIGHT_FLUSH';
  }
  
  if (isFlush) {
    return 'FLUSH';
  }
  
  if (isStraight) {
    return 'STRAIGHT';
  }
  
  const groups = module.exports.groups(sortedHand);
  
  // four of a kind
  if (groups.length === 1 && groups[0].length === 4) {
    return 'FOUR_OF_A_KIND';
  }
  
  // full house
  if (groups.length === 2 && (
    (groups[0].length === 3 && groups[1].length === 2)
      || (groups[0].length === 2 && groups[1].length === 3))
  ) {
    return 'FULL_HOUSE';
  }
  
  // three of a kind
  if (groups.length === 1 && groups[0].length === 3) {
    return 'THREE_OF_A_KIND';
  }
  
  // two pair
  if (groups.length === 2 && groups[0].length === 2 && groups[1].length === 2) {
    return 'TWO_PAIR';
  }
  
  // jacks or better or one pair
  if (groups.length === 1 && groups[0].length === 2) {
    if (groups[0][0] >= 11) {
      return 'JACKS_OR_BETTER';
    }
    return 'ONE_PAIR';
  }
  
  // high card
  return 'HIGH_CARD';
}
