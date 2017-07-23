import random from 'lodash/random';
import Chance from '../models/chance';
import {
  EXECUTE_BUTTON_ID,
  THROW_CUBE_BUTTON_TEXT,
  CUBE_DELAY,
  setDisplay,
  setValue,
  getValue
} from './uiHelper';

const PROBABILITY_CONTAINER_ID = 'probability-container';
const RESULT_CONTAINER_ID = 'random-result';
const DICE_CONTAINER_ID = 'random-dice';
const DICE_CONTAINER_ID_2 = 'random-dice2';
const TEAM_LEVEL_INPUT_ID = 'team-level';
const BENEFIT_INPUT_ID = 'random-benefit';
const BENEFIT_VALUE_ID = 'random-benefit-value';
const FAIL_VALUE_Id = 'random-fail';

const LEVEL_ZERO_CHANCES = [new Chance(100), new Chance(80), new Chance(60), new Chance(40), new Chance(20), new Chance(0)];
const LEVEL_FIRST_CHANCES = [new Chance(80), new Chance(60), new Chance(40), new Chance(20), new Chance(0)];
const LEVEL_SECOND_CHANCES = [new Chance(60), new Chance(40), new Chance(20), new Chance(0)];
const LEVEL_THIRD_CHANCES = [new Chance(40), new Chance(20), new Chance(0)];

export default class ProbabilityService {
  constructor() {
    this.chanceMap = new Map([
      [0, LEVEL_ZERO_CHANCES],
      [1, LEVEL_FIRST_CHANCES],
      [2, LEVEL_SECOND_CHANCES],
      [3, LEVEL_THIRD_CHANCES]
    ]);
  }

  show() {
    setValue(EXECUTE_BUTTON_ID, THROW_CUBE_BUTTON_TEXT);
    setDisplay(PROBABILITY_CONTAINER_ID, 'block');
  }

  hide() {
    setDisplay(PROBABILITY_CONTAINER_ID, 'none');
  }

  execute() {
    const teamLevel = +getValue(TEAM_LEVEL_INPUT_ID);
    const benefit = +getValue(BENEFIT_INPUT_ID);

    const result = this.getChance(teamLevel);
    if (!result) return;

    if (benefit) {
      const benefitValue = this.calculateBenefitValue(benefit, result.fail);
      setValue(BENEFIT_VALUE_ID, `${benefitValue} е.т.`);
    }

    setValue(FAIL_VALUE_Id, `${result.fail}% ошибок`);

    setDisplay(RESULT_CONTAINER_ID, 'none');
    setDisplay(DICE_CONTAINER_ID, 'block');
    setDisplay(DICE_CONTAINER_ID_2, 'block');

    setTimeout(() => {
      setDisplay(DICE_CONTAINER_ID, 'none');
      setDisplay(DICE_CONTAINER_ID_2, 'none');
      setDisplay(RESULT_CONTAINER_ID, 'flex');
    }, CUBE_DELAY);
  }

  getChance(level) {
    if (!this.chanceMap.has(level)) return null;

    const items = this.chanceMap.get(level);
    const index = random(0, items.length - 1);
    return items[index];
  }

  calculateBenefitValue(benefit, fail) {
    if (benefit < 0) {
      benefit *= -1;
    }

    return benefit - Math.round(benefit * fail / 100);
  }
}