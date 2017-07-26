export const EXECUTE_BUTTON_ID = 'executeButton';
export const THROW_CUBE_BUTTON_TEXT = 'Бросить кубики';
export const MARKET_BUTTON_TEXT = 'Тянуть карту';
export const CUBE_DELAY = 3000;

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