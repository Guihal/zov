export function removeCheckState(element) {
	element.classList.remove("checked");
}

export function addCheckState(element) {
	element.classList.add("checked");
}

export function hideElement(element) {
	element.classList.add("hidden-display");
}

export function showElement(element) {
	element.classList.remove("hidden-display");
}

export function addActive(element) {
	element.classList.add("active");

	return true;
}

export function removeActive(element) {
	element.classList.remove("active");

	return false;
}

export function resetChoice(obj) {
	obj.title.textContent = obj.label;
	this.removeCheckState(obj.title);
}

export function setChoice(obj, title) {
	obj.title.textContent = title;
	this.addCheckState(obj.title);
}

export function unactiveChoice(obj, title) {
	obj.title.textContent = title;
	this.addCheckState(obj.title);
}
