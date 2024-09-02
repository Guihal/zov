function throttle(func, ms) {
	let isThrottled = false;
	let savedArgs;
	let savedThis;

	function wrapper() {
		if (isThrottled) {
			savedArgs = arguments;
			savedThis = this;
			return;
		}

		func.apply(this, arguments);

		isThrottled = true;

		setTimeout(function () {
			isThrottled = false;
			if (savedArgs) {
				wrapper.apply(savedThis, savedArgs);
				savedArgs = savedThis = null;
			}
		}, ms);
	}

	return wrapper;
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

function intTelInit() {
	document.querySelectorAll('[type="tel"]').forEach((el) => {
		if (el.closest(".registration")) return;
		const iti = window.intlTelInput(el, {
			initialCountry: "auto",
			useFullscreenPopup: false,
			geoIpLookup: function (callback) {
				fetch("https://ipinfo.io/json")
					.then((response) => response.json())
					.then((data) => callback(data.country))
					.catch(() => callback("us"));
			},
			utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
		});

		let mask = new IMask(el, { mask: `+{7} ({000) 000-00-00` });
		el.addEventListener("countrychange", function () {
			setTimeout(() => {
				mask.destroy();
				const data = iti.getSelectedCountryData();
				if (data.dialCode.length === 3) {
					mask = new IMask(el, { mask: `+{${data.dialCode}} ({00) 000-00-00` });
				} else {
					mask = new IMask(el, { mask: `+{${data.dialCode}} ({000) 000-00-00` });
				}
			}, 200);
		});
	});
}

function submitWpCf(pop) {
	pop.addEventListener("wpcf7submit", (ev) => {
		pop.classList.add("success");
	});
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

function makeSignUpBtn() {
	const loginSubmit = document.querySelector("#login-form .login-submit");
	if (!loginSubmit) return;
	let signUpLink = Object.assign(document.createElement("a"), { className: "sign-up-btn white-btn", innerHTML: "Sign up" });
	signUpLink.href = "/registration";
	loginSubmit.append(signUpLink);
}

function makeCustomLinkInLogin() {
	const loginRemember = document.querySelector("#login-form .login-remember");
	const loginForm = document.querySelector("#login-form #loginform");
	if (!loginForm || !loginRemember) return;
	let remindLinkAnother = Object.assign(document.createElement("a"), { className: "remind-link", innerHTML: "Forgot your password?" });
	remindLinkAnother.href = "/remind";
	window.innerWidth > 468 ? loginRemember.append(remindLinkAnother) : loginForm.append(remindLinkAnother);
}

function makeCustomCheckLogin() {
	const loginRemember = document.querySelector("#login-form .login-remember label");
	if (!loginRemember) return;
	let customCheck = Object.assign(document.createElement("div"), { className: "login__custom-checkbox", innerHTML: '<svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.5 1.13353L6.61443 12L0.5 4.52245L1.64432 3.38892L6.61443 9.46704L14.3557 0L15.5 1.13353Z" fill="#404040" /></svg>' });
	loginRemember.prepend(customCheck);
	customCheck.dataset.checkState = "false";
	customCheck.addEventListener("click", (ev) => {
		customCheck.dataset.checkState == "false" ? (customCheck.dataset.checkState = "true") : (customCheck.dataset.checkState = "false");
	});
}

function makePlaceholders() {
	const loginInp = document.querySelector("#login-form #user_login");
	const passInp = document.querySelector("#login-form #user_pass");
	if (!loginInp || !passInp) return;
	loginInp.placeholder = "Username";
	passInp.placeholder = "Password";
}

function initPopupAll() {
	intTelInit();
	makeSignUpBtn();
	makePlaceholders();
	makeCustomLinkInLogin();
	makeCustomCheckLogin();
}

async function addWcMl() {
	const wpML = await elementReady(".wcml-dropdown");

	if (document.querySelector(".curency__con")) return;
	const wpMLParent = wpML.parentNode;
	wpMLParent.style.display = "none";
	const curencyCon = document.createElement("div");
	curencyCon.classList.add("curency__con");

	const checkFilterChtoto = () => {
		if (window.innerWidth > 768 && window.innerWidth < 1200) {
			wpML.closest(".wpb_column").style.cssText = "width: calc(50% - 5px); margin-left: 5px;";
		} else {
			wpML.closest(".wpb_column").style.cssText = "";
		}
	};

	checkFilterChtoto();

	window.addEventListener("resize", throttle(checkFilterChtoto, 400));

	const curencyDropdown = document.createElement("div");
	curencyDropdown.classList.add("curency__dropdown");
	wpMLParent.querySelectorAll(".wcml-cs-submenu a").forEach((el) => {
		curencyDropdown.innerHTML += `<a rel="${el.rel}">${el.textContent}</a>`;
	});
	curencyCon.innerHTML = `
            <div class="curency__title">${wpMLParent.querySelector(".wcml-cs-item-toggle").textContent}</div>
        `;
	curencyCon.append(curencyDropdown);
	wpMLParent.parentNode.append(curencyCon);

	addEvForLink(wpMLParent);
	initCurenc(document.querySelector(".curency__title"));
}

function initCurenc(cur) {
	document.addEventListener("click", (ev) => {
		if (!ev.target.closest(".curency__con")) {
			cur.parentNode.classList.remove("active");
		}
	});
	cur.addEventListener("click", () => {
		if (cur.parentNode.classList.contains("active")) {
			cur.parentNode.classList.remove("active");
		} else {
			cur.parentNode.classList.add("active");
		}
	});
}

function addEvForLink(parent) {
	const hrefs = document.querySelectorAll(".curency__con a");
	hrefs.forEach((el) => {
		el.addEventListener("click", () => {
			parent.querySelector(`.wcml-dropdown [rel="${el.rel}"]`).click();
		});
	});
}

function createEl(quer, classBl) {
	const block = document.createElement(quer);
	block.classList.add(classBl);
	return block;
}

function rangeElInit() {
	const priceRange = document.querySelector(".wd-pf-price-range");
	if (!priceRange) return;
	priceRange.style.display = "none";
	const pricemax = document.querySelector('[name="max_price"]');
	const pricemin = document.querySelector('[name="min_price"]');

	if (!pricemax || !pricemin) return;

	if (document.querySelector(".filter-con").parentNode.querySelector(".quiz__wrapper-range")) return;

	document.querySelector(".filter-con").parentNode.innerHTML += `<div class="quiz__wrapper-range catalog__range">
          <div class="filter-title">Price level</div>
          <div class="quiz__range-active">
          <div class="quiz__range-item active quiz__range-active--left">
          <div class="quiz__range-item-number">${pricemin.dataset.min}</div>
          </div>
          <div class="quiz__range-item active quiz__range-active--right">
          <div class="quiz__range-item-number">${pricemax.dataset.max}</div>
          </div>
          </div>
          <div class="ipnrange_wr">
          <input type="range" class="min" min="${pricemin.dataset.min}" max="${pricemax.dataset.max}" value="${pricemin.value}"/>
          <input type="range" class="max" min="${pricemin.dataset.min}" max="${pricemax.dataset.max}" value="${pricemax.value}" />
          <div class="white"></div>
          <div class="gray"></div>
          </div>
        </div>`;

	document.querySelector('.filters-custom [type="submit"]').textContent = "confirm";

	document.querySelector(".filter-con").parentNode.append(document.querySelector(".filter-con").parentNode.querySelector("form"));
	quizPriceInp3();
}

function quizPriceInp3() {
	const inpMaxEl = document.querySelector(".filters-custom .max");
	const inpMinEl = document.querySelector(".filters-custom .min");
	const white = document.querySelector(".filters-custom .white");
	const gray = document.querySelector(".filters-custom .gray");
	const numberAct = document.querySelectorAll(".filters-custom .quiz__range-item-number");
	const max = document.querySelector('[name="max_price"]');
	const min = document.querySelector('[name="min_price"]');

	class CustomInput {
		constructor(input) {
			this.input = input;
			this.min = Number(this.input.min);
			this.max = Number(this.input.max);
		}

		getValue() {
			return Number(this.input.value);
		}

		setValue(value) {
			this.input.value = value;
		}
	}

	const inpMax = new CustomInput(inpMaxEl);
	const inpMin = new CustomInput(inpMinEl);

	const formatPrice = (value) => {
		let string = "";
		let counter = 0;

		for (let i = value.length - 1; i >= 0; i--) {
			if (counter === 3) {
				counter = 0;

				string = `${value[i]}.` + string;
			} else {
				string = value[i] + string;

				counter++;
			}
		}

		return string;
	};

	const numberFunc = () => {
		white.style.width = ((inpMin.getValue() - inpMin.min) / (inpMin.max - inpMin.min)) * 100 + "%";
		gray.style.width = ((inpMax.getValue() - inpMax.min) / (inpMax.max - inpMax.min)) * 100 + "%";

		numberAct[0].textContent = formatPrice(inpMin.input.value);
		numberAct[1].textContent = formatPrice(inpMax.input.value);
	};

	numberFunc();

	const width = inpMax.input.offsetWidth;

	const minValueGap = Math.ceil((10 / width) * (inpMax.max - inpMax.min));

	const getDelta = () => {
		return inpMax.getValue() - inpMin.getValue();
	};

	inpMax.input.addEventListener(
		"input",
		throttle(() => {
			if (getDelta() < minValueGap) {
				inpMax.input.value = inpMin.getValue() + minValueGap;
			}

			numberFunc();
		}, 1)
	);

	inpMin.input.addEventListener(
		"input",
		throttle(() => {
			if (getDelta() < minValueGap) {
				inpMin.input.value = inpMax.getValue() - minValueGap;
			}

			numberFunc();
		}, 1)
	);
}

function addResetFiltersPc() {
	const form = document.querySelector("form.wd-product-filters");
	const wdreset = document.querySelector(".wd-clear-filters");
	const formInner = document.querySelector("#filtr .liner-continer .custom-reset");

	if (!form || !wdreset) return;

	if (formInner) {
		formInner.remove();
	}

	if (document.querySelector(".custom-reset")) return;

	const customReset = Object.assign(document.createElement("div"), { innerHTML: `Reset filters <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.13297 6.17996C4.81691 4.99956 5.90653 4.10795 7.19893 3.67114C8.49134 3.23433 9.89845 3.28209 11.1583 3.80553C12.4181 4.32897 13.4447 5.29242 14.0471 6.51647C14.6494 7.74053 14.7863 9.14178 14.4324 10.4593C14.0785 11.7768 13.2578 12.9208 12.1232 13.6783C10.9886 14.4357 9.61735 14.7551 8.26482 14.5768C6.9123 14.3985 5.67066 13.7347 4.77111 12.7091C3.87155 11.6834 3.37539 10.3658 3.375 9.0016" stroke="#404040" stroke-width="0.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.89063 6.18945H4.07812V3.37695" stroke="#404040" stroke-width="0.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`, className: "custom-reset" });
	form.append(customReset);

	customReset.addEventListener("click", () => {
		if (wdreset) {
			wdreset.click();
		}
		document.querySelectorAll(".filter-btn.active").forEach((el) => {
			el.click();
		});
		form.querySelector('[type="submit"]').click();
	});
}

function addResetFiltersMobile() {
	const form = document.querySelector("#filtr .liner-continer");
	const wdreset = document.querySelector(".wd-clear-filters");
	const wdresetIn = document.querySelector(".wd-product-filters .custom-reset");
	if (!form || !wdreset) return;

	if (wdresetIn) {
		wdresetIn.remove();
	}

	if (document.querySelector(".custom-reset")) return;
	const customReset = Object.assign(document.createElement("div"), { innerHTML: `Reset filters <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.13297 6.17996C4.81691 4.99956 5.90653 4.10795 7.19893 3.67114C8.49134 3.23433 9.89845 3.28209 11.1583 3.80553C12.4181 4.32897 13.4447 5.29242 14.0471 6.51647C14.6494 7.74053 14.7863 9.14178 14.4324 10.4593C14.0785 11.7768 13.2578 12.9208 12.1232 13.6783C10.9886 14.4357 9.61735 14.7551 8.26482 14.5768C6.9123 14.3985 5.67066 13.7347 4.77111 12.7091C3.87155 11.6834 3.37539 10.3658 3.375 9.0016" stroke="#404040" stroke-width="0.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.89063 6.18945H4.07812V3.37695" stroke="#404040" stroke-width="0.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`, className: "custom-reset" });
	form.append(customReset);

	customReset.addEventListener("click", () => {
		if (wdreset) {
			wdreset.click();
		}
		document.querySelectorAll(".filter-btn.active").forEach((el) => {
			el.click();
		});
		form.querySelector('[type="submit"]').click();
	});
}

function addFiltersIcon() {
	const filterBtn = document.querySelector(".filters .wd-wpb a");
	if (!filterBtn) return;
	if (filterBtn.querySelector("svg")) return;
	filterBtn.innerHTML += `<svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.8373 0.666016C0.404084 0.666016 -0.361005 2.31494 0.582523 3.36833L5.05539 7.99935V12.8882C5.05539 12.8882 8.72081 14.753 9.94428 15.3327C9.94428 15.3327 9.94428 9.04931 9.94428 7.99935L14.4177 3.36833C15.3604 2.31494 14.5953 0.666016 13.1629 0.666016H1.8373Z" fill="#333333"/></svg>`;
}

function reworkFilters() {
	if (document.querySelector(".filter-con")) return;
	const filters = document.querySelectorAll(".filters-custom .wd-pf-checkboxes.wd-pf-attributes");
	const wrap = document.querySelector(".wd-product-filters-wrapp");
	if (!wrap) return;
	for (let i = filters.length - 1; i >= 0; i--) {
		const filterBlock = createEl("div", "filter-con");
		const filterWr = createEl("div", "filter-wrapper");
		filterBlock.innerHTML = `<div class="filter-title">${filters[i].querySelector(".title-text").textContent}</div>`;
		filters[i].querySelectorAll(".wd-pf-dropdown li a").forEach((link) => {
			let classes = "filter-btn ";
			let lower = link.dataset.title.toLowerCase().replaceAll(" ", "-");
			if (document.querySelector(`.filters-custom .wd-pf-checkboxes.wd-pf-attributes [data-title="${lower}"]`)) {
				classes += "active";
			}
			filterWr.innerHTML += `<button type="button" class="${classes}" data-title="${link.dataset.title}">${link.textContent}</button>`;
		});
		filterBlock.append(filterWr);
		wrap.prepend(filterBlock);
	}
	addFiltersIcon();
	rangeElInit();
	addEvForFilters();
	const btnSub = document.querySelector('.filters-custom [type="submit"]');
	if (!btnSub) return;
	btnSub.style.display = "inline-flex";
	btnSub.textContent = "Confirm";
}

function addEvForFilters() {
	const filterBtns = document.querySelectorAll(".filter-btn");
	filterBtns.forEach((btn) => {
		btn.addEventListener("click", (ev) => {
			ev.preventDefault();
			if (btn.classList.contains("active")) {
				const btnForClick = document.querySelector(`.filters-custom .wd-pf-checkboxes.wd-pf-attributes [data-title="${btn.dataset.title}"]`);
				btn.classList.remove("active");
				if (!btnForClick) {
					console.log("такого нету");
					return;
				}
				btnForClick.click();
			} else {
				const btnForClick = document.querySelector(`.filters-custom .wd-pf-checkboxes.wd-pf-attributes [data-title="${btn.dataset.title}"]`);
				btn.classList.add("active");
				if (!btnForClick) {
					console.log("такого нету");
					return;
				}
				btnForClick.click();
			}
		});
	});
}

function addClassActive() {
	document.querySelectorAll(".wd-product-filters .wd-pf-title:not(.checked)").forEach((el) => {
		if (!el.querySelector(".selected-value")) return;
		el.classList.add("checked");
	});
}

function moveFilter() {
	const filterMove = document.querySelector("#filters-move .wd-product-filters-wrapp");
	const filtersCustom = document.querySelector(".filters-custom .wpb_wrapper");
	if (!filterMove || !filtersCustom) return;
	filtersCustom.prepend(filterMove);
	filterMove.classList.add("custom-filters-block");
}

function removeClassFilters() {
	const filterMove = document.querySelector("#filtr.wd-side-hidden");
	if (!filterMove) return;
	filterMove.classList.remove("wd-side-hidden");
}

function moveFilterAnother() {
	const filterMove = document.querySelector(".filters-custom .custom-filters-block");
	const filtersCustom = document.querySelector("#filters-move .wpb_wrapper");
	if (!filterMove || !filtersCustom) return;
	filtersCustom.prepend(filterMove);
	filterMove.classList.remove("custom-filters-block");
}

function checkDom() {
	const bod = document.querySelector("body.archive");
	if (!bod) return;
	addWcMl();
	reworkFilters();

	if (window.innerWidth < 1200) {
		moveFilter();
		addResetFiltersMobile();
	} else {
		moveFilterAnother();
		removeClassFilters();
		addResetFiltersPc();
	}
}

function addEventForQuizItems() {
	document.querySelectorAll(".quiz__item, .doesntmatter").forEach((el) => {
		el.addEventListener("click", () => {
			if (el.closest(".price")) {
				const acf = el.closest(".price").querySelectorAll(".quiz__item.active");
				acf.forEach((act) => {
					act.classList.remove("active");
				});
			}
			if (el.classList.contains("doesntmatter")) {
				const acf = el.closest(".swiper-slide").querySelectorAll(".quiz__item.active");
				acf.forEach((act) => {
					act.classList.remove("active");
				});
			} else if (el.closest(".swiper-slide").querySelector(".doesntmatter.active")) {
				const acf = el.closest(".swiper-slide").querySelectorAll(".doesntmatter.active");
				acf.forEach((act) => {
					act.classList.remove("active");
				});
			}
			el.classList.contains("active") ? el.classList.remove("active") : el.classList.add("active");
			validationQuiz();
		});
	});
}

function validationQuiz() {
	let pass = 4;
	if (document.querySelector(".price .quiz__item.active,.price  .doesntmatter.active")) pass--;
	if (document.querySelector(".style .quiz__item.active, .style .doesntmatter.active")) pass--;
	if (document.querySelector(".material .quiz__item.active, .material .doesntmatter.active")) pass--;
	if (document.querySelector(".layout .quiz__item.active, .layout .doesntmatter.active")) pass--;
	if (pass != 0) {
		document.querySelector(".quiz__submit").classList.add("inactive");
	} else {
		document.querySelector(".quiz__submit").classList.remove("inactive");
	}
}

function quizPriceInp() {
	const inpMax = document.querySelector(".quiz .max");
	const inpMin = document.querySelector(".quiz .min");
	const white = document.querySelector(".quiz .white");
	const gray = document.querySelector(".quiz .gray");
	if (!inpMax || !inpMin || !white || !gray) return;

	const numberAct = document.querySelectorAll("[data-num]");

	const minValueGap = Math.ceil((10 / inpMax.offsetWidth) * (Number(inpMax.max) - Number(inpMax.min)));

	const getDelta = () => {
		return Number(inpMax.value) - Number(inpMin.value);
	};

	const numberFunc = () => {
		white.style.width = Number(inpMin.value) / 400 + "%";
		gray.style.width = Number(inpMax.value) / 400 + "%";
		numberAct.forEach((el) => {
			Number(inpMax.value) >= Number(el.dataset.num) && Number(inpMin.value) <= Number(el.dataset.num) ? el.parentNode.classList.add("active") : el.parentNode.classList.remove("active");
		});
	};

	numberFunc();

	inpMax.addEventListener("input", () => {
		if (getDelta() < minValueGap) {
			inpMax.value = Number(inpMin.value) + minValueGap;
		}

		numberFunc();
	});

	inpMin.addEventListener("input", () => {
		if (getDelta() < minValueGap) {
			inpMin.value = Number(inpMax.value) - minValueGap;
		}

		numberFunc();
	});
}

function initSwiperQuiz() {
	const slider = document.querySelector("#quiz-slider");

	if (!slider) return;
	if (slider.classList.contains("swiper-initialized")) return;
	if (typeof Swiper === "undefined") return;

	var quizSwiper = new Swiper("#quiz-slider", {
		pagination: {
			el: ".quiz__swiper-pagination",
			type: "bullets",
		},
		spaceBetween: 20,
		slidesPerView: 1,
		breakpoints: {
			468: {
				slidesPerView: 1.5,
				spaceBetween: 8,
			},
			568: {
				slidesPerView: 2,
				spaceBetween: 8,
			},
			768: {
				slidesPerView: 2,
				spaceBetween: 8,
			},
			968: {
				slidesPerView: 3,
				spaceBetween: 8,
			},
			1100: {
				slidesPerView: 3.5,
				spaceBetween: 8,
			},
			1280: {
				slidesPerView: 4,
				spaceBetween: 8,
			},
		},
	});

	addEventForQuizItems();
	quizPriceInp();
	quizNedd();
	addAcc();
}

function initSwiperLatestPosts() {
	const slider = document.querySelector("#latest-posts");

	if (!slider) return;

	const pag = slider.parentNode.querySelector(".latest-posts__pag-nav");

	if (!pag) return;

	if (slider.classList.contains("swiper-initialized")) return;

	if (typeof Swiper === "undefined") return;

	if (window.innerWidth < 768) {
		slider.closest(".vc_column-inner").style.paddingRight = "0";
	}

	let quizSwiper = new Swiper("#latest-posts", {
		pagination: {
			el: ".latest-posts__pag",
			type: "bullets",
		},
		navigation: {
			nextEl: ".latest-posts__nav .custom-right-arrow",
			prevEl: ".latest-posts__nav .custom-left-arrow",
		},
		spaceBetween: 8,
		slidesPerView: 2,
		slidesOffsetAfter: 15,
		breakpoints: {
			300: {
				slidesPerView: 1,
				spaceBetween: 8,
				slidesOffsetAfter: 0,
			},
			568: {
				slidesPerView: 2,
				spaceBetween: 8,
			},
			668: {
				slidesPerView: 2.4,
				spaceBetween: 8,
			},
			768: {
				slidesPerView: 2.6,
				spaceBetween: 8,
				slidesOffsetAfter: 15,
			},
			868: {
				slidesPerView: 2.8,
				spaceBetween: 8,
			},
			990: {
				slidesPerView: 1.6,
				spaceBetween: 8,
			},
			1100: {
				slidesPerView: 2,
				spaceBetween: 8,
			},
			1280: {
				slidesPerView: 2,
				spaceBetween: 8,
				slidesOffsetAfter: 15,
			},
			1440: {
				slidesPerView: 2.5,
				spaceBetween: 8,
			},
			1640: {
				slidesPerView: 2.9375,
				spaceBetween: 8,
			},
			1840: {
				slidesPerView: 3.3725,
				spaceBetween: 8,
			},
			2040: {
				slidesPerView: 3.81,
				spaceBetween: 8,
			},
			2240: {
				slidesPerView: 4.2475,
				spaceBetween: 8,
			},
			2440: {
				slidesPerView: 4.685,
				spaceBetween: 8,
			},
			2640: {
				slidesPerView: 5.1225,
				spaceBetween: 8,
			},
			2840: {
				slidesPerView: 5.56,
				spaceBetween: 8,
			},
			3040: {
				slidesPerView: 6,
				spaceBetween: 8,
			},
		},
	});

	const rawHtml = slider.closest(".wpb_raw_code");
	const rawHtmlParent = rawHtml.parentNode;

	const countWeightSlides = () => {
		let width = 0;

		const removePx = (string) => {
			const number = Number(string.replaceAll("px", ""));

			return number;
		};

		slider.querySelectorAll(".swiper-slide").forEach((slide) => {
			width += removePx(slide.style.width);
			width += removePx(slide.style.marginRight);
		});

		if (width <= slider.offsetWidth) {
			pag.style.display = "none";
		} else {
			pag.style.display = "flex";
		}
	};

	const addPropForSliders = () => {
		if (window.innerWidth < 768) {
			rawHtml.style.cssText = "position: static; top: auto; left: auto; width: 100$";
			rawHtmlParent.style.height = `auto`;
		} else {
			const leftParentRawCode = rawHtmlParent.getBoundingClientRect().left;
			rawHtmlParent.style.height = `${slider.offsetHeight + 130}px`;
			rawHtmlParent.style.position = `relative`;
			rawHtml.style.cssText = `position: absolute; top: 0; left: 0; width: ${document.documentElement.clientWidth - leftParentRawCode}px`;
		}

		countWeightSlides();
	};

	addPropForSliders();

	window.addEventListener("resize", throttle(addPropForSliders, 400));
}

function initSwiperLatestPostsAccount() {
	const slider = document.querySelector("#latest-posts-account");
	if (!slider) return;
	if (slider.classList.contains("swiper-initialized")) return;
	if (typeof Swiper === "undefined") return;

	var quizSwiper = new Swiper("#latest-posts-account", {
		pagination: {
			el: ".latest-posts__pag",
			type: "bullets",
		},
		spaceBetween: 8,
		slidesPerView: 4,
		breakpoints: {
			300: {
				slidesPerView: 1,
				spaceBetween: 8,
			},
			568: {
				slidesPerView: 1.5,
				spaceBetween: 8,
			},
			768: {
				slidesPerView: 2,
				spaceBetween: 8,
			},
			1000: {
				slidesPerView: 2.5,
				spaceBetween: 8,
			},
			1280: {
				slidesPerView: 3,
				spaceBetween: 8,
			},
		},
	});
}

function quizNedd() {
	const assBtn = document.querySelector(".quiz__need");
	if (!assBtn) return;
	assBtn.addEventListener("click", () => {
		setTimeout(() => {
			document.querySelector('[href="#callback"]').click();
		}, 350);
	});
}

// function moveArrows(left, right){
//     const pswpItems = document.querySelectorAll('.pswp__item');

//     let top = 0;

//     pswpItems.forEach(el => {
//         if(el.style.display != 'block') return;

//         const elImg = el.querySelector('img');

//         if(!elImg) return;

//         top = elImg.getBoundingClientRect().bottom;
//     });
// }

function addArrowsPswp() {
	const leftArrow = document.querySelector(".pswp__button--arrow--left");
	const rightArrow = document.querySelector(".pswp__button--arrow--right");

	if (!leftArrow || !rightArrow || document.querySelectorAll(".pswp__img:not(.pswp__img--placeholder)").length < 2) return;

	console.log(document.querySelectorAll(".pswp__img").length);

	if (!leftArrow.querySelector("svg")) {
		leftArrow.innerHTML = `<svg width="46" height="54" viewBox="0 0 46 54" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.18021e-06 27L46 54L46 -2.01072e-06L1.18021e-06 27Z" fill="#CCCCCC" /></svg>`;
		leftArrow.classList.add("custom-left-arrow");

		leftArrow.addEventListener("click", () => {
			const par = leftArrow.parentNode;
			if (!par) return;

			par.click();
		});
	}

	if (!rightArrow.querySelector("svg")) {
		rightArrow.innerHTML = `<svg width="46" height="54" viewBox="0 0 46 54" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M46 27L1.45428e-06 54L3.8147e-06 -2.01072e-06L46 27Z" fill="#CCCCCC" /></svg>`;
		rightArrow.classList.add("custom-right-arrow");

		rightArrow.addEventListener("click", () => {
			const par = rightArrow.parentNode;
			if (!par) return;

			par.click();
		});
	}
}

function addPsWpBtn() {
	const pswp = document.querySelector(".pswp");

	if (!pswp) return;

	const pswpClose = pswp.querySelector(".pswp__button--close");

	if (!pswpClose) return;

	if (pswp.querySelector(".popup__close")) return;

	const popupClose = Object.assign(document.createElement("div"), { className: "popup__close", innerHTML: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.74287 3.96383C4.52809 3.74904 4.17985 3.74904 3.96506 3.96383C3.75027 4.17861 3.75027 4.52685 3.96506 4.74164L8.22227 8.99885L3.9648 13.2563C3.75001 13.4711 3.75001 13.8193 3.9648 14.0341C4.17959 14.2489 4.52783 14.2489 4.74262 14.0341L9.00008 9.77667L13.2575 14.0341C13.4723 14.2489 13.8206 14.2489 14.0354 14.0341C14.2502 13.8193 14.2502 13.4711 14.0354 13.2563L9.7779 8.99885L14.0351 4.74164C14.2499 4.52685 14.2499 4.17861 14.0351 3.96383C13.8203 3.74904 13.4721 3.74904 13.2573 3.96383L9.00008 8.22103L4.74287 3.96383Z" fill="white"/></svg>` });

	pswp.append(popupClose);

	popupClose.addEventListener("click", () => {
		pswpClose.click();
	});
}

function reworkPaginationSliders() {
	const paginationSliders = document.querySelectorAll(".vc_grid-owl-dots, .wd-nav-pagin");
	paginationSliders.forEach((pag) => {
		const wrap = pag.closest(".wpb_wrapper");
		if (!wrap) return;
		if (pag.parentNode.querySelector(".custom-arrow-con")) return;
		pag.classList.add("check");
		const leftArrow = wrap.querySelector(".vc_grid-owl-prev, .wd-prev");
		const rightArrow = wrap.querySelector(".vc_grid-owl-next, .wd-next");

		if (!leftArrow || !rightArrow) return;

		leftArrow.style.display = "none";
		rightArrow.style.display = "none";
		const btnsCon = document.createElement("div");
		btnsCon.innerHTML = `<svg class="custom-left-arrow" width="21" height="24" viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.24537e-07 12L20.4444 24L20.4444 -8.93655e-07L5.24537e-07 12Z" fill="#CCCCCC"/></svg><svg class="custom-right-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 12L3.55556 24L3.55556 -8.93655e-07L24 12Z" fill="#CCCCCC"/></svg>`;
		btnsCon.className = "custom-arrow-con";
		if (pag.classList.contains("vc_grid-owl-dots")) {
			pag.parentNode.append(btnsCon);
			const pagDots = pag.querySelectorAll(".vc_grid-owl-dot");
			btnsCon.style.marginLeft = pagDots[pagDots.length - 1].getBoundingClientRect().right - pagDots[0].getBoundingClientRect().left + 33 + "px";
		} else pag.append(btnsCon);
		btnsCon.querySelector(".custom-left-arrow").addEventListener("click", () => {
			leftArrow.click();
		});
		btnsCon.querySelector(".custom-right-arrow").addEventListener("click", () => {
			rightArrow.click();
		});
	});
}

function addAcc() {
	const assBtn = document.querySelector(".quiz__submit");
	if (!assBtn) return;
	assBtn.addEventListener("click", () => {
		godatatoQuiz();
		document.querySelector(".quiz__slider").swiper.slideTo(5, 400, false);
		document.querySelector(".form-hidden .wpcf7-submit").click();
	});
}

function godatatoQuiz() {
	let text = "Quiz result:\r\n";
	text += "layout: \r\n";
	document.querySelectorAll(".layout .quiz__item.active .quiz__text, .layout .doesntmatter").forEach((el) => {
		text += el.textContent + " ";
	});
	text += "\r\n material: \r\n";
	document.querySelectorAll(".material .quiz__item.active .quiz__text, .material .doesntmatter").forEach((el) => {
		text += el.textContent + " ";
	});
	text += "\r\n style: \r\n";
	document.querySelectorAll(".style .quiz__item.active .quiz__text, .style .doesntmatter").forEach((el) => {
		text += el.textContent + " ";
	});
	text += "\r\n price: \r\n";
	document.querySelectorAll(".price .quiz__item.active .quiz__text, .price .doesntmatter").forEach((el) => {
		text += el.textContent + " ";
	});
	text += "range: ";
	text += document.querySelector(".quiz .min").value + " " + document.querySelector(".quiz .max").value;
	document.querySelectorAll(".quiz textarea").forEach((el) => {
		el.value = text;
	});
}

function quizAssistance() {
	const assBtn = document.querySelector(".quiz__submit");
	const formBase = document.querySelector(".quiz .form-base.hidden");
	const formSlider = document.querySelector(".quiz__slider");
	const quizback = document.querySelector(".popup__back");
	const quiztitle = document.querySelector(".quiz__title");
	const paginnat = document.querySelector(".swiper-pagination");
	if (!quiztitle || !assBtn || !formBase || !quizback || !formSlider || !paginnat) return;
	const changeHeight = () => {
		formSlider.parentNode.style.height = "calc(" + formSlider.parentNode.offsetHeight + "px - " + formSlider.parentNode.style.paddingTop + ")";
		const btnsCon = assBtn.parentNode;
		setTimeout(() => {
			setTimeout(() => {
				formSlider.parentNode.style.height = "auto";
				btnsCon.style.cssText = `position: static; top: auto; left: auto;`;
			}, 100);
		}, 400);
	};
	let pass = true;
	assBtn.addEventListener("click", () => {
		if (!pass) return;
		godatatoQuiz();
		if (formSlider.style.display != "none") {
			changeHeight();
			hide(formSlider, 300);
			show(quizback, 300, "flex");
			hide(paginnat, 300);
			setTimeout(() => {
				show(formBase, 300, "flex");
				setTimeout(() => {
					pass = true;
					formSlider.parentNode.style.height = "auto";
				}, 100);
			}, 400);
		}
		document.querySelector(".form-base.hidden .wpcf7-submit").click();
	});
	quizback.addEventListener("click", () => {
		if (!pass) return;
		changeHeight();
		hide(formBase, 300);
		hide(quizback, 300, "flex");
		formSlider.parentNode.style.height = formSlider.parentNode.offsetHeight + "px";
		setTimeout(() => {
			show(formSlider, 300, "flex");
			show(paginnat, 300, "flex");
			setTimeout(() => {
				pass = true;
				formSlider.parentNode.style.height = "auto";
			}, 100);
		}, 400);
	});
}

function popupInitQuiz(el, popin, btn_init, btn_close, tr, dspl) {
	const pop = document.querySelector(el);
	if (!pop) return;
	let pass = true;

	const popupEv = (ev) => {
		document.querySelectorAll(btn_init).forEach((btn) => {
			hide(btn, 300);
		});
		if (pop.classList.contains("popup--show")) return;
		ev.preventDefault();
		if (!pass) return;
		pass = false;
		document.querySelectorAll(".popup--show").forEach((pop) => {
			pop.classList.remove("popup--show");
			hide(pop, tr);
		});
		pop.classList.add("popup--show");
		show(pop, tr, dspl);
		setTimeout(() => {
			pass = true;
		}, tr);
	};

	const closeEv = () => {
		document.querySelectorAll(btn_init).forEach((btn) => {
			show(btn, 300, "inline-flex");
		});
		pop.classList.remove("popup--show");
		hide(pop, tr);
		document.documentElement.style.overflow = "auto";
	};

	const addMargin = () => {
		let margin = ((document.documentElement.clientWidth - pop.parentNode.offsetWidth) / 2) * -1;
		pop.style.marginLeft = margin + "px";
		pop.style.marginRight = margin + "px";
		pop.style.width = document.documentElement.clientWidth + "px";
	};

	addMargin();

	window.addEventListener("resize", throttle(addMargin, 300));

	document.querySelectorAll(btn_init).forEach((btn) => {
		btn.style.padding = 0;
		hide(btn, 300);
	});

	document.querySelectorAll(btn_init).forEach((btn) => {
		btn.addEventListener("click", popupEv);
	});

	document.querySelectorAll(btn_close).forEach((btn) => {
		btn.addEventListener("click", closeEv);
	});
}

async function recentlyViewed() {
	const recently = await elementReady("#viewed");
	if (recently.querySelectorAll(".wd-carousel-item").length == 0) {
		recently.parentNode.remove();
	}
}

async function elementReady(selector, parent = false) {
	return new Promise((resolve) => {
		const observer = new MutationObserver((mutations, obs) => {
			if (parent) {
				if (parent.querySelector(selector)) {
					resolve(parent.querySelector(selector)); // Промис выполнен, элемент найден
					obs.disconnect();
				}
			} else {
				if (document.querySelector(selector)) {
					resolve(document.querySelector(selector)); // Промис выполнен, элемент найден
					obs.disconnect();
				}
			}
		});

		observer.observe(document.documentElement, { childList: true, subtree: true });
	});
}

async function addtoBurger() {
	const burgerBtn = await elementReady('[href="#burger"]');
	const burger = await elementReady(".burger");
	// const burgerWr = await elementReady('#burger-wrapper');
	// const BtnInBurger = await elementReady('#btn-in-burger');
	const catLinks = await elementReady("#catalog-links");
	const aboutLinks = await elementReady("#about-links");
	const catLinksR = await elementReady("#catalog-links-right");
	const aboutLinksR = await elementReady("#about-links-right");

	// const checkHeightBurger = () => {
	//     let heightBurger = BtnInBurger.offsetHeight + 106 + burgerWr.offsetHeight;
	//     console.log(heightBurger);
	//     if (heightBurger < window.innerHeight) {
	//         burgerWr.style.marginBottom = window.innerHeight - heightBurger + 48 + 'px';
	//     } else {
	//         burgerWr.style.marginBottom = 48 + 'px';
	//     }
	// };

	// window.addEventListener('resize', throttle(() => {
	//     if (!burgerBtn.classList.contains('active')) return;
	//     // checkHeightBurger();
	// }, 200));

	burgerBtn.innerHTML = '<div class="burger-line"></div><div class="burger-line"></div><div class="burger-line"></div>';
	burgerBtn.addEventListener("click", () => {
		if (burgerBtn.classList.contains("active")) {
			burgerBtn.classList.remove("active");
			hide(burger, 100);
			document.documentElement.style.overflow = "auto";
		} else {
			burgerBtn.classList.add("active");
			show(burger, 100, "block");
			// checkHeightBurger();
			document.documentElement.style.overflow = "hidden";
		}
	});
	catLinks.addEventListener("click", () => {
		if (catLinks.classList.contains("active")) return;
		if (aboutLinksR.classList.contains("active")) {
			aboutLinksR.classList.remove("active");
			aboutLinks.classList.remove("active");
			hide(aboutLinksR, 100);
		}
		setTimeout(() => {
			catLinks.classList.add("active");
			catLinksR.classList.add("active");
			show(catLinksR, 100, "block");
			catLinksR.style.paddingTop = catLinks.getBoundingClientRect().top - burger.querySelector(".burger__wrapper").getBoundingClientRect().top - 114 + "px";
			// checkHeightBurger();
		}, 100);
	});
	aboutLinks.addEventListener("click", () => {
		if (aboutLinks.classList.contains("active")) return;
		if (catLinksR.classList.contains("active")) {
			catLinks.classList.remove("active");
			catLinksR.classList.remove("active");
			hide(catLinksR, 100);
		}
		setTimeout(() => {
			aboutLinks.classList.add("active");
			aboutLinksR.classList.add("active");
			show(aboutLinksR, 100, "block");
			aboutLinksR.style.paddingTop = aboutLinks.getBoundingClientRect().top - burger.querySelector(".burger__wrapper").getBoundingClientRect().top - 114 + "px";
			// checkHeightBurger();
		}, 100);
	});
}

function addTitleForEl(el, text) {
	el.innerHTML += '<div class="findstore__title"> ' + text + "</div>";
}

function findstoreStars() {
	document.querySelectorAll(".findstore").forEach((str) => {
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

function findstoreBrands() {
	const brandsBtn = document.querySelectorAll(".findstore__brand-btn");

	brandsBtn.forEach((cn) => {
		cn.addEventListener("click", () => {
			if (cn.classList.contains("active")) return;
			const activeBtn = document.querySelector(".findstore__brand-btn.active");

			if (activeBtn) {
				activeBtn.classList.remove("active");
			}

			cn.classList.add("active");

			function getDataActive() {
				const activeCountry = document.querySelector("#country .findstore__choice-item.active");
				const activeCity = document.querySelector("#city .findstore__choice-item.active");
				const activeStreet = document.querySelector("#street .findstore__choice-item.active");

				return {
					country: activeCountry ? activeCountry.dataset.country : false,
					city: activeCity ? activeCountry.dataset.city : false,
					street: activeStreet ? activeCountry.dataset.street : false,
					brand: cn.dataset.brand,
				};
			}

			const data = getDataActive();

			const checkStore = (str) => {
				let pass = true;

				if (data.country) {
					if (str.dataset.country != data.country) {
						pass = false;
					}
				}

				if (data.city) {
					if (str.dataset.city != data.city) {
						pass = false;
					}
				}

				if (data.street) {
					if (str.dataset.street != data.street) {
						pass = false;
					}
				}

				if (pass) {
					str.classList.remove("hidden-display");
				} else {
					str.classList.add("hidden-display");
				}
			};

			document.querySelectorAll(".findstore").forEach((str) => {
				if (str.dataset.brand == cn.dataset.brand) {
					checkStore(str);
				} else {
					str.classList.add("hidden-display");
				}
			});

			console.log(data);
		});
	});

	if (brandsBtn.length > 0) {
		brandsBtn[0].click();
	}
}

function findClosestStore(child) {
	const parent = child.closest(".findstore__choice");
	const title = parent.querySelector(".findstore__title");

	if (!parent || !title) return;

	title.click();
}

function clickCountry() {
	const street = document.querySelector("#street-title");
	const city = document.querySelector("#city-title");
	document.querySelectorAll("#country .findstore__choice-item").forEach((cn) => {
		cn.addEventListener("click", () => {
			if (cn.classList.contains("active")) return;

			document.querySelectorAll("#country .findstore__choice-item.active").forEach((cnAct) => {
				cnAct.classList.remove("active");
			});

			cn.classList.add("active");

			findClosestStore(cn);

			const activeBtn = document.querySelector(".findstore__brand-btn.active");

			const title = cn.parentNode.parentNode.querySelector(".findstore__title");

			title.textContent = cn.textContent;

			title.classList.add("checked");

			city.textContent = "TOWN / CITY";

			city.classList.remove("checked");

			street.textContent = "STREET";

			street.classList.remove("checked");

			document.querySelectorAll("#street .findstore__choice-item, #city .findstore__choice-item").forEach((str) => {
				if (str.dataset.country == cn.dataset.country) {
					str.classList.remove("hidden-display");
				} else {
					str.classList.add("hidden-display");
				}
			});

			document.querySelectorAll("#street .findstore__choice-item.active, #city .findstore__choice-item.active").forEach((str) => {
				str.classList.remove("active");
			});

			console.log(`button - ${cn.dataset.country} ${cn.dataset.brand}`);

			document.querySelectorAll(".findstore").forEach((str) => {
				console.log(`element - ${str.dataset.country} ${str.dataset.brand}`);
				if (str.dataset.country == cn.dataset.country) {
					if (activeBtn) {
						if (activeBtn.dataset.brand == cn.dataset.brand) {
							str.classList.remove("hidden-display");
						} else {
							str.classList.add("hidden-display");
						}
					} else {
						str.classList.remove("hidden-display");
					}
				} else {
					str.classList.add("hidden-display");
				}
			});
		});
	});
}

function clickCity() {
	const street = document.querySelector("#street-title");
	document.querySelectorAll("#city .findstore__choice-item").forEach((cn) => {
		cn.addEventListener("click", () => {
			if (cn.classList.contains("active")) return;

			document.querySelectorAll("#city .findstore__choice-item.active").forEach((cnAct) => {
				cnAct.classList.remove("active");
			});

			cn.classList.add("active");

			findClosestStore(cn);

			const activeBtn = document.querySelector(".findstore__brand-btn.active");

			const title = cn.parentNode.parentNode.querySelector(".findstore__title");

			title.textContent = cn.textContent;
			title.classList.add("checked");

			street.textContent = "STREET";

			street.classList.remove("checked");

			document.querySelectorAll("#street .findstore__choice-item").forEach((str) => {
				if (str.dataset.city == cn.dataset.city) {
					str.classList.remove("hidden-display");
				} else {
					str.classList.add("hidden-display");
				}
			});

			document.querySelectorAll("#street .findstore__choice-item.active ").forEach((str) => {
				str.classList.remove("active");
			});

			document.querySelectorAll(".findstore").forEach((str) => {
				if (str.dataset.city == cn.dataset.city) {
					if (activeBtn) {
						if (activeBtn.dataset.brand == cn.dataset.brand) {
							str.classList.remove("hidden-display");
						} else {
							str.classList.add("hidden-display");
						}
					} else {
						str.classList.remove("hidden-display");
					}
				} else {
					str.classList.add("hidden-display");
				}
			});
		});
	});
}

function clickStreet() {
	document.querySelectorAll("#street .findstore__choice-item").forEach((cn) => {
		cn.addEventListener("click", () => {
			if (cn.classList.contains("active")) return;

			document.querySelectorAll("#street .findstore__choice-item.active").forEach((cnAct) => {
				cnAct.classList.remove("active");
			});

			cn.classList.add("active");

			findClosestStore(cn);

			const activeBtn = document.querySelector(".findstore__brand-btn.active");
			const title = cn.parentNode.parentNode.querySelector(".findstore__title");

			title.textContent = cn.textContent;
			title.classList.add("checked");

			// document.querySelectorAll('#street .findstore__choice-item').forEach(str => {
			//     if (str.dataset.street == cn.dataset.street) {
			//         if (activeBtn) {
			//             if (activeBtn.dataset.brand == cn.dataset.brand) {
			//                 str.classList.remove('hidden-display');
			//             } else {
			//                 str.classList.add('hidden-display');
			//             }
			//         } else {
			//             str.classList.remove('hidden-display');
			//         }
			//     } else {
			//         str.classList.add('hidden-display');
			//     }
			// });

			document.querySelectorAll(".findstore").forEach((str) => {
				if (str.dataset.street == cn.dataset.street) {
					if (activeBtn) {
						if (activeBtn.dataset.brand == cn.dataset.brand) {
							str.classList.remove("hidden-display");
						} else {
							str.classList.add("hidden-display");
						}
					} else {
						str.classList.remove("hidden-display");
					}
				} else {
					str.classList.add("hidden-display");
				}
			});
		});
	});
}

function initFindstore() {
	document.querySelectorAll(".findstore__title").forEach((ch) => {
		document.addEventListener("click", (ev) => {
			if (!ev.target.closest(".findstore__choice")) {
				ch.parentNode.classList.remove("active");
			}
		});
		ch.addEventListener("click", () => {
			if (ch.parentNode.classList.contains("active")) {
				ch.parentNode.classList.remove("active");
				ch.parentNode.parentNode.querySelectorAll(".findstore__choice.active").forEach((el) => {
					el.classList.remove("active");
				});
			} else {
				ch.parentNode.parentNode.querySelectorAll(".findstore__choice.active").forEach((el) => {
					el.classList.remove("active");
				});
				ch.parentNode.classList.add("active");
			}
		});
	});
}

function registrationCheckbox() {
	const checkbox = document.querySelector(".registration__checkbox");

	if (!checkbox) return;

	const checkboxInput = checkbox.querySelector("input");

	if (!checkboxInput) return;

	checkbox.dataset.checkState = "false";
	checkbox.addEventListener("click", () => {
		if (checkbox.dataset.checkState == "false") {
			checkbox.dataset.checkState = "true";
		} else {
			checkbox.dataset.checkState = "false";
		}
	});

	checkboxInput.addEventListener("click", (ev) => {
		ev.stopPropagation();
	});
}

function regUser() {
	const form = document.querySelector(".form-registration");
	const errorForm = form.querySelector(".error-form");
	let formData = new FormData();
	formData.append("company", form.querySelector('[name="company"]').value);
	formData.append("companynumber", form.querySelector('[name="companynumber"]').value);
	formData.append("firstname", form.querySelector('[name="firstname"]').value);
	formData.append("lastname", form.querySelector('[name="lastname"]').value);
	formData.append("position", form.querySelector('[name="position"]').value);
	formData.append("country", form.querySelector('[name="country"]').value);
	formData.append("city", form.querySelector('[name="city"]').value);
	formData.append("address", form.querySelector('[name="address"]').value);
	formData.append("zipcode", form.querySelector('[name="zipcode"]').value);
	formData.append("telreg", form.querySelector('[name="telreg"]').value);
	formData.append("mailreg", form.querySelector('[name="mailreg"]').value);
	formData.append("website", form.querySelector('[name="website"]').value);
	formData.append("password", form.querySelector('[name="password"]').value);
	formData.append("action", "registration_action");
	formData.append("registr-nonce", registration.nonce);
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
			}
		}
	};
	xhr.open("POST", registration.url, true);
	xhr.responseType = "";
	xhr.send(formData);
	xhr.onload = function () {
		console.log(xhr.response);

		if (xhr.response != "Создан юзер") {
			errorForm.textContent = xhr.response;
			errorForm.style.display = "block";
		} else {
			document.querySelector("#registration_popup .hidden").click();
		}
	};
}

function passDoesntMuch() {
	const pass = document.querySelector('[name="password"]');
	const passRepeat = document.querySelector('[name="repeatpassword"]');
	const passError = document.querySelector(".form-registration .error");
	if (!pass || !passRepeat || !passError) return;
	pass.addEventListener("input", () => {
		if (pass.value != passRepeat.value) {
			passError.style.display = "block";
			passRepeat.classList.add("highlight");
		} else {
			passError.style.display = "none";
			passRepeat.classList.remove("highlight");
		}
	});
	passRepeat.addEventListener("input", () => {
		if (pass.value != passRepeat.value) {
			passError.style.display = "block";
			passRepeat.classList.add("highlight");
		} else {
			passError.style.display = "none";
			passRepeat.classList.remove("highlight");
		}
	});
}

function passDoesntMuchUpdate() {
	const pass = document.querySelector('[name="password"]');
	const passRepeat = document.querySelector('[name="repeatpassword"]');
	const passError = document.querySelector(".form-registration .error");
	const formBtn = document.querySelector('[name="save_account_details"]');

	if (!pass || !passRepeat || !passError || !formBtn) return;
	if (pass.classList.contains("check")) return;
	pass.classList.add("check");

	pass.addEventListener("input", () => {
		if (pass.value != passRepeat.value) {
			passError.style.display = "block";
			passRepeat.classList.add("highlight");
			formBtn.style.cssText = "opacity: 0.5; pointer-events: none";
			formBtn.classList.add("disabled");
		} else {
			passError.style.display = "none";
			passRepeat.classList.remove("highlight");
			formBtn.style.cssText = "opacity: 1; pointer-events: all";
			formBtn.classList.remove("disabled");
		}
	});
	passRepeat.addEventListener("input", () => {
		if (pass.value != passRepeat.value) {
			passError.style.display = "block";
			passRepeat.classList.add("highlight");
			formBtn.style.cssText = "opacity: 0.5; pointer-events: none";
			formBtn.classList.add("disabled");
		} else {
			passError.style.display = "none";
			passRepeat.classList.remove("highlight");
			formBtn.style.cssText = "opacity: 1; pointer-events: all";
			formBtn.classList.remove("disabled");
		}
	});
}

function formError(text, inp) {
	const err = document.querySelector(".error-form");
	if (!err) return;
	err.textContent = text;
	err.style.display = "block";
	inp.classList.add("highlight");
}

function formClear(inp) {
	const err = document.querySelector(".error-form");
	if (!err) return;
	err.style.display = "none";
	inp.classList.remove("highlight");
}

function registrationFormValidation() {
	const form = document.querySelector(".form-registration");
	const passRepeat = document.querySelector('[name="repeatpassword"]');
	const pass = document.querySelector('[name="password"]');
	const tel = document.querySelector('.registration [type="tel"]');
	if (!form || !passRepeat || !pass || !tel) return;
	const iti = window.intlTelInput(tel, {
		initialCountry: "auto",
		useFullscreenPopup: false,
		geoIpLookup: function (callback) {
			fetch("https://ipinfo.io/json")
				.then((response) => response.json())
				.then((data) => callback(data.country))
				.catch(() => callback("us"));
		},
		utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
	});

	let mask = new IMask(tel, { mask: `+{7} ({000) 000-00-00` });
	tel.addEventListener("countrychange", function () {
		setTimeout(() => {
			mask.destroy();
			const data = iti.getSelectedCountryData();
			if (data.dialCode == "375") {
				mask = new IMask(tel, { mask: `+{${data.dialCode}} ({00) 000-00-00` });
			} else {
				mask = new IMask(tel, { mask: `+{${data.dialCode}} ({000) 000-00-00` });
			}
		}, 200);
	});
	form.addEventListener("submit", (ev) => {
		ev.preventDefault();
		const inputs = form.querySelectorAll("input");
		for (let i = 0; i < inputs.length; i++) {
			let inp = inputs[i];
			if (inp.type != "hidden") {
				if (inp.type == "mail") {
					if (!inp.include("@") || !inp.include(".")) {
						formError("Incorrect email ", inp);
						return;
					} else formClear(inp);
				}
				if (inp.type == "tel") {
					const code = iti.getSelectedCountryData().dialCode;
					if (code == "375") {
						if (inp.value.length < 16 + code.length) {
							formError("Incorrect tel. number", inp);
							return;
						} else formClear(inp);
					} else {
						if (inp.value.length < 17 + code.length) {
							formError("Incorrect tel. number", inp);
							return;
						} else formClear(inp);
					}
				}

				if (inp.type == "password") {
					if (inp.value.length < 6) {
						formError("The password must contain at least 6 characters", inp);
						return;
					} else formClear(inp);
				}
			}
		}
		if (passRepeat.value != pass.value) {
			formError("Passwords do not match", pass);
			return;
		} else {
			formClear(pass);
		}
		regUser();
	});
}

function initRegistration() {
	registrationCheckbox();
	passDoesntMuch();
	registrationFormValidation();
}

function redirectYourRequest() {
	const form = document.querySelector("#request .wpcf7");
	if (!form) return;
	form.addEventListener("wpcf7submit", (ev) => {
		window.location.href = "/thankrequest";
	});
}

function redirectFeedback() {
	const form = document.querySelector("#feedback .wpcf7");
	if (!form) return;
	form.addEventListener("wpcf7submit", (ev) => {
		window.location.href = "/thankfeedback";
	});
}

function addAccrodionForMobile() {
	if (window.innerWidth > 768) return;
	const accTitle = document.querySelectorAll(".title-accordion");
	accTitle.forEach((title) => {
		const accBody = title.nextElementSibling;
		title.querySelector(".liner-continer").innerHTML += `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L10 14L2 6" stroke="#595959" stroke-linecap="round"/></svg>`;
		title.querySelector(".liner-continer").style.cssText = "display: flex; justify-content: space-between; align-items: center;";
		accBody.classList.add("acc-body");
		accBody.classList.add("acc-hidden");
		accBody.closest(".wpb_column.vc_column_container").style.marginBottom = "64px";
		const svgInTitle = title.querySelector("svg");
		title.addEventListener("click", () => {
			if (accBody.classList.contains("acc-hidden")) {
				accBody.classList.remove("acc-hidden");
				svgInTitle.style.rotate = "180deg";
			} else {
				accBody.classList.add("acc-hidden");
				svgInTitle.style.rotate = "0deg";
			}
		});
	});
}

function initWpCf7CustomUpload() {
	const forms = document.querySelectorAll(".wpcf7-form").forEach((form) => {
		const textarea = form.querySelector("textarea");
		const upload = form.querySelector('input[type="file"]');

		if (!textarea || !upload) return;

		const textareaParent = textarea.parentNode;
		const parentUpload = upload.closest("p");

		if (textareaParent.querySelector(".custom-file-upload")) return;
		if (!parentUpload) return;

		parentUpload.style.display = "none";
		const baseText = `Datei anhängen <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_605_58555)">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.1076 4.80967C11.3098 3.37752 13.4454 3.19116 14.8776 4.39341C16.3097 5.59566 16.4961 7.73125 15.2938 9.16339L10.7506 14.5753C9.13021 16.5056 6.25177 16.7568 4.32147 15.1364C2.39117 13.5159 2.13998 10.6375 3.76042 8.7072L9.6287 1.71679C9.78548 1.53004 10.064 1.50573 10.2507 1.66251C10.4375 1.81929 10.4618 2.09778 10.305 2.28454L4.43673 9.27495C3.12984 10.8317 3.33243 13.1532 4.88921 14.4601C6.446 15.767 8.76746 15.5644 10.0743 14.0076L14.6175 8.59565C15.5062 7.53702 15.3685 5.95841 14.3098 5.06971C13.2512 4.18102 11.6726 4.31878 10.7839 5.37741L7.20441 9.64135C6.7339 10.2018 6.80684 11.0376 7.36731 11.5081C7.92779 11.9786 8.76356 11.9057 9.23407 11.3452L10.5764 9.74622C10.7331 9.55947 11.0116 9.53516 11.1984 9.69194C11.3852 9.84872 11.4095 10.1272 11.2527 10.314L9.91037 11.9129C9.12631 12.8469 7.73356 12.9685 6.79957 12.1844C5.86558 11.4004 5.74404 10.0076 6.5281 9.07361L10.1076 4.80967Z" fill="#7F7D58"/>
              </g>
              <defs>
              <clipPath id="clip0_605_58555">
              <rect width="18" height="18" fill="white"/>
              </clipPath>
              </defs>
              </svg>
          `;

		const customUpload = Object.assign(document.createElement("div"), { className: "custom-file-upload", innerHTML: baseText });

		textareaParent.style.position = "relative";
		textareaParent.append(customUpload);

		customUpload.addEventListener("click", () => {
			upload.click();
		});

		upload.addEventListener("change", () => {
			if (upload.value == "") {
				customUpload.innerHTML = baseText;
			} else {
				customUpload.innerHTML = upload.files[0].name;
			}
		});
	});
}

function reworkIconsAcc() {
	document.querySelectorAll(".vc_toggle_icon").forEach((arrow) => {
		const parentArrow = arrow.parentNode;
		arrow.remove();
		parentArrow.innerHTML += `<svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 0.999999L9 9L1 0.999997" stroke="#595959" stroke-linecap="round"/></svg>`;
	});
}

function reworkArrows() {
	document.querySelectorAll(".vc-material-arrow_forward").forEach((arrow) => {
		const parentArrow = arrow.parentNode;
		arrow.remove();
		let stylesArrow = window.getComputedStyle(parentArrow);
		parentArrow.innerHTML += `<svg width="15" height="8" viewBox="0 0 15 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path stroke="${stylesArrow.getPropertyValue("color")}" fill-rule="evenodd" clip-rule="evenodd" d="M14.067 4.38935L14.4501 4.02637L14.067 3.66339L11.1652 0.914369C10.9648 0.724453 10.6483 0.733006 10.4584 0.933473C10.2685 1.13394 10.277 1.45041 10.4775 1.64032L12.468 3.52611H1.39062C1.11448 3.52611 0.890625 3.74997 0.890625 4.02611C0.890625 4.30225 1.11448 4.52611 1.39062 4.52611H12.4686L10.4775 6.41242C10.277 6.60233 10.2685 6.9188 10.4584 7.11927C10.6483 7.31973 10.9648 7.32829 11.1652 7.13837L14.067 4.38935Z" fill="#FAFAFA"/></svg>`;
		parentArrow.style.cssText = "display: flex; gap: 8px; align-items: center; padding-right: " + stylesArrow.getPropertyValue("padding-left") + ";";
	});
}

function reworkDownload() {
	document.querySelectorAll(".entypo-icon-download").forEach((arrow) => {
		const parentArrow = arrow.parentNode;
		arrow.remove();
		let parentArrowText = parentArrow.textContent;
		parentArrow.classList.add("downsvg");
		parentArrow.innerHTML = `
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.59557 8.14384C6.5277 8.22533 6.49497 8.33043 6.50457 8.43604C6.51417 8.54165 6.56532 8.63913 6.64677 8.70704L8.64677 10.3734C8.72857 10.4383 8.83251 10.4687 8.93639 10.458C9.04026 10.4473 9.13583 10.3964 9.20268 10.3162C9.26953 10.2359 9.30236 10.1328 9.29416 10.0287C9.28595 9.92456 9.23736 9.82779 9.15877 9.75904L7.15877 8.09264C7.07728 8.02477 6.97218 7.99204 6.86657 8.00164C6.76096 8.01124 6.66348 8.06239 6.59557 8.14384Z" fill="#4B7BEC"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M11.2097 8.14384C11.1418 8.06239 11.0443 8.01124 10.9387 8.00164C10.8331 7.99204 10.728 8.02477 10.6465 8.09264L8.64649 9.75904C8.60471 9.79219 8.56998 9.83336 8.54435 9.88014C8.51871 9.92691 8.50269 9.97834 8.49722 10.0314C8.49176 10.0844 8.49696 10.1381 8.51252 10.1891C8.52808 10.2401 8.55368 10.2875 8.58783 10.3285C8.62197 10.3694 8.66397 10.4032 8.71134 10.4277C8.75872 10.4522 8.81051 10.467 8.86369 10.4711C8.91686 10.4753 8.97033 10.4689 9.02096 10.4521C9.07159 10.4353 9.11835 10.4086 9.15849 10.3734L11.1585 8.70704C11.2399 8.63913 11.2911 8.54165 11.3007 8.43604C11.3103 8.33043 11.2776 8.22533 11.2097 8.14384Z" fill="#4B7BEC"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.90234 2.70332C9.00843 2.70332 9.11017 2.74546 9.18519 2.82048C9.2602 2.89549 9.30234 2.99723 9.30234 3.10332L9.29933 9.50037C9.29933 9.60645 9.25719 9.70819 9.18217 9.78321C9.10716 9.85822 9.00542 9.90037 8.89933 9.90037C8.79324 9.90037 8.6915 9.85822 8.61649 9.78321C8.54147 9.70819 8.49933 9.60645 8.49933 9.50037L8.50234 3.10332C8.50234 2.99723 8.54449 2.89549 8.6195 2.82048C8.69451 2.74546 8.79626 2.70332 8.90234 2.70332ZM3.30234 13.9033C3.19626 13.9033 3.09452 13.8612 3.0195 13.7862C2.94449 13.7111 2.90234 13.6094 2.90234 13.5033L2.90234 6.30332C2.90234 6.19723 2.94449 6.09549 3.0195 6.02048C3.09452 5.94546 3.19626 5.90332 3.30234 5.90332C3.40843 5.90332 3.51017 5.94546 3.58519 6.02048C3.6602 6.09549 3.70234 6.19723 3.70234 6.30332L3.70234 13.5033C3.70234 13.6094 3.6602 13.7111 3.58519 13.7862C3.51017 13.8612 3.40843 13.9033 3.30234 13.9033ZM14.5023 13.9033C14.3963 13.9033 14.2945 13.8612 14.2195 13.7862C14.1445 13.7111 14.1023 13.6094 14.1023 13.5033L14.1023 6.30332C14.1023 6.19723 14.1445 6.09549 14.2195 6.02048C14.2945 5.94546 14.3963 5.90332 14.5023 5.90332C14.6084 5.90332 14.7102 5.94546 14.7852 6.02048C14.8602 6.09549 14.9023 6.19723 14.9023 6.30332L14.9023 13.5033C14.9023 13.6094 14.8602 13.7111 14.7852 13.7862C14.7102 13.8612 14.6084 13.9033 14.5023 13.9033Z" fill="#4B7BEC"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M2.90234 6.30332C2.90234 6.19723 2.94449 6.09549 3.0195 6.02048C3.09452 5.94546 3.19626 5.90332 3.30234 5.90332L6.50234 5.90332C6.60843 5.90332 6.71017 5.94546 6.78519 6.02048C6.8602 6.09549 6.90234 6.19723 6.90234 6.30332C6.90234 6.40941 6.8602 6.51115 6.78519 6.58616C6.71017 6.66118 6.60843 6.70332 6.50234 6.70332L3.30234 6.70332C3.19626 6.70332 3.09452 6.66118 3.0195 6.58616C2.94449 6.51115 2.90234 6.40941 2.90234 6.30332ZM10.9023 6.30332C10.9023 6.19723 10.9445 6.09549 11.0195 6.02048C11.0945 5.94546 11.1963 5.90332 11.3023 5.90332L14.5023 5.90332C14.6084 5.90332 14.7102 5.94546 14.7852 6.02048C14.8602 6.09549 14.9023 6.19723 14.9023 6.30332C14.9023 6.40941 14.8602 6.51115 14.7852 6.58616C14.7102 6.66118 14.6084 6.70332 14.5023 6.70332L11.3023 6.70332C11.1963 6.70332 11.0945 6.66118 11.0195 6.58616C10.9445 6.51115 10.9023 6.40941 10.9023 6.30332ZM2.90234 13.5033C2.90234 13.3972 2.94449 13.2955 3.0195 13.2205C3.09452 13.1455 3.19626 13.1033 3.30234 13.1033L14.5023 13.1033C14.6084 13.1033 14.7102 13.1455 14.7852 13.2205C14.8602 13.2955 14.9023 13.3972 14.9023 13.5033C14.9023 13.6094 14.8602 13.7111 14.7852 13.7862C14.7102 13.8612 14.6084 13.9033 14.5023 13.9033L3.30234 13.9033C3.19626 13.9033 3.09452 13.8612 3.0195 13.7862C2.94449 13.7111 2.90234 13.6094 2.90234 13.5033Z" fill="#4B7BEC"/>
              </svg>
          `;
		parentArrow.innerHTML += parentArrowText;
		parentArrow.style.cssText = "display: flex; align-items: center; gap: 6px;";
	});
}

function addTextToTextareaFeedback() {
	const form = document.querySelector("#feedback .wpcf7");
	if (!form) return;
	form.addEventListener("wpcf7beforesubmit", (ev) => {
		form.querySelector("textarea").value +=
			`
          Feedback: ` +
			form.querySelectorAll(".star-con svg.active").length +
			" stars";
	});
}

function addStars() {
	const textarea = document.querySelector("#feedback textarea");
	if (!textarea) return;
	if (document.querySelector(".star-con")) return;
	const starCon = Object.assign(document.createElement("div"), { className: "star-con" });
	for (let i = 0; i < 5; i++) {
		starCon.innerHTML += `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 2.03659L22.6174 10.2287C22.9028 10.735 23.3944 11.0922 23.9641 11.2071L33.1821 13.067L26.8178 19.9899C26.4245 20.4178 26.2367 20.9957 26.3034 21.5731L27.3831 30.9147L18.8323 27.0012C18.3038 26.7593 17.6962 26.7593 17.1677 27.0012L8.61695 30.9147L9.69657 21.5731C9.76331 20.9957 9.57554 20.4178 9.18217 19.9899L2.8179 13.067L12.0359 11.2071C12.6056 11.0922 13.0972 10.735 13.3826 10.2287L18 2.03659Z" stroke="#FFE066" stroke-width="2"/></svg>`;
	}
	const stars = starCon.querySelectorAll("svg");
	for (let i = 0; i < 5; i++) {
		stars[i].addEventListener("click", () => {
			stars.forEach((star) => {
				star.classList.remove("active");
			});
			for (let j = i; j >= 0; j--) {
				stars[j].classList.add("active");
			}
		});
		stars[i].addEventListener("mouseenter", () => {
			stars.forEach((star) => {
				star.classList.remove("hover");
			});
			for (let j = i; j >= 0; j--) {
				stars[j].classList.add("hover");
			}
		});
		stars[i].addEventListener("mouseleave", () => {
			stars.forEach((star) => {
				star.classList.remove("hover");
			});
		});
	}
	const starTitle = Object.assign(document.createElement("div"), { className: "small-text", innerHTML: "We will be grateful for your assessment" });

	textarea.parentNode.parentNode.append(starTitle);
	textarea.parentNode.parentNode.style.flexDirection = "column";
	textarea.parentNode.parentNode.style.gap = "0";

	starTitle.after(starCon);
}

function closeWidgetRemake() {
	document.querySelectorAll(".close-side-widget:not(.check)").forEach((el) => {
		el.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M1.05061 0.55637C0.913929 0.419687 0.692321 0.419687 0.555638 0.55637C0.418954 0.693053 0.418954 0.914662 0.555638 1.05135L9.50426 9.99997L0.555637 18.9486C0.418955 19.0853 0.418955 19.3069 0.555637 19.4436C0.692322 19.5803 0.913929 19.5803 1.05061 19.4436L9.99924 10.4949L18.9479 19.4436C19.0845 19.5803 19.3062 19.5803 19.4428 19.4436C19.5795 19.3069 19.5795 19.0853 19.4428 18.9486L10.4942 9.99997L19.4428 1.05135C19.5795 0.914662 19.5795 0.693053 19.4428 0.55637C19.3062 0.419687 19.0845 0.419687 18.9479 0.55637L9.99924 9.505L1.05061 0.55637Z" fill="#595959"/>
          </svg>
          `;
	});
}

function remakeResetBlock() {
	document.querySelectorAll(".close-side-widget:not(.check)").forEach((el) => {
		el.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M1.05061 0.55637C0.913929 0.419687 0.692321 0.419687 0.555638 0.55637C0.418954 0.693053 0.418954 0.914662 0.555638 1.05135L9.50426 9.99997L0.555637 18.9486C0.418955 19.0853 0.418955 19.3069 0.555637 19.4436C0.692322 19.5803 0.913929 19.5803 1.05061 19.4436L9.99924 10.4949L18.9479 19.4436C19.0845 19.5803 19.3062 19.5803 19.4428 19.4436C19.5795 19.3069 19.5795 19.0853 19.4428 18.9486L10.4942 9.99997L19.4428 1.05135C19.5795 0.914662 19.5795 0.693053 19.4428 0.55637C19.3062 0.419687 19.0845 0.419687 18.9479 0.55637L9.99924 9.505L1.05061 0.55637Z" fill="#595959"/>
          </svg>
          `;
		el.classList.add("check");
	});
}

function addBtnLogout() {
	const menuSidebar = document.querySelector("#menu-account");
	const menuBtn = document.querySelector(".cnss-social-icon");
	const widget = document.querySelector("#custom_html-5.widget-my-account");
	if (!menuSidebar || !menuBtn || !widget) return;
	if (menuSidebar.querySelector(".logout-btn")) return;
	if (window.innerWidth < 768) {
		menuSidebar.append(menuBtn.cloneNode(true));
		const firstA = menuBtn.querySelector("li a");
		if (firstA) {
			firstA.style.marginLeft = 0;
		}
		const entry = document.querySelector(".entry-content .wpb_wrapper");
		const vidget = document.querySelector(".area-sidebar-my-account .widget_custom_html");
		if (entry && vidget) {
			entry.prepend(vidget);
			vidget.style.marginTop = "20px";
		}
		const block = document.querySelector(".main-page-wrapper .page .woocommerce-my-account-wrapper") ? document.querySelector(".main-page-wrapper .page .woocommerce-my-account-wrapper") : document.querySelector(".main-page-wrapper .page");
		if (block) {
			block.prepend(widget);
		}
	}
	menuSidebar.append(
		Object.assign(document.createElement("a"), {
			innerHTML: `<span>Exit</span> <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M9.77763 3.69322C9.85911 3.62536 9.96422 3.59263 10.0698 3.60223C10.1754 3.61183 10.2729 3.66298 10.3408 3.74442L12.0072 5.74442C12.0721 5.82623 12.1025 5.93017 12.0918 6.03404C12.0811 6.13792 12.0302 6.23349 11.95 6.30034C11.8697 6.36719 11.7666 6.40002 11.6625 6.39181C11.5584 6.38361 11.4616 6.33502 11.3928 6.25642L9.72643 4.25642C9.65856 4.17494 9.62583 4.06984 9.63543 3.96423C9.64503 3.85861 9.69618 3.76114 9.77763 3.69322Z" fill="#FAFAFA"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M9.77763 8.30735C9.69618 8.23944 9.64503 8.14196 9.63543 8.03635C9.62583 7.93074 9.65856 7.82564 9.72643 7.74415L11.3928 5.74415C11.426 5.70237 11.4672 5.66764 11.5139 5.642C11.5607 5.61637 11.6121 5.60035 11.6652 5.59488C11.7182 5.58941 11.7719 5.59461 11.8229 5.61017C11.8739 5.62573 11.9213 5.65134 11.9622 5.68548C12.0032 5.71963 12.037 5.76163 12.0615 5.809C12.086 5.85637 12.1007 5.90817 12.1049 5.96134C12.1091 6.01451 12.1026 6.06799 12.0859 6.11862C12.0691 6.16924 12.0423 6.21601 12.0072 6.25615L10.3408 8.25615C10.2729 8.3376 10.1754 8.38874 10.0698 8.39834C9.96422 8.40794 9.85911 8.37521 9.77763 8.30735Z" fill="#FAFAFA"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M11.4998 6C11.4998 6.10609 11.4577 6.20783 11.3826 6.28284C11.3076 6.35786 11.2059 6.4 11.0998 6.4H5.0998C4.99372 6.4 4.89198 6.35786 4.81696 6.28284C4.74195 6.20783 4.6998 6.10609 4.6998 6C4.6998 5.89391 4.74195 5.79217 4.81696 5.71716C4.89198 5.64214 4.99372 5.6 5.0998 5.6H11.0998C11.2059 5.6 11.3076 5.64214 11.3826 5.71716C11.4577 5.79217 11.4998 5.89391 11.4998 6ZM0.299805 0.4C0.299805 0.293913 0.341948 0.192172 0.416962 0.117157C0.491977 0.0421428 0.593718 0 0.699805 0H7.8998C8.00589 0 8.10763 0.0421428 8.18265 0.117157C8.25766 0.192172 8.2998 0.293913 8.2998 0.4C8.2998 0.506087 8.25766 0.607828 8.18265 0.682843C8.10763 0.757857 8.00589 0.8 7.8998 0.8H0.699805C0.593718 0.8 0.491977 0.757857 0.416962 0.682843C0.341948 0.607828 0.299805 0.506087 0.299805 0.4ZM0.299805 11.6C0.299805 11.4939 0.341948 11.3922 0.416962 11.3172C0.491977 11.2421 0.593718 11.2 0.699805 11.2H7.8998C8.00589 11.2 8.10763 11.2421 8.18265 11.3172C8.25766 11.3922 8.2998 11.4939 8.2998 11.6C8.2998 11.7061 8.25766 11.8078 8.18265 11.8828C8.10763 11.9579 8.00589 12 7.8998 12H0.699805C0.593718 12 0.491977 11.9579 0.416962 11.8828C0.341948 11.8078 0.299805 11.7061 0.299805 11.6Z" fill="#FAFAFA"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M7.8998 0C8.00589 0 8.10763 0.0421428 8.18265 0.117157C8.25766 0.192172 8.2998 0.293913 8.2998 0.4V3.6C8.2998 3.70609 8.25766 3.80783 8.18265 3.88284C8.10763 3.95786 8.00589 4 7.8998 4C7.79372 4 7.69198 3.95786 7.61696 3.88284C7.54195 3.80783 7.4998 3.70609 7.4998 3.6V0.4C7.4998 0.293913 7.54195 0.192172 7.61696 0.117157C7.69198 0.0421428 7.79372 0 7.8998 0ZM7.8998 8C8.00589 8 8.10763 8.04214 8.18265 8.11716C8.25766 8.19217 8.2998 8.29391 8.2998 8.4V11.6C8.2998 11.7061 8.25766 11.8078 8.18265 11.8828C8.10763 11.9579 8.00589 12 7.8998 12C7.79372 12 7.69198 11.9579 7.61696 11.8828C7.54195 11.8078 7.4998 11.7061 7.4998 11.6V8.4C7.4998 8.29391 7.54195 8.19217 7.61696 8.11716C7.69198 8.04214 7.79372 8 7.8998 8ZM0.699805 0C0.805891 0 0.907633 0.0421428 0.982647 0.117157C1.05766 0.192172 1.0998 0.293913 1.0998 0.4V11.6C1.0998 11.7061 1.05766 11.8078 0.982647 11.8828C0.907633 11.9579 0.805891 12 0.699805 12C0.593718 12 0.491977 11.9579 0.416962 11.8828C0.341948 11.8078 0.299805 11.7061 0.299805 11.6V0.4C0.299805 0.293913 0.341948 0.192172 0.416962 0.117157C0.491977 0.0421428 0.593718 0 0.699805 0Z" fill="#FAFAFA"/>
          </svg>
          `,
			href: registrtationInfo.exit,
			className: "logout-btn very-black-btn",
		})
	);
}

function checkClassBody() {
	if (!document.querySelector("body")) {
		setTimeout(checkClassBody, 5);
		return;
	}
	if (!document.querySelector("body").classList.contains("woodmart-archive-shop")) return;
	if (!document.querySelector(".vc_grid-container")) {
		setTimeout(checkClassBody, 5);
		return;
	}
	document.querySelector(".vc_grid-container").dataset.vcGridSettings.replace("336", document.querySelector("body").dataset.id);
}

function addBurger() {
	if (window.innerWidth > 768) return;
	if (document.querySelector(".my-account__sidebar")) return;
	const menu = document.querySelector(".wd-my-account-sidebar, .area-sidebar-my-account");
	if (!menu) return;

	const fixedcon = Object.assign(document.createElement("div"), { className: "my-account__sidebar" });

	menu.classList.add("hidden-burger");
	fixedcon.innerHTML = `
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="21.334" y="8" width="5.33333" height="5.33333" rx="2.66667" fill="#FAFAFA"/>
          <rect x="21.334" y="21.334" width="5.33333" height="5.33333" rx="2.66667" fill="#FAFAFA"/>
          <rect x="21.334" y="34.666" width="5.33333" height="5.33333" rx="2.66667" fill="#FAFAFA"/>
      </svg>
      <span>${registrtationInfo.company}</span>
      `;
	document.body.append(fixedcon);
	const svg = fixedcon.querySelector("svg");
	let passClick = true;
	const pass = () => {
		passClick = false;
		setTimeout(() => {
			passClick = true;
		}, 300);
	};
	svg.addEventListener("click", () => {
		if (!passClick) return;
		if (menu.classList.contains("hidden-burger")) {
			menu.classList.remove("hidden-burger");
			show(menu, 300, "block");
			document.documentElement.style.overflow = "hidden";
			pass();
		} else {
			menu.classList.add("hidden-burger");
			document.documentElement.style.overflow = "auto";
			hide(menu, 300);
			pass();
		}
	});
}

async function addClassToBody() {
	const el = await elementReady("#menu-account");
	document.body.classList.add("my-account");
}

function usefulCustomRequest(estimation, postId) {
	let formData = new FormData();
	formData.append("post_id", postId);
	formData.append("estimation", estimation);
	formData.append("action", "articles_action");
	formData.append("articles-nonce", articles.nonce);

	let xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
			}
		}
	};

	xhr.open("POST", articles.url, true);
	xhr.responseType = "";
	xhr.send(formData);

	xhr.onload = function () {
		console.log(xhr.response);
	};
}

function eventForUsefulBtns() {
	if (!document.querySelector("body.single") && !document.querySelector("body.single-post")) return;
	if (!document.querySelector("#comments")) return;
	const useful = document.querySelector("#useful");
	if (!useful) return;
	if (useful.querySelector("button")) return;
	// const allEls = document.querySelector('.site-content .post .entry-content.wd-entry-content .wpb-content-wrapper');

	useful.innerHTML = `
          <div class="useful-title">War der Artikel für Sie nützlich?</div>
          <div class="useful-btns">
              <button type="button" class="useful" id="useful-yes">Ja</button><button type="button" id="useful-no" class="useful">Nein</button>
          </div>`;

	// console.log(allEls.length);
	// allEls.append(useful);
	// useful.style.marginBottom = '100px';

	const yesBtn = useful.querySelector("#useful-yes");
	const noBtn = useful.querySelector("#useful-no");

	let postId = document.body.dataset.id;

	yesBtn.addEventListener("click", () => {
		if (yesBtn.classList.contains("active")) return;

		noBtn.classList.contains("active") && noBtn.classList.remove("active");
		yesBtn.classList.add("active");

		usefulCustomRequest("yes", postId);
		localStorage.setItem(postId + "lastanswer", "yes");
	});

	noBtn.addEventListener("click", () => {
		if (noBtn.classList.contains("active")) return;

		yesBtn.classList.contains("active") && yesBtn.classList.remove("active");
		noBtn.classList.add("active");

		usefulCustomRequest("no", postId);
		localStorage.setItem(postId + "lastanswer", "no");
	});

	if (localStorage.getItem(postId + "lastanswer") != null) {
		if (localStorage.getItem(postId + "lastanswer") == "yes") {
			yesBtn.classList.add("active");
		} else {
			noBtn.classList.add("active");
		}
	}
}

function remakeSvgAccount() {
	document.querySelectorAll('.wd-info-box-link[href="/account"]:not(.custom-btn-hed)').forEach((el) => {
		const parent = el.closest(".info-box-wrapper");
		if (!parent) return;

		const parentImg = parent.querySelector(".info-svg-wrapper");
		if (!parentImg) return;

		parent.classList.add("custom-btn-hede");

		el.classList.add("custom-btn-hed");

		parentImg.innerHTML = `
  <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M18.6067 24.6575C17.4434 25.5633 16.6668 26.9128 16.6668 28.742C16.6668 29.3675 16.828 29.942 17.0848 30.3415C17.3424 30.7423 17.6308 30.8784 17.8494 30.8784H28.1496C28.3682 30.8784 28.6566 30.7423 28.9143 30.3415C29.1711 29.942 29.3323 29.3675 29.3323 28.742C29.3323 26.9059 28.5552 25.5551 27.3925 24.6505C26.2154 23.7347 24.6206 23.262 23 23.2635C21.3795 23.265 19.7843 23.7407 18.6067 24.6575ZM28.0484 23.8074C29.4608 24.9063 30.4004 26.5633 30.4004 28.742C30.4004 29.533 30.1999 30.317 29.8128 30.9191C29.4265 31.5199 28.8416 31.9465 28.1496 31.9465H17.8494C17.1574 31.9465 16.5725 31.5199 16.1863 30.9191C15.7992 30.317 15.5986 29.533 15.5986 28.742C15.5986 26.5692 16.5387 24.914 17.9505 23.8147C19.348 22.7266 21.1861 22.197 22.999 22.1953C24.8119 22.1936 26.6505 22.7198 28.0484 23.8074Z" fill="#333333"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M22.9997 13.6346C21.3985 13.6346 20.1004 14.9326 20.1004 16.5339C20.1004 18.1352 21.3985 19.4332 22.9997 19.4332C24.601 19.4332 25.899 18.1352 25.899 16.5339C25.899 14.9326 24.601 13.6346 22.9997 13.6346ZM19.0322 16.5339C19.0322 14.3427 20.8085 12.5664 22.9997 12.5664C25.1909 12.5664 26.9672 14.3427 26.9672 16.5339C26.9672 18.7251 25.1909 20.5014 22.9997 20.5014C20.8085 20.5014 19.0322 18.7251 19.0322 16.5339Z" fill="#333333"/>
  </svg>
      `;
	});
}

function remakeSvg(block, classBlock, svgHTML, parentClass, parentAnClass = false) {
	document.querySelectorAll(block).forEach((el) => {
		const parent = el.parentNode;

		if (!parent) return;
		if (parent.classList.contains(classBlock)) return;

		parent.classList.add(classBlock);
		parent.innerHTML = svgHTML;

		if (!parentClass) return;

		const overParent = parent.closest(parentClass);
		if (!overParent) return;

		overParent.classList.add(parentAnClass);
	});
}

function remakeSvgContact() {
	document.querySelectorAll('.wd-info-box-link[href="#contact"]:not(.custom-btn-hed)').forEach((el) => {
		const parent = el.closest(".info-box-wrapper");
		if (!parent) return;

		const parentImg = parent.querySelector(".info-svg-wrapper");
		if (!parentImg) return;

		parent.classList.add("custom-btn-hede");

		el.classList.add("custom-btn-hed");

		parentImg.innerHTML = `
  <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M18.0288 13.5349C18.3898 13.5444 18.7199 13.7695 18.8603 14.1025L21.0096 18.8955C21.0667 19.0292 21.0916 19.1745 21.0823 19.3196C21.073 19.4647 21.0298 19.6056 20.9561 19.731L20.939 19.7602L19.3775 21.7674L19.3758 21.7696L19.3672 21.7807C19.3045 21.8795 19.2676 21.9926 19.26 22.1096C19.2523 22.2288 19.2753 22.348 19.3269 22.4558C20.1582 24.1566 21.891 25.8788 23.6145 26.7117C23.723 26.7626 23.8427 26.7847 23.9622 26.7759C24.0779 26.7673 24.1896 26.7301 24.2872 26.6676L24.3024 26.656L26.2297 25.0715L26.2609 25.0524C26.3854 24.9764 26.5261 24.931 26.6716 24.9199C26.8171 24.9089 26.9631 24.9327 27.0977 24.9891L27.1092 24.994L31.9019 27.1425C32.0833 27.2199 32.2355 27.3533 32.3361 27.5232C32.4381 27.6955 32.4817 27.8962 32.4603 28.0953L32.4589 28.1081C32.2988 29.317 31.7037 30.4262 30.7852 31.2283C29.8669 32.0302 28.6881 32.4703 27.469 32.4663C19.7847 32.4658 13.5332 26.2131 13.5332 18.5282C13.5332 17.5207 13.9609 16.1408 14.7711 15.2129C15.1227 14.8102 15.6232 14.3824 16.1791 14.0602C16.724 13.7445 17.3783 13.498 18.0288 13.5349ZM16.7023 14.9631C16.2483 15.2262 15.836 15.5799 15.5571 15.8992C14.93 16.6175 14.5767 17.7458 14.5767 18.5282C14.5767 25.6372 20.3616 31.4227 27.4699 31.4227L27.4717 31.4227C28.4374 31.4261 29.3713 31.0776 30.0988 30.4423C30.8022 29.8281 31.266 28.9864 31.4106 28.0658L26.7641 25.983L24.9408 27.4821L24.8906 27.5195L24.8778 27.5281C24.6278 27.6951 24.3388 27.7944 24.039 27.8165C23.7392 27.8387 23.4388 27.7828 23.167 27.6544L23.163 27.6525C21.2292 26.7188 19.3234 24.8263 18.3884 22.9121L18.387 22.9092C18.2573 22.6395 18.1994 22.3409 18.2187 22.0422C18.238 21.744 18.3337 21.4557 18.4966 21.2052C18.5115 21.1822 18.5253 21.1637 18.5344 21.1518L18.5456 21.1373L18.5504 21.1312L18.5521 21.1289L20.0208 19.2409L17.9286 14.5751C17.5733 14.5669 17.1441 14.7071 16.7023 14.9631Z" fill="#333333"/>
  </svg>
      `;
	});
}

function addSliderClass(idFind, idSwiper, customClasses = "") {
	let seoSwiper;
	if (typeof Swiper === "undefined") return;
	if (window.innerWidth > 768) {
		const seoCat = document.querySelector(idFind);
		if (!seoCat) return;

		if (!seoCat.classList.contains("swiper-wrapper")) return;

		const seoParent = seoCat.closest(".vc_section");
		if (!seoParent) return;

		seoCat.querySelectorAll(".wpb_column").forEach((slide) => {
			slide.classList.remove("swiper-slide");
		});

		seoParent.classList.remove("swiper");
		seoCat.classList.remove("swiper-wrapper");

		if (typeof seoSwiper === "object") {
			seoSwiper.destroy();
		}
	} else {
		const seoCat = document.querySelector(idFind);

		if (!seoCat) return;
		if (seoCat.classList.contains("swiper-wrapper") || seoCat.classList.contains("swiper")) return;

		if (seoCat.classList.contains("vc_row")) {
			const swiperWrapper = Object.assign(document.createElement("div"), { className: "swiper-wrapper", id: "custom-swiper-wrapper" });

			seoCat.querySelectorAll(".wpb_column").forEach((slide) => {
				if (slide.querySelector(".wpb_wrapper").innerHTML == "") {
					slide.remove();
					return;
				}
				slide.classList.add("swiper-slide");
				swiperWrapper.append(slide);
			});

			if (customClasses != "") {
				seoCat.classList.add(customClasses);
			}
			seoCat.classList.add("custom-swiper");
			seoCat.append(swiperWrapper);
			seoCat.classList.add("swiper");
			const swiperPag = Object.assign(document.createElement("div"), { className: "latest-posts__pag" });
			seoCat.append(swiperPag);

			seoSwiper = new Swiper(idFind, {
				spaceBetween: 8,
				slidesOffsetAfter: 15,
				pagination: {
					el: idFind + " .latest-posts__pag",
					type: "bullets",
				},

				breakpoints: {
					300: {
						slidesPerView: 1.2,
						spaceBetween: 8,
					},
					568: {
						slidesPerView: 1.7,
						spaceBetween: 8,
					},
					768: {
						slidesPerView: 2,
						spaceBetween: 8,
					},
				},
			});

			if (swiperPag.getBoundingClientRect().left < 5) {
				swiperPag.style.cssText = "margin-left: 15px  !important;";
			}
		} else {
			const seoParent = seoCat.closest(".vc_section");
			if (!seoParent) return;

			seoParent.classList.add("swiper");
			seoParent.id = idSwiper;
			seoCat.classList.add("swiper-wrapper");
			seoCat.querySelectorAll(".wpb_column").forEach((slide) => {
				slide.classList.add("swiper-slide");
			});

			if (customClasses != "") {
				seoParent.classList.add(customClasses);
			}

			seoSwiper = new Swiper("#" + idSwiper, {
				spaceBetween: 8,
				slidesOffsetAfter: 15,
				breakpoints: {
					300: {
						slidesPerView: 1.2,
						spaceBetween: 8,
					},
					568: {
						slidesPerView: 1.7,
						spaceBetween: 8,
					},
					768: {
						slidesPerView: 2,
						spaceBetween: 8,
					},
				},
			});
		}
	}
}

function addArrows() {
	document.querySelectorAll(".category-grid-item .wd-entities-title:not(.el-with-arrow)").forEach((el) => {
		if (el.querySelector("svg")) return;
		el.innerHTML += `<span><svg width="19" height="10" viewBox="0 0 19 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M18.5172 5.39953L18.9004 5.03655L18.5172 4.67358L14.3719 0.7464C14.1714 0.556484 13.855 0.565038 13.665 0.765504C13.4751 0.96597 13.4837 1.28244 13.6841 1.47235L16.9182 4.53619H0.555542C0.2794 4.53619 0.055542 4.76004 0.055542 5.03619C0.055542 5.31233 0.2794 5.53619 0.555542 5.53619H16.919L13.6841 8.60076C13.4837 8.79067 13.4751 9.10714 13.665 9.3076C13.855 9.50807 14.1714 9.51662 14.3719 9.32671L18.5172 5.39953Z" fill="#595959"/>
              </svg></span>
          `;
		el.classList.add("el-with-arrow");
	});
}

function addSvgToGallery() {
	document.querySelectorAll(".woodmart-show-product-gallery:not(.propped)").forEach((el) => {
		el.classList.add("propped");
		el.innerHTML = `<svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_d_1931_5716)">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M46.2863 8.69504V7.7124L45.3037 7.71251L30.8736 7.71416C30.331 7.71422 29.8911 8.15417 29.8912 8.6968C29.8913 9.23944 30.3312 9.67929 30.8738 9.67922L42.9298 9.67785L34.9271 17.6805L30.9266 21.6792C30.5428 22.0629 30.5428 22.685 30.9266 23.0687C31.3103 23.4524 31.9324 23.4524 32.3161 23.0687L36.3176 19.069L44.3213 11.0654L44.3213 23.1618C44.3213 23.7044 44.7612 24.1443 45.3038 24.1443C45.8464 24.1443 46.2863 23.7044 46.2863 23.1618L46.2863 8.69504Z" fill="white"/>
          </g>
          <g filter="url(#filter1_d_1931_5716)">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M7.71553 45.3037L7.71553 46.2863L8.69817 46.2862L23.1282 46.2846C23.6709 46.2845 24.1107 45.8446 24.1107 45.3019C24.1106 44.7593 23.6707 44.3195 23.128 44.3195L11.0721 44.3209L19.0747 36.3183L23.0765 32.3184C23.4602 31.9347 23.4602 31.3126 23.0765 30.9289C22.6928 30.5452 22.0707 30.5452 21.687 30.9289L17.6842 34.9298L9.68059 42.9334L9.6806 30.837C9.6806 30.2943 9.2407 29.8544 8.69806 29.8544C8.15542 29.8544 7.71553 30.2943 7.71553 30.837L7.71553 45.3037Z" fill="white"/>
          </g>
          <defs>
          <filter id="filter0_d_1931_5716" x="25.8912" y="3.71289" width="24.3951" height="24.4316" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset/>
          <feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1931_5716"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1931_5716" result="shape"/>
          </filter>
          <filter id="filter1_d_1931_5716" x="3.71558" y="25.8535" width="24.3951" height="24.4336" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset/>
          <feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1931_5716"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1931_5716" result="shape"/>
          </filter>
          </defs>
          </svg>
          `;
	});
}

function moveLabels() {
	document.querySelectorAll(".wd-product .product-image-link .product-labels").forEach((el) => {
		el.closest(".product-wrapper").append(el);
	});
}

function hideBlocks() {
	const block = document.querySelector(".account__main:not(.check)");

	if (!block) return;

	block.classList.add("check");

	const parent = block.closest(".woocommerce-MyAccount-content");

	if (!parent) return;

	const links = parent.querySelector(".wd-my-account-links");

	if (!links) return;

	parent.querySelectorAll("p").forEach((el) => {
		el.remove();
	});

	links.remove();
}

function removeBlocks() {
	const form = document.querySelector(".woocommerce-EditAccountForm");

	if (!form) return;

	document.querySelectorAll('[name="account_first_name"], [name="account_last_name"], [name="account_display_name"], [name="account_email"], fieldset').forEach((el) => {
		if (el.tagName == "FIELDSET") {
			el.remove();
		} else {
			el.parentNode.remove();
		}
	});
}

function initSvgsFooter(classBlock, clss) {
	remakeSvg(
		'[src="https://zuchelkueche.com/wp-content/uploads/2024/04/Location.svg"]',
		"custom-svg",
		`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9 16C9 16 4 9.609 4 6.9C4 6.25652 4.12933 5.61935 4.3806 5.02485C4.63188 4.43036 5.00017 3.89018 5.46447 3.43518C5.92876 2.98017 6.47995 2.61924 7.08658 2.37299C7.69321 2.12674 8.34339 2 9 2C9.65661 2 10.3068 2.12674 10.9134 2.37299C11.52 2.61924 12.0712 2.98017 12.5355 3.43518C12.9998 3.89018 13.3681 4.43036 13.6194 5.02485C13.8707 5.61935 14 6.25652 14 6.9C14 9.609 9 16 9 16ZM9 8.3C9.37888 8.3 9.74224 8.1525 10.0102 7.88995C10.2781 7.6274 10.4286 7.2713 10.4286 6.9C10.4286 6.5287 10.2781 6.1726 10.0102 5.91005C9.74224 5.6475 9.37888 5.5 9 5.5C8.62112 5.5 8.25776 5.6475 7.98985 5.91005C7.72194 6.1726 7.57143 6.5287 7.57143 6.9C7.57143 7.2713 7.72194 7.6274 7.98985 7.88995C8.25776 8.1525 8.62112 8.3 9 8.3Z" fill="#FAFAFA"/>
  </svg>
  `,
		classBlock,
		clss
	);

	remakeSvg(
		'[src="https://zuchelkueche.com/wp-content/uploads/2024/04/Letter.svg"]',
		"custom-svg",
		`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M2.0001 4.87029L8.99995 10.8046L15.9999 4.87029C15.9999 4.87029 16 11.2251 16 14C11.3338 14 6.66661 14 2.00001 14C1.99997 11.0561 2.0001 4.87029 2.0001 4.87029ZM14.9675 4.00126L9.00354 9.34898L3.03749 4L14.9675 4.00126Z" fill="#FAFAFA"/>
  </svg>
  `,
		classBlock,
		clss
	);

	remakeSvg(
		'[src="https://zuchelkueche.com/wp-content/uploads/2024/04/Phone-solid.svg"]',
		"custom-svg",
		`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M13.9986 13.2594C14.5459 12.7805 14.9001 12.1188 14.9952 11.3978C15.0126 11.251 14.9823 11.1025 14.9087 10.9744C14.8352 10.8462 14.7222 10.7452 14.5867 10.6862L11.8813 9.4739C11.7763 9.42868 11.6617 9.41034 11.5479 9.42054C11.4341 9.43075 11.3246 9.46917 11.2293 9.53234C11.2217 9.53717 11.2144 9.54253 11.2075 9.54838L9.78264 10.7584C9.75102 10.7777 9.71513 10.7889 9.67815 10.791C9.64117 10.7931 9.60425 10.786 9.57065 10.7704C8.6402 10.3213 7.6771 9.36562 7.22792 8.44608C7.21203 8.41273 7.20466 8.37597 7.20646 8.33907C7.20826 8.30218 7.21917 8.26631 7.23823 8.23467L8.45286 6.79033C8.45858 6.78345 8.46374 6.77601 8.4689 6.76856C8.53169 6.67334 8.5698 6.564 8.5798 6.45038C8.5898 6.33676 8.57138 6.22244 8.52619 6.11772L7.3173 3.41696C7.25874 3.28017 7.15739 3.16607 7.02846 3.09179C6.89953 3.01752 6.74998 2.98707 6.60228 3.00503C5.88128 3.10009 5.21954 3.45435 4.74066 4.00165C4.26177 4.54894 3.9985 5.25185 4.00001 5.97907C4.00001 10.402 7.59804 14 12.0211 14C12.7483 14.0015 13.4512 13.7382 13.9986 13.2594Z" fill="#FAFAFA"/>
  </svg>
  `,
		classBlock,
		clss
	);

	remakeSvg(
		'[src="https://zuchelkueche.com/wp-content/uploads/2024/04/WhatApp.svg"]',
		"custom-svg",
		`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M2.33334 9.0139C2.33455 10.1321 2.61692 11.2322 3.15456 12.213C3.29748 12.4737 3.34916 12.7747 3.30138 13.0682L2.98469 15.0133L4.93182 14.6967C5.22522 14.649 5.52616 14.7006 5.78682 14.8435C9.01698 16.6144 13.072 15.4327 14.8432 12.205C16.6144 8.97734 15.4334 4.92591 12.2035 3.15511C11.2226 2.61728 10.1216 2.33463 9.00254 2.33333C5.3145 2.33811 2.32931 5.32953 2.33334 9.0139ZM1.37115 16.6266L1.98537 12.8539C1.34029 11.6771 1.00146 10.3572 1 9.01534C0.995166 4.59338 4.57816 1.00484 9.00246 1C10.3455 1.00129 11.667 1.34035 12.8445 1.98597C16.7201 4.11081 18.1377 8.97292 16.0121 12.8465C13.8865 16.72 9.02107 18.1372 5.14586 16.0127L1.37115 16.6266Z" fill="#FAFAFA"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M12.2717 12.4614C12.6697 12.1131 12.9274 11.6318 12.9965 11.1075C13.0092 11.0007 12.9871 10.8928 12.9336 10.7995C12.8801 10.7063 12.798 10.6328 12.6994 10.59L10.7319 9.70829C10.6555 9.6754 10.5722 9.66207 10.4894 9.66949C10.4066 9.67691 10.3269 9.70485 10.2577 9.75079C10.2521 9.75431 10.2468 9.7582 10.2418 9.76246L9.20555 10.6425C9.18256 10.6565 9.15646 10.6646 9.12956 10.6662C9.10267 10.6677 9.07582 10.6626 9.05138 10.6512C8.37469 10.3245 7.67426 9.62954 7.34758 8.96078C7.33602 8.93653 7.33066 8.90979 7.33197 8.88296C7.33328 8.85613 7.34122 8.83004 7.35508 8.80703L8.23844 7.7566C8.24261 7.7516 8.24636 7.74619 8.25011 7.74077C8.29577 7.67152 8.32349 7.592 8.33076 7.50937C8.33804 7.42674 8.32464 7.34359 8.29178 7.26743L7.41258 5.30324C7.37 5.20376 7.29628 5.12078 7.20252 5.06676C7.10875 5.01274 6.99999 4.9906 6.89256 5.00366C6.3682 5.07279 5.88694 5.33044 5.53866 5.72847C5.19038 6.12651 4.99891 6.63771 5 7.1666C5 10.3833 7.61675 13 10.8335 13C11.3624 13.0011 11.8736 12.8096 12.2717 12.4614Z" fill="#FAFAFA"/>
  </svg>
  `,
		classBlock,
		clss
	);
}

class formValidateCustom {
	constructor(formEl, btn, check = false) {
		this.form = formEl;
		formEl.classList.add("as-validate");

		this.inputs = formEl.querySelectorAll('input[type="text"], textarea, input[type="tel"], input[type="number"], input[type="email"], input[type="password"]');
		this.btn = btn;
		this.check = check;

		this._initAll();
	}

	_initAll() {
		this._changeStateBtn();
		this._validateInputsEvents();
	}

	_validateInputsEvents() {
		if (this.check) {
			this.check.addEventListener("change", () => {
				this._changeStateBtn();
			});
		}

		this.inputs.forEach((input) => {
			// this._checkValidate(input);

			input.addEventListener(
				"input",
				throttle(() => {
					this._changeStateBtn();

					if (this._checkValidate(input)) {
						console.log("valid");
						this._inputValid(input);
					} else {
						console.log("notvalid");
						this._inputNotValid(input);
					}
				}, 300)
			);

			input.addEventListener("change", () => {
				setTimeout(() => {
					this._changeStateBtn();

					if (this._checkValidate(input)) {
						console.log("valid");
						this._inputValid(input);
					} else {
						console.log("notvalid");
						this._inputNotValid(input);
					}
				});
			});
		});
	}

	_changeStateBtn() {
		if (this._validateAllInputs()) {
			this.btn.disabled = false;
			this.btn.style.cssText = "opacity: 1; pointer-events: all;";
		} else {
			this.btn.disabled = true;
			this.btn.style.cssText = "opacity: 0.6; pointer-events: none;";
		}
	}

	_validateAllInputs() {
		let validate = true;

		if (this.check) {
			if (!this.check.checked) {
				return false;
			}
		}

		this.inputs.forEach((input) => {
			if (!this._checkValidate(input)) validate = false;
		});

		return validate;
	}

	_inputValid(input) {
		input.classList.remove("wpcf7-not-valid-custom");
		input.classList.add("wpcf7-valid");
	}

	_inputNotValid(input) {
		input.classList.remove("wpcf7-valid");
		input.classList.add("wpcf7-not-valid-custom");
	}

	_checkValidate(input) {
		if (input.ariaRequired == null && !input.required) {
			return true;
		} else if (input.ariaRequired == "false") {
			return true;
		}

		const InpValue = input.value.replaceAll(" ", "");

		switch (input.type) {
			case "tel":
				if (input.value.length < 18) {
					// this._inputNotValid(input);

					return false;
				} else {
					// this._inputValid(input);

					return true;
				}

			case "text":
				if (InpValue.length < 3) {
					// this._inputNotValid(input);

					return false;
				} else {
					// this._inputValid(input);

					return true;
				}

			case "password":
				if (InpValue.length < 7) {
					// this._inputNotValid(input);

					return false;
				} else {
					// this._inputValid(input);

					return true;
				}

			case "number":
				if (input.name != "lidzip") return true;

				if (input.value.length < 5 || input.value.length > 6) {
					// this._inputNotValid(input);

					return false;
				} else {
					// this._inputValid(input);

					return true;
				}

			case "email":
				const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				console.log(regex.test(input.value));
				if (InpValue.length < 6 || !regex.test(input.value)) {
					// this._inputNotValid(input);

					return false;
				} else {
					// this._inputValid(input);

					return true;
				}

			default:
				return true;
		}
	}
}

function formValidate() {
	document.querySelectorAll(".wpcf7-form").forEach((el) => {
		if (el.classList.contains("as-validate")) return;

		const btn = el.querySelector(".wpcf7-submit");
		const check = el.querySelector('[name="lidacceptance"]');
		if (!btn || !check) return;

		const validate = new formValidateCustom(el, btn, check);
	});
}

function loginValidate() {
	const form = document.getElementById("loginform");

	if (!form) return;
	if (form.classList.contains("as-validate")) return;

	const btn = form.querySelector('[name="wp-submit"]');

	if (!btn) return;

	const validate = new formValidateCustom(form, btn);
}

function regValidate() {
	const form = document.querySelector(".form-registration");

	if (!form) return;
	if (form.classList.contains("as-validate")) return;

	const btn = form.querySelector('[type="submit"]');
	const check = form.querySelector('[type="radio"]');

	if (!btn || !check) return;

	const validate = new formValidateCustom(form, btn, check);
}

function regValidateAccount() {
	const formIn = document.querySelector(".form-registration");

	if (!formIn) return;

	const form = formIn.closest("form");

	if (!form) return;

	if (form.classList.contains("as-validate")) return;

	const btn = form.querySelector('[type="submit"]');

	if (!btn) return;
	const validate = new formValidateCustom(form, btn);
}

function initAllElementsObserver() {
	const observer = new MutationObserver((mutations, obs) => {
		hideBlocks();
		addStars();
		addFiltersIcon();
		checkDom();
		reworkArrows();
		reworkIconsAcc();
		reworkPaginationSliders();
		reworkDownload();
		popupInitQuiz(".quiz", ".popup__inner", '[href="#quiz"]', ".quiz__close", 300, "block");
		recentlyViewed();
		initSwiperQuiz();
		initSwiperLatestPosts();
		initSwiperLatestPostsAccount();
		addBtnLogout();
		addBurger();
		remakeResetBlock();
		addSliderClass("#seo-category", "seoswiper");
		addSliderClass("#about-category", "about-category", "dark-pag");
		checkboxCustom(".form-row label", "input", "svg");
		addClassActive();
		addArrows();
		addSvgToGallery();
		moveLabels();
		initWpCf7CustomUpload();
		eventForUsefulBtns();
		addArrowsPswp();
		addPsWpBtn();
		passDoesntMuchUpdate();
		removeBlocks();
		remakeSvgAccount();
		remakeSvgContact();
		initSvgsFooter(".wd-info-box", "box-hover");
		formValidate();
		loginValidate();
		regValidate();
		regValidateAccount();
	});

	observer.observe(document.documentElement, { childList: true, subtree: true });
}

export function init() {
	addClassToBody();
	initAllElementsObserver();
	addtoBurger();
	recentlyViewed();
	checkClassBody();

	window.addEventListener(
		"resize",
		throttle(() => {
			if (window.innerWidth < 1200) {
				moveFilter();
				addResetFiltersPc();
			} else {
				moveFilterAnother();
				removeClassFilters();
				addResetFiltersMobile();
			}

			addBtnLogout();
			addBurger();
		}, 400)
	);

	document.addEventListener("DOMContentLoaded", () => {
		window.innerWidth > 768 ? quizAssistance() : addAcc();
		redirectYourRequest();
		redirectFeedback();
		addTextToTextareaFeedback();
		addAccrodionForMobile();
		eventForUsefulBtns();
		initRegistration();
		initPopupAll();
	});
}
