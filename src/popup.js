function show(el, tr, dspl) {
	el.style.transition = "all " + tr + "ms ease ";
	el.style.cssText += "display: " + dspl + " !important";
	setTimeout(() => {
		el.style.opacity = 1;
	}, 50);
}

function hide(el, tr) {
	el.style.transition = "all " + tr + "ms ease ";
	el.style.opacity = 0;
	setTimeout(() => {
		el.style.cssText += "display: none !important";
	}, tr);
}

function centerPopup(popin) {
	const popinEl = document.querySelector(popin);
	if (!popinEl) return;
	if (popinEl.offsetHeight + 40 > window.innerHeight) return;
	let delta = (window.innerHeight - popinEl.offsetHeight) / 2;
	popinEl.style.marginTop = window.innerWidth > 640 ? delta + "px" : "20px";
	popinEl.style.marginBottom = window.innerWidth > 640 ? delta + "px" : "20px";
}

function popupInit(el, popin, btn_init, btn_close, tr, dspl, wpcf) {
	checkboxCustom(el + " .form-row label", el + " .form-row label input", el + " .form-row label svg");
	const pop = document.querySelector(el);
	if (!pop) return;
	let pass = true;

	const popupEv = (ev) => {
		ev.preventDefault();
		if (!pass) return;
		pass = false;
		document.querySelectorAll(".popup--show:not(.quiz)").forEach((pop) => {
			pop.classList.remove("popup--show");
			hide(pop, tr);
		});
		pop.classList.add("popup--show");
		document.documentElement.style.overflow = "hidden";
		show(pop, tr, dspl);
		centerPopup(popin);
		setTimeout(() => {
			pass = true;
		}, tr);
	};

	if (pop.querySelector(".hidden-for")) {
		const form = pop.querySelector(".wpcf7");
		if (form) {
			form.addEventListener("wpcf7submit", () => {
				submitWpCf(pop);
			});
		}
	}

	const productTitle = document.querySelector("h1.product_title");
	const inputHiddenPopup = pop.querySelector('[name="nameproduct"]');

	if (productTitle && inputHiddenPopup) {
		inputHiddenPopup.value = productTitle.textContent;
		console.log(inputHiddenPopup.value);
	}

	const closeEv = () => {
		pop.classList.remove("popup--show");
		hide(pop, tr);
		document.documentElement.style.overflow = "auto";
	};

	document.querySelectorAll(btn_init).forEach((btn) => {
		btn.addEventListener("click", popupEv);
	});

	document.querySelectorAll(btn_close).forEach((btn) => {
		btn.addEventListener("click", closeEv);
	});
}

function checkboxCustom(checkQ, inp, svg) {
	const check = document.querySelectorAll(checkQ + ":not(.propped)");
	check.forEach((el) => {
		el.classList.add("propped");
		const checkInp = el.querySelector(inp);
		const checkInpSvg = el.querySelector(svg);
		if (!checkInp || !checkInpSvg) return;
		el.dataset.checkState = "false";

		el.addEventListener("click", () => {
			el.dataset.checkState == "false" ? (el.dataset.checkState = "true") : (el.dataset.checkState = "false");
		});

		checkInp.addEventListener("click", (ev) => {
			ev.stopPropagation();
		});
	});
}
