import Loader from './components/loader.js';
import { createRelativeURL } from './utils/helpers.js';

let loader = new Loader('loader');

const gameButton = document.querySelector('.start');

gameButton.onclick =  async () => {
	loader.display();
	let current_id = localStorage.getItem('deck_id');

	if(!current_id) {
		const newDeck = await newShuffle({ deck_count: 1 });
		let current_id = newDeck.deck_id;
		localStorage.setItem('deck_id', current_id);
	}

	window.location.href = createRelativeURL('/table.html', {current_id});
}