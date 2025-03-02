class VGLoadMore {
	constructor(btn, arg, callback) {
		this.btn = btn || undefined;

		if (this.btn) {
			this.settings = mergeDeepObject({
				route: this.btn.dataset.route || '',
				offset: parseInt(this.btn.dataset.offset) || 0,
				limit: parseInt(this.btn.dataset.limit) || 12
			}, arg);

			this.fOffset = this.settings.offset;

			if (this.settings.route) {
				this.click(this.btn, callback)
			} else {
				console.error('Initialization failed')
			}
		} else {
			console.error('Initialization failed')
		}
	}

	click(btn, callback) {
		const _this = this;

		btn.onclick = function (event) {
			let btnText = btn.innerText;

			if (callback && 'onClick' in callback) {
				if (typeof callback.onClick === 'function') callback.onClick(_this, event)
			}

			_this.run(btnText, callback);

			return false;
		}
	}

	run(btnText, callback) {
		const _this = this;

		let limit = _this.settings.limit,
			offset = _this.settings.offset;

		let xhr = new XMLHttpRequest(),
			route = _this.settings.route + '?limit=' + limit + '&offset=' + offset;

		xhr.open("GET", route, true);

		xhr.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				_this.settings.offset = _this.fOffset + _this.settings.offset;
				_this.btn.innerText = btnText;

				if (callback && 'onLoad' in callback) {
					if (typeof callback.onLoad === 'function') callback.onLoad(_this, this.responseText)
				}
			}
		}
		xhr.send();
	}
}

/**
 * Глубокое объединение объектов
 * @param objects
 * @returns {*}
 */
function mergeDeepObject(...objects) {
	const isObject = obj => obj && typeof obj === "object";

	return objects.reduce((prev, obj) => {
		Object.keys(obj).forEach(key => {
			const pVal = prev[key];
			const oVal = obj[key];

			if (Array.isArray(pVal) && Array.isArray(oVal)) {
				prev[key] = pVal.concat(...oVal);
			} else if (isObject(pVal) && isObject(oVal)) {
				prev[key] = mergeDeepObject(pVal, oVal);
			} else {
				prev[key] = oVal;
			}
		});

		return prev;
	}, {});
}

export default VGLoadMore;
