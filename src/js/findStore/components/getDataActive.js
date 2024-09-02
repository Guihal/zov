export function getDataActive() {
	const activeCountry = this.choicesArray[0].wrapper.querySelectorAll(".findstore__choice-item.active");
	const activeCity = this.choicesArray[1].wrapper.querySelectorAll(".findstore__choice-item.active");
	const activeStreet = this.choicesArray[2].wrapper.querySelectorAll(".findstore__choice-item.active");
	const activeBrand = this.section.querySelector(".findstore__brand-btn.active");

	function getDataset(array, dataName) {
		const data = [];

		array.forEach((el) => {
			data.push(el.dataset[dataName]);
		});

		return data;
	}

	return {
		country: activeCountry ? getDataset(activeCountry, "country") : false,
		city: activeCity ? getDataset(activeCity, "city") : false,
		street: activeStreet ? getDataset(activeStreet, "street") : false,
		brand: activeBrand ? activeBrand.dataset.brand : false,
	};
}
