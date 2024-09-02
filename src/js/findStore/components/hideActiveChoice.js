export function hideActiveChoice() {
	for (let i = 0; i < this.choicesArray.length; i++) {
		if (this.choicesArray[i].active) {
			this.choicesArray[i].unActive();
		}
	}
}
