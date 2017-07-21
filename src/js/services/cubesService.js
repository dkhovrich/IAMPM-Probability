import random from 'lodash/random';
import {
  EXECUTE_BUTTON_ID,
  THROW_CUBE_BUTTON_TEXT,
  setDisplay,
  setValue
} from './uiHelper';

const CUBES_CONTAINER_ID = 'cubes-container';
const CUBE_RESULT_CONTAINER_ID = 'cube-result';

export default class CubesService {
  show() {
    setValue(EXECUTE_BUTTON_ID, THROW_CUBE_BUTTON_TEXT);
    setDisplay(CUBES_CONTAINER_ID, 'flex');
  }

  hide() {
    setDisplay(CUBES_CONTAINER_ID, 'none');
  }

  execute() {
    const result = random(1, 16);

    setValue(CUBE_RESULT_CONTAINER_ID, result);
    setDisplay(CUBE_RESULT_CONTAINER_ID, 'flex');
  }
}