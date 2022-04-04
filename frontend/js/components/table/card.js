export default class Card {
	constructor(card, parent = document.body) {
		this.value = card.value;
		this.suit = card.suit;
		this.code = card.code;
		this.image = card.image;

        this.parent = parent;

        this.el = document.createElement('div');
        this.visible = false;

		this.#setup();
	}

    display() {
        this.el.classList.add('card--visible');
    }

	#setup() {
		this.el.setAttribute('id', `card-${this.value}-${this.suit}`);
        this.el.classList.add('card');

        const imageEl = document.createElement('img');
        imageEl.setAttribute('src', this.image);

        imageEl.classList.add('card__image');

        this.el.appendChild(imageEl);
        this.parent.appendChild(this.el);
	}
}
