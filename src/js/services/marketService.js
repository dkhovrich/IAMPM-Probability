import random from 'lodash/random';
import CardValue from '../models/cardValue';
import {
	EXECUTE_BUTTON_ID,
	MARKET_BUTTON_TEXT,
	CUBE_DELAY,
	setDisplay,
	setValue,
	getValue
} from './uiHelper';

const MARKET_CONTAINER_ID = 'market-container';
const MARKET_CONTAINER_RESULT_ID = 'market-container-result';
const MARKET_CARD_ID = 'market-card';
const SALES_INPUT_ID = 'market-sales';
const CARDS_INPUT_ID = 'market-cards';
const SALES_RESULT_ID = 'market-sales-result';
const CARDS_RESULT_ID = 'market-cards-result';

export default class MarketService {
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

	show() {
		setValue(EXECUTE_BUTTON_ID, MARKET_BUTTON_TEXT);
		setDisplay(MARKET_CONTAINER_ID, 'block');
	}

	hide() {
		setDisplay(MARKET_CONTAINER_ID, 'none');
	}

	execute() {
		const salesValue = +getValue(SALES_INPUT_ID);
		const cardsValue = +getValue(CARDS_INPUT_ID);
		setDisplay(MARKET_CONTAINER_RESULT_ID, 'none');
		setDisplay(MARKET_CARD_ID, 'block');

		if (salesValue) {
			setTimeout(() => {
				const salesResult = this.getSalesResult(salesValue);
				setValue(SALES_RESULT_ID, `${salesResult}`);
				setDisplay(MARKET_CONTAINER_RESULT_ID, 'flex');
				setDisplay(MARKET_CARD_ID, 'none');
			}, CUBE_DELAY);
		}

		if (cardsValue) {
			setTimeout(() => {
				const сardsResult = this.getCarsResult(cardsValue);
				setValue(CARDS_RESULT_ID, `${сardsResult}`);
				setDisplay(MARKET_CONTAINER_RESULT_ID, 'flex');
				setDisplay(MARKET_CARD_ID, 'none');
			}, CUBE_DELAY);
		}
	}

	getSalesResult(salesInputVal) {
		const index = random(0, this.sales.length - 1);
		return Math.round(salesInputVal * this.sales[index] / 100);
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