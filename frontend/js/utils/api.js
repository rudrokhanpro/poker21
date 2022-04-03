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

export const drawCard = async (deck_id, params, abortController) => {
	if (!deck_id) throw new Error('DeckOfCardError: Missing deck_id');

	const url = API_URL + `/deck/${deck_id}/draw`;
	const reqURL = createURL(url, params);
	const reqConfig = {
		method: 'GET',
	};

	if (abortController instanceof AbortController) {
		reqConfig.signal = abortController.signal
	}

	try {
		const res = await fetch(reqURL, reqConfig);
		return res.json();
	} catch (err) {
		throw err;
	}
};

export const restartGame = async (deck_id) => {
	if (!deck_id) throw new Error('DeckOfCardError: Missing deck_id');

	const url = API_URL + `/deck/${deck_id}/shuffle/`;
	const reqConfig = {
		method: 'GET',
	};

	try {
		const res = await fetch(url, reqConfig);
		return res.json();
	} catch (err) {
		throw err;
	}
};

export const addToPile = async (deck_id,pile,params) => {
	if (!pile) throw new Error('DeckOfCardError: Missing pile name');
	if (!deck_id) throw new Error('DeckOfCardError: Missing deck_id');

	const url = API_URL + `/deck/${deck_id}/pile/${pile}/add/`;
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

export const checkPile = async (deck_id,pile) => {
	if (!pile) throw new Error('DeckOfCardError: Missing pile name');
	if (!deck_id) throw new Error('DeckOfCardError: Missing deck_id');
	
	const url = API_URL + `/deck/${deck_id}/pile/${pile}/list/`;
	const reqConfig = {
		method: 'GET',
	};

	try {
		const res = await fetch(url, reqConfig);
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
