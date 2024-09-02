export function addChoices() {
	this.cards.forEach((card) => {
		const country = card.dataset.country;
		const city = card.dataset.city;
		const street = card.dataset.street;
		const brand = card.dataset.brand;

		if (!this.choicesArray[2].wrapper.querySelector(`[data-street="${street}"]`)) {
			this.choicesArray[2].wrapper.innerHTML += `<div class="findstore__choice-item" data-brand="${brand}" data-city="${city}" data-street="${street}" data-country="${country}">${street}</div>`;
		}

		if (!this.choicesArray[1].wrapper.querySelector(`[data-city="${city}"]`)) {
			this.choicesArray[1].wrapper.innerHTML += `<div class="findstore__choice-item" data-brand="${brand}" data-city="${city}" data-country="${country}">${city}</div>`;
		}

		if (!this.choicesArray[0].wrapper.querySelector(`[data-country="${country}"]`)) {
			this.choicesArray[0].wrapper.innerHTML += `<div class="findstore__choice-item" data-city="${city}" data-country="${country}">${country}</div>`;
		}
	});

	for (let i = 0; i < this.choicesArray.length; i++) {
		this.choicesArray[i].choices = this.choicesArray[i].wrapper.querySelectorAll(".findstore__choice-item");
	}
}
