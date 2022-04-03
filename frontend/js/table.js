// import { getCookie } from './utils/helpers.js';
// import { connect } from './utils/api.js';

// const socket = connect();

// // La connexion est ouverte
// socket.addEventListener('open', function (event) {
// 	socket.dispatchEvent(new Event(''));
// });

// // Écouter les messages
// socket.addEventListener('message', function (event) {
// 	console.log('Voici un message du serveur', event.data);
// });

// const greetingEl = document.querySelector('#greeting');

// const username = getCookie('username');
// const players = [username];

// greetingEl.textContent = `Hello ${username} !`;

// socket.addEventListener('player.join', ({ data }) => {
// 	console.log('New player join !', data);
// });

import Card from './components/table/card.js';
import { newShuffle, drawCard, restartGame, addToPile } from './utils/api.js';
import { GAME_ACTION } from './utils/constants.js';



// Containers
const deckEl = document.querySelector('#deck');
const drawnCardsEl = document.querySelector('#drawn-cards');
const board_console = document.querySelector("#console");

// Texts
const scoreEl = document.querySelector('#score');
const remainingEl = document.querySelector('#remaining');
const statusEl = document.querySelector('#status')

// Inputs
const countInput = document.querySelector('#count');

// Buttons
const startBtn = document.querySelector('#start');
const drawBtn = document.querySelector('#draw');
const cancelBtn = document.querySelector('#cancel');
const standBtn = document.querySelector('#stand');
const restartBtn = document.querySelector('#restart');

// Vars
let deck_id;
const pileName = "player";
const player_deck = [];
let abortCtrl;
let lastAction;

// Variables (Selectors and then actual variables)
// util functions

/**
 * Updates remaining count element's content
 * @param {string} value Score value 
 */
 function setRemaining(value = "") {
	remainingEl.textContent = value;
}

/**
 * Updates score element's content
 * @param {string} value Score value 
 */
 function setScore(value = "") {
	scoreEl.textContent = value;
}

// listeners
window.onload = async function () {
	if(window.navigator.onLine) {
		handleOnline();
	} else {
		handleOffline();
	}
};
window.addEventListener('online', function(e) { 
	handleOnline();
	updateConsoleLog('La connexion a été établie.');
});
window.addEventListener('offline', function(e) { 
	handleOffline();
	updateConsoleLog('La connexion a été perdue.');
});

startBtn.onclick = onStart;
drawBtn.onclick = onDraw;
cancelBtn.onclick = onCancel;
standBtn.onclick = onStand;
restartBtn.onclick = onRestart;

/**
 * Handle keybord event for D,C,S,R,ENTER
 */
window.addEventListener("keypress", (event) => {
	switch(event.code) {
		case "KeyD" :
			if(lastAction === GAME_ACTION.START || lastAction === GAME_ACTION.DRAW || lastAction === GAME_ACTION.CANCEL)
				onDraw();
			break;
		case "KeyC" :
			if(lastAction === GAME_ACTION.DRAW)
				onCancel();
			break;
		case "KeyS" :
			if(lastAction === GAME_ACTION.START ||lastAction === GAME_ACTION.DRAW || lastAction === GAME_ACTION.CANCEL)
				onStand();
			break;
		case "KeyR" :
			if(lastAction === GAME_ACTION.DRAW || lastAction === GAME_ACTION.CANCEL || lastAction === GAME_ACTION.STAND)
				onRestart();
			break;
		case "Enter" :
			if(!lastAction || lastAction === GAME_ACTION.RESTART)
				onStart();
			break;
		default :
			break;
	}
});

// Handlers
async function onStart() {
	const newDeck = await newShuffle({ deck_count: 1 });
	deck_id = newDeck.deck_id;
	console.log(deck_id);

	lastAction = GAME_ACTION.START;
	const { cards, remaining  } = await drawCard(deck_id, { count: 2 })
		.catch((err) => updateConsoleLog('Une erreur réseau est survenue.'));
	
	if(cards) {
		updatePlayerDeck(cards);
		updateDrawnCards(cards);
		setRemaining(remaining);
		setScore(getPlayerScore());
		
		startBtn.disabled = true;
		drawBtn.disabled = false;
		countInput.disabled = false;
		standBtn.disabled = false;
	}
}

async function onDraw() {
	if (deck_id === undefined) {
		alert("Deck ID not found, cannot draw");
		return;
	}

	lastAction = GAME_ACTION.DRAW;
	drawBtn.disabled = true;
	cancelBtn.disabled = false;
	abortCtrl = new AbortController();
	
	const { value: count } = countInput;
	const { cards, remaining } = await drawCard(deck_id, { count }, abortCtrl)
		.then((result) => {
			cancelBtn.disabled = true
			restartBtn.disabled = false;
			drawBtn.disabled = false;
			window.navigator.vibrate(200);		
			return result;
		})
		.catch((err) => {
			if(player_deck.length > 2) {
				restartBtn.disabled = false;
			}
			cancelBtn.disabled = true
			drawBtn.disabled = false;
			if(lastAction === GAME_ACTION.CANCEL) {
				updateConsoleLog('Vous avez annuler le tirage.')
			} else {
				updateConsoleLog('Une erreur réseau est survenue.')
			}
			return err;
		});

	if(cards) {
		updatePlayerDeck(cards);
		updateDrawnCards(cards);
		setRemaining(remaining);
	
		const score = getPlayerScore();
		setScore(score);
		
		if (score === 21) {
			handleWin();
		} else if (score > 21) {
			handleLose();
		}
	}
}

async function onCancel() {
	lastAction = GAME_ACTION.CANCEL;

	cancelBtn.disabled = true;
	abortCtrl.abort();
}

async function onStand() {
	lastAction = GAME_ACTION.STAND;

	const { cards, remaining } = await drawCard(deck_id, { count: 1 })
		.then((result) => {
			window.navigator.vibrate(200);		
			return result;
		})
		.catch((err) => updateConsoleLog('Une erreur réseau est survenue.'));
	
	if(cards) {
		updatePlayerDeck(cards);
		updateDrawnCards(cards);
	
		const score = getPlayerScore();
		setScore(`${scoreEl.innerHTML} (${score})`);
	
		if(score > 21) {
			handleWin();
		} else {
			handleLose();
		}
	}
}

async function onRestart() {
	lastAction = GAME_ACTION.RESTART;

	await restartGame(deck_id);
	
	startBtn.disabled = false;
	countInput.disabled = true;
    drawBtn.disabled = true;
    standBtn.disabled = true;
	restartBtn.disabled = true;
	player_deck.length = 0;
	
	setScore("0");
	setRemaining("");
	removeDrawnCards();
}

/**
 * Add cards to player's pile
 * @param {*} cards Array of cards
 */
 async function updatePlayerDeck(cards) {
	const cardCodes = [];

	cards.forEach((card) => {
		const logEntry = `Vous avez tirer la carte : ${card.value} ${card.suit}`;
		cardCodes.push(card.code);
		player_deck.push(card);
		updateConsoleLog(logEntry);
	});

	await addToPile(deck_id, pileName, { cards: cardCodes });
}

/**
 * Display given cards in the drawn cards container
 * @param {*} cards 
 */
 function updateDrawnCards(cards) {
	cards.forEach((card) => {
		new Card(card, drawnCardsEl).display();
	});
}

/**
 * Remove every displayed cards in the drawn cards container
 */
 function removeDrawnCards() {
	drawnCardsEl.replaceChildren();
}

/**
 * Add a new log entry in the console container
 * @param {*} text
 */
 function updateConsoleLog(text) {
	const log = document.createElement("div");
	log.textContent = text;
	board_console.appendChild(log);
 }

function handleWin() {
	window.navigator.vibrate([200, 100, 200, 100, 200, 100, 200]);
	updateConsoleLog('Vous avez gagné !');

	countInput.disabled = true;
	drawBtn.disabled = true;
	cancelBtn.disabled = true;
	standBtn.disabled = true;
}

function handleLose() {
	window.navigator.vibrate([1000]);
	updateConsoleLog('Vous avez perdu.');

	countInput.disabled = true;
	drawBtn.disabled = true;
	cancelBtn.disabled = true;
	standBtn.disabled = true;
	restartBtn.disabled = false;
}

function getPlayerScore() {
	let sum = player_deck.reduce((prev, next) => {
		return prev + getCardValue(next.value);
	}, 0);
	return sum;
}

/**
 * Returns a card numeric value according to it's value
 * @param {string} value Card value
 * @returns 
 */
function getCardValue(value) {
	switch(value) {
		case "KING":
		case "QUEEN": 
		case "JACK":
		case "0":
			return 10;
		case "ACE":
			return 0;
		default:
			return Number.parseInt(value);
	}
}

function handleOnline() {
	statusEl.textContent = 'En ligne';
	statusEl.className = 'status--on';
}

function handleOffline() {
	statusEl.textContent = 'Hors ligne';
	statusEl.className = 'status--off';
}