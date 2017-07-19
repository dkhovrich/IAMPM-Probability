import * as random from 'lodash.random';

class CardValue {
  constructor(value, isPositive) {
    this.value = value;
    this.isPositive = isPositive;
  }
}

export class Market {
  constructor() {
    this.sales = [0, 10, 20, 40, 80, 100, 120, 140, 180, 200];
    this.cards = [
      new CardValue(0, false),
      new CardValue(1, false),
      new CardValue(2, false),
      new CardValue(4, false),
      new CardValue(8, false),
      new CardValue(8, true),
      new CardValue(4, true),
      new CardValue(2, true),
      new CardValue(1, true),
      new CardValue(0, true)
    ];
  }

  getSalesResult(salesInputVal) {
    const index = random(0, this.sales.length - 1);
    return salesInputVal - Math.round(salesInputVal * this.sales[index] / 100);
  }

  getCarsResult(cardsInputVal) {
    const index = random(0, this.cards.length - 1);
    const card = this.cards[index];

    if (card.value === 0) {
      return card.isPositive ? cardsInputVal : 0;
    } else {
      return card.isPositive ? cardsInputVal + card.value : cardsInputVal - card.value;
    }
  }
}