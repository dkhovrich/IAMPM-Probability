import { Chance } from './chance';
import * as random from 'lodash.random';

const LEVEL_ZERO_CHANCES = [new Chance(100), new Chance(80), new Chance(60), new Chance(40), new Chance(20), new Chance(0)];
const LEVEL_FIRST_CHANCES = [new Chance(80), new Chance(60), new Chance(40), new Chance(20), new Chance(0)];
const LEVEL_SECOND_CHANCES = [new Chance(60), new Chance(40), new Chance(20), new Chance(0)];
const LEVEL_THIRD_CHANCES = [new Chance(40), new Chance(20), new Chance(0)];

export class Probability {
  constructor() {
    this.chanceMap = new Map([
      [0, LEVEL_ZERO_CHANCES],
      [1, LEVEL_FIRST_CHANCES],
      [2, LEVEL_SECOND_CHANCES],
      [3, LEVEL_THIRD_CHANCES]
    ]);
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