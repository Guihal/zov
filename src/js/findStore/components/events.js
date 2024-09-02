export function openChoices() {
	for (let i = 0; i < this.choicesArray.length; i++) {
		// console.log(this.choicesArray[i].title);

		this.choicesArray[i].title.addEventListener("click", () => {
			if (this.choicesArray[i].active) {
				this.choicesArray[i].unActive();
			} else {
				this.hideActiveChoice();
				this.choicesArray[i].addActive();
			}
		});
	}
}

export function brandBtnsEvent() {
	unActiveBrandBtns = unActiveBrandBtns.bind(this);

	this.brands.forEach((btn) => {
		btn.addEventListener("click", () => {
			if (btn.classList.contains("active")) return;

			unActiveBrandBtns();
			this.addActive(btn);
			changeStateCards();
		});
	});

	if (this.brands.length === 0) return;

	this.brands[0].click();
}

export function choiceEvents() {
	unCheckedAll = unCheckedAll.bind(this);
	changeStateBtns = changeStateBtns.bind(this);
	changeStateCards = changeStateCards.bind(this);

	for (let i = 0; i < this.choicesArray.length; i++) {
		this.choicesArray[i].choices.forEach((btn) => {
			btn.addEventListener("click", () => {
				unCheckedAll(i + 1);

				if (btn.classList.contains("active")) {
					this.choicesArray[i].removeChecked(btn);
				} else {
					this.choicesArray[i].addChecked(btn);
				}

				changeStateBtns(i + 1);
				changeStateCards();
			});
		});
	}
}

function unActiveBrandBtns() {
	this.brands.forEach((btn) => {
		if (!btn.classList.contains("active")) return;

		this.removeActive(btn);
	});
}

function unCheckedAll(index) {
	if (index + 1 > this.choicesArray.length) return;

	for (let i = index; i < this.choicesArray.length; i++) {
		this.choicesArray[i].choices.forEach((btn) => {
			if (!btn.classList.contains("active")) return;

			this.choicesArray[i].removeChecked(btn);
		});
	}
}

function changeStateBtns(index) {
	if (index + 1 > this.choicesArray.length) return;

	const data = this.getActive();

	for (let i = index; i < this.choicesArray.length; i++) {
		this.choicesArray[i].choices.forEach((btn) => {
			if (getPass(btn, data)) {
				this.showElement(btn);
			} else {
				this.hideElement(btn);
			}
		});
	}
}

function changeStateCards() {
	const data = this.getActive();

	this.cards.forEach((card) => {
		if (getPass(card, data) && checkBrand(card, data)) {
			this.showElement(card);
		} else {
			this.hideElement(card);
		}
	});
}

function checkBrand(card, data) {
	if (card.dataset.brand === data.brand) return true;

	return false;
}

function getPass(element, data) {
	const checkProperty = (property) => {
		if (element.dataset[property] === undefined) return true;
		if (data[property].length === 0) return true;

		for (let i = 0; i < data[property].length; i++) {
			if (data[property][i] === element.dataset[property]) {
				return true;
			}
		}

		return false;
	};

	if (checkProperty("country") && checkProperty("city") && checkProperty("street")) {
		return true;
	} else {
		return false;
	}
}

// function changeStateChoices(){
// 	if()
// }
