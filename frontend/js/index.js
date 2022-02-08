import Loader from './components/loader.js';
import { newShuffle } from './utils/api.js';
import {
	generateUsername,
	setCookie,
	createRelativeURL,
} from './utils/helpers.js';

let loader = new Loader('loader');

const gameForm = document.querySelector('#game-form');
const usernameInput = gameForm.querySelector('#username');

const randomUsername = generateUsername();

usernameInput.placeholder = randomUsername;

gameForm.onsubmit = async (event) => {
	event.preventDefault();

	// Create table
	try {
		loader.display();

		const { deck_id, success } = await newShuffle({ deck_count: 1 });

		loader.hide();

		if (!success) throw new Error('DeckOfCardError: new shuffling failed');

		const storedUsername = usernameInput.value || randomUsername;

		setCookie(`username=${decodeURIComponent(storedUsername)}`);

		window.location.href = createRelativeURL('/table.html', {
			deck_id,
		});
	} catch (err) {
		console.log(err);
	}
};
