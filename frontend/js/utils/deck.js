export class Deck {
	constructor() {
		this.id = null;
		this.cards = [];
	}

	// https://deckofcardsapi.com/api/deck/new/
	new(deck_count) {}

	// https://deckofcardsapi.com/api/deck/<<deck_id>>/draw/?count=2 copy
	draw(count) {}

	// https://deckofcardsapi.com/api/deck/<<deck_id>>/shuffle/
	// https://deckofcardsapi.com/api/deck/<<deck_id>>/shuffle/?remaining=true copy
	shuffle(params) {
		const { remaining } = params;
	}

	// https://deckofcardsapi.com/api/deck/<<deck_id>>/pile/<<pile_name>>/add/?cards=AS,2S
	addToPile(name, cardCodes) {}
}
