export function initObjects() {
	const obj = this.constructorData;

	function makeObjectChoice(array) {
		const choices = [];

		array.forEach((el) => {
			const parent = el.parentNode;
			const title = parent.querySelector(".findstore__title");

			choices.push({
				wrapper: el,
				element: parent,
				title: title,
				titleText: title.querySelector("span"),
				choices: [],
				label: title.textContent,
				active: false,

				getActiveBtns: function () {
					return this.wrapper.querySelectorAll(".active");
				},

				unActive: function () {
					this.element.classList.remove("active");
					this.active = false;
				},

				addActive: function () {
					this.element.classList.add("active");
					this.active = true;
				},

				addChecked: function (btn) {
					if (this.getActiveBtns().length >= 1) {
						this.titleText.textContent += `, ${btn.textContent}`;
					} else {
						this.titleText.textContent = btn.textContent;
					}

					btn.classList.add("active");
					this.title.classList.add("checked");
				},

				removeChecked: function (btn) {
					if (this.getActiveBtns().length > 1) {
						const text = this.titleText.textContent;
						let replacebleText = `, ${btn.textContent}`;

						if (!text.includes(replacebleText)) {
							replacebleText = `${btn.textContent}, `;
						}

						this.titleText.textContent = this.title.textContent.replace(replacebleText, "");
					} else {
						this.titleText.textContent = this.label;
						this.title.classList.remove("checked");
					}

					btn.classList.remove("active");
				},
			});
		});

		return choices;
	}

	this.choicesArray = makeObjectChoice([obj.country, obj.city, obj.street]);
}
