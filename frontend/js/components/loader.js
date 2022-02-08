export default class Loader {
	constructor(id, parent = document.body) {
		this.id = id;
		this.el = document.createElement('div');
		this.visible = false;
		this.parent = parent;

		this.#setup();
	}

	display() {
		this.visble = true;
		this.el.classList.add('loader--visible');
	}

	hide() {
		this.visible = false;

		setTimeout(() => {
			this.el.classList.remove('loader--visible');
		}, 1000);
	}

	#setup() {
		this.el.id = this.id;
		this.el.classList.add('loader');

		const messageEl = document.createElement('span');
		const messageText = document.createTextNode('Loading...');

		messageEl.classList.add('loader__message');

		messageEl.appendChild(messageText);
		this.el.appendChild(messageEl);
		this.parent.appendChild(this.el);
	}
}
