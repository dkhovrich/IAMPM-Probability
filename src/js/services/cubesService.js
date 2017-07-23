import random from 'lodash/random';
import {
  EXECUTE_BUTTON_ID,
  THROW_CUBE_BUTTON_TEXT,
  CUBE_DELAY,
  setDisplay,
  setValue
} from './uiHelper';

const CUBES_CONTAINER_ID = 'cubes-container';
const CUBE_RESULT_CONTAINER_ID = 'cube-result';
const DICE_CONTAINER_ID = 'cube-dice';

export default class CubesService {
  show() {
    setValue(EXECUTE_BUTTON_ID, THROW_CUBE_BUTTON_TEXT);
    setDisplay(CUBES_CONTAINER_ID, 'flex');
  }

  hide() {
    setDisplay(CUBES_CONTAINER_ID, 'none');
  }

  execute() {
    const result = random(1, 12);

    setDisplay(DICE_CONTAINER_ID, 'block');
    setDisplay(CUBE_RESULT_CONTAINER_ID, 'none');

    setTimeout(() => {
      setDisplay(DICE_CONTAINER_ID, 'none');
      setDisplay(CUBE_RESULT_CONTAINER_ID, 'flex');
      setValue(CUBE_RESULT_CONTAINER_ID, result);
    }, CUBE_DELAY);
  }
}