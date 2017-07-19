import 'normalize.css';
import './scss/style.scss';
import './scss/dice.scss';
import './scss/random.scss';
import './scss/cube.scss';
import './scss/market.scss';

import Mode from './js/mode';
import {
  CUBES_CONTAINER,
  PROBABILITY_CONTAINER,
  MARKET_CONTAINER,
  CUBE_RESULT_CONTAINER,
  EXECUTE_BUTTON_ID,
  hideAll,
  setDisplay,
  setValue,
  getValue
} from './js/uiHelper';

import { Probability } from './js/probability'
import { Market } from './js/market';
import * as random from 'lodash.random';

const THROW_CUBE_BUTTON_TEXT = 'Бросить кубики ;)';
const MARKET_BUTTON_TEXT = 'Тянуть карту';
const CUBE_DELAY = 3000;
let selectedMode = 0;

window.onload = function () {
  setValue(EXECUTE_BUTTON_ID, THROW_CUBE_BUTTON_TEXT);
  selectedMode = Mode.cubes;
}

export function setMode(mode) {
  selectedMode = mode;
  hideAll();

  switch (mode) {
    case Mode.cubes: {
      setValue(EXECUTE_BUTTON_ID, THROW_CUBE_BUTTON_TEXT);
      setDisplay(CUBES_CONTAINER, 'flex');
      break;
    }
    case Mode.probability: {
      setValue(EXECUTE_BUTTON_ID, THROW_CUBE_BUTTON_TEXT);
      setDisplay(PROBABILITY_CONTAINER, 'block');
      break;
    }
    case Mode.market: {
      setValue(EXECUTE_BUTTON_ID, MARKET_BUTTON_TEXT);
      setDisplay(MARKET_CONTAINER, 'flex');
      break;
    }
    default: break;
  }
}

export function execute() {
  switch (selectedMode) {
    case Mode.cubes: {
      executeCubes();
      break;
    }
    case Mode.probability: {
      executeProbability();
      break;
    }
    case Mode.market: {
      executeMarket();
      break;
    }
    default: break;
  }
}

function executeCubes() {
  const result = random(1, 16);

  setValue(CUBE_RESULT_CONTAINER, result);
  setDisplay(CUBE_RESULT_CONTAINER, 'flex');
}

function executeProbability() {
  const resultContainerId = 'random-result';
  const diceContainerId = 'random-dice';

  const probability = new Probability();
  const teamLevel = +getValue('team-level');
  const benefit = +getValue('random-benefit');

  const result = probability.getChance(teamLevel);

  if (!result) return;

  if (benefit) {
    const benefitValue = probability.calculateBenefitValue(benefit, result.fail);
    setValue('random-benefit-value', `${benefitValue} е.т.`);
  }

  setValue('random-fail', `${result.fail}% ошибок`);

  setDisplay(resultContainerId, 'none');
  setDisplay(diceContainerId, 'block');

  setTimeout(() => {
    setDisplay(diceContainerId, 'none');
    setDisplay(resultContainerId, 'flex');
  }, CUBE_DELAY);
}

function executeMarket() {
  const salesInputId = 'market-sales';
  const cardsInputId = 'market-cards';
  const salesResultId = 'market-sales-result';
  const cardsResultId = 'market-cards-result';  

  const market = new Market();
  const salesValue = +getValue(salesInputId);
  const cardsValue = +getValue(cardsInputId);

  if (salesValue) {
    const salesResult = market.getSalesResult(salesValue);
    setValue(salesResultId, `${salesResult} продажи`);
    setDisplay(salesResultId, 'flex');
  }
  
  if (cardsValue) {
    const сardsResult = market.getCarsResult(cardsValue);
    setValue(cardsResultId, `${сardsResult} карты`);
    setDisplay(cardsResultId, 'flex');
  }
}