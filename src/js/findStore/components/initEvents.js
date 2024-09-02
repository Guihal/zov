import { brandBtnsEvent, choiceEvents, openChoices } from "./events";

export function initEvents() {
	this.openChoices = openChoices.bind(this);
	this.choiceEvents = choiceEvents.bind(this);
	this.brandBtnsEvent = brandBtnsEvent.bind(this);

	this.openChoices();
	this.choiceEvents();
	this.brandBtnsEvent();
}
