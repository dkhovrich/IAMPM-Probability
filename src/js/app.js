import 'normalize.css';
import '../scss/style.scss';
import '../scss/dice.scss';
import '../scss/random.scss';
import '../scss/cube.scss';
import '../scss/market.scss';

import Mode from './models/mode';
import {
	EXECUTE_BUTTON_ID,
	THROW_CUBE_BUTTON_TEXT,
	setValue
} from './services/uiHelper';

import ProbabilityService from './services/probabilityService';
import MarketService from './services/marketService';
import CubesService from './services/cubesService';

const services = new Map([
	[Mode.cubes, new CubesService()],
	[Mode.probability, new ProbabilityService()],
	[Mode.market, new MarketService()]
]);

let currentService;

window.onload = function () {
	setValue(EXECUTE_BUTTON_ID, THROW_CUBE_BUTTON_TEXT);
	currentService = services.get(Mode.cubes);
};

export function setMode(mode) {
	for (let service of services.values()) {
		service.hide();
	}

	currentService = services.get(mode);
	currentService.show();
}

export function execute() {
	currentService.execute();
}