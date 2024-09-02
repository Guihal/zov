export async function elementReady(selector) {
	return new Promise((resolve) => {
		const observer = new MutationObserver((mutations, obs) => {
			const block = document.querySelector(selector);
			if (block) {
				resolve(block);
				obs.disconnect();
			}
		});

		observer.observe(document.documentElement, { childList: true, subtree: true });
	});
}
