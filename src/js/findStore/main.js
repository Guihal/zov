import { elementReady } from "../utils/elementReady";
import { addChoices } from "./components/addChoices";
import { getDataActive } from "./components/getDataActive";
import { hideActiveChoice } from "./components/hideActiveChoice";
import { initEvents } from "./components/initEvents";
import { initObjects } from "./components/initObjects";
import { addCheckState, removeCheckState, hideElement, showElement, addActive, removeActive, resetChoice, setChoice } from "./components/states";

export async function storeInit() {
	const [country, city, street, storesCon, section] = await Promise.all([elementReady("#country"), elementReady("#city"), elementReady("#street"), elementReady(".findstore__stores"), elementReady(".findstore__section")]);

	const cards = section.querySelectorAll(".findstore");
	const brands = section.querySelectorAll(".findstore__brand-btn");

	const store = new FindStore({
		section: section,
		country: country,
		city: city,
		street: street,
		storesContainer: storesCon,
		cards: cards,
		brands: brands,
	});
}

class FindStore {
	constructorData;
	section;
	cards;
	brands;
	storesContainer;

	constructor(obj) {
		this.constructorData = obj;

		this.initVariables();
		this.initObjects();
		this.addChoices();
		this.addStars();
		this.initEvents();
	}

	initVariables = () => {
		const obj = this.constructorData;

		this.section = obj.section;
		this.cards = obj.cards;
		this.brands = obj.brands;
		this.storesContainer = obj.storesContainer;
	};

	getActive = getDataActive.bind(this);
	addChoices = addChoices.bind(this);
	initObjects = initObjects.bind(this);
	initEvents = initEvents.bind(this);
	resetChoice = resetChoice.bind(this);
	setChoice = setChoice.bind(this);
	hideActiveChoice = hideActiveChoice.bind(this);
	addStars() {
		this.cards.forEach((str) => {
			const star = str.querySelector(".findstore__stars");
			const starNumber = Number(star.dataset.stars);
			for (let i = 1; i <= 5; i++) {
				const starClass = starNumber >= i ? "active" : "";

				star.innerHTML += `<svg class="${starClass}" width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M16.7364 11.9887L17.4726 12.6655L16.7364 11.9887C16.343 12.4166 16.1553 12.9945 16.222 13.5719L16.8563 19.0606L11.8323 16.7612C11.3038 16.5193 10.6962 16.5193 10.1677 16.7612L5.14366 19.0606L5.778 13.5719C5.84473 12.9945 5.65697 12.4166 5.26359 11.9887L1.52424 7.92114L6.9403 6.82834C7.51006 6.71338 8.00163 6.35623 8.28703 5.84988L11 1.03659L13.713 5.84988L14.5841 5.35886L13.713 5.84988C13.9984 6.35623 14.4899 6.71338 15.0597 6.82834L20.4758 7.92114L16.7364 11.9887Z" fill="#FFCE31" stroke="#FFCE31" stroke-width="2"/>
					</svg>`;
			}
		});
	}

	removeCheckState = removeCheckState;
	addCheckState = addCheckState;
	hideElement = hideElement;
	showElement = showElement;
	addActive = addActive.bind(this);
	removeActive = removeActive.bind(this);
}
