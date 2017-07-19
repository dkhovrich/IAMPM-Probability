export const CUBES_CONTAINER = 'cubes-container';
export const PROBABILITY_CONTAINER = 'probability-container';
export const MARKET_CONTAINER = 'market-container';
export const CUBE_RESULT_CONTAINER = 'cube-result';
export const EXECUTE_BUTTON_ID = 'executeButton';

export function hideAll() {
  setDisplay(CUBES_CONTAINER, 'none');
  setDisplay(PROBABILITY_CONTAINER, 'none');
  setDisplay(MARKET_CONTAINER, 'none');
}

export function setDisplay(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.style.display = value;
  }
}

export function setValue(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.innerHTML = value;
  }
}

export function getValue(id) {
  const element = document.getElementById(id);
  return element ? element.value : null;
}