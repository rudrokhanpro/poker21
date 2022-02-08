import { API_URL } from './constants.js';
import { createURL } from './helpers.js';

// Deck of cards
export const newShuffle = async (params) => {
	const url = API_URL + '/deck/new/shuffle/';
	const reqURL = createURL(url, params);
	const reqConfig = {
		method: 'GET',
	};

	try {
		const res = await fetch(reqURL, reqConfig);
		return res.json();
	} catch (err) {
		throw err;
	}
};

export const drawCard = async (deck_id, params) => {
	if (!deck_id) throw new Error('DeckOfCardError: Missing deck_id');

	const url = API_URL + `/deck/${deck_id}/draw`;
	const reqURL = createURL(url, params);
	const reqConfig = {
		method: 'GET',
	};

	try {
		const res = await fetch(reqURL, reqConfig);
		return res.json();
	} catch (err) {
		throw err;
	}
};

// Web socket
export const connect = () => {
	const { host } = window.location;
	return new WebSocket(`ws://${host}`);
};
