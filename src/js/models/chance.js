export default class Chance {
  constructor(fail) {
    this.fail = fail;
    this.win = 100 - fail;
  }
}