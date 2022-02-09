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

import Loader from './components/loader.js';
import { newShuffle, drawCard, restartGame, addToPile } from './utils/api.js';

const loader = new Loader('loader');
let abortCtrl;

const { deck_id } = await newShuffle({ deck_count: 1 });

console.log(deck_id);

const startBtn = document.querySelector('#start');
const drawBtn = document.querySelector('#draw');
const countInput = document.querySelector('#count');
const player_deck = [];
const board_console = document.querySelector("#console");
const cancelBtn = document.querySelector('#cancel');
const standBtn = document.querySelector('#stand');
const restartBtn = document.querySelector('#restart');
const scoreDiv = document.querySelector('#score');
const numberOfCard = 52;
const pile = "player";
let player_deck = [];

startBtn.onclick = async (event) => {
	abortCtrl = new AbortController();
	
	const count = 2;
	const { success, cards } = await drawCard(deck_id, abortCtrl, { count });
	
	updatePlayerDeck(cards);

	scoreDiv.innerHTML = checkScore();
	
	startBtn.disabled = true;
	drawBtn.disabled = false;
	countInput.disabled = false;
	standBtn.disabled = false;
	restartBtn.disabled = false;
};

drawBtn.onclick = async (event) => {
    cancelBtn.disabled = false;
	abortCtrl = new AbortController();
	
	const count = countInput.value;
	const { success, cards } = await drawCard(deck_id, abortCtrl, { count })
		.then((result) => {
			cancelBtn.disabled = true
			return result;
		});

	updatePlayerDeck(cards);

	let score = checkScore();
	scoreDiv.innerHTML = score;
	
	if(score > 21) {
		console.log("LOSE");
		countInput.disabled = true;
		drawBtn.disabled = true;
        standBtn.disabled = true;
	}

	document.getElementById('card').setAttribute('src', cards[0].image);
	
	var e=document.createElement("div");
	e.innerHTML=`Vous avez eu la carte ${cards[0].value} avec la forme ${cards[0].suit} `;
	board_console.appendChild(e);

		
	cards.forEach((card) => player_deck.push(card));
};

cancelBtn.onclick = async (event) => {
	cancelBtn.disabled = true;
	abortCtrl.abort();
};

standBtn.onclick = async (event) => {
	abortCtrl = new AbortController();
	
	const count = 1;
	const { success, cards } = await drawCard(deck_id, abortCtrl, { count });
	
	updatePlayerDeck(cards);

	let score = checkScore();
	scoreDiv.innerHTML = `${scoreDiv.innerHTML} (${score})`;

	if(score > 21)
		console.log("WIN");
	else
		console.log("LOSE");

	countInput.disabled = true;
	drawBtn.disabled = true;
  standBtn.disabled = true;
};

restartBtn.onclick = async (event) => {
	await restartGame(deck_id);
	startBtn.disabled = false;
	countInput.disabled = true;
    drawBtn.disabled = true;
    standBtn.disabled = true;
	restartBtn.disabled = true;
	player_deck = [];
	scoreDiv.innerHTML = "0";
};


async function updatePlayerDeck(cards) {
	const cardCodes = [];
	cards.forEach((card) => {
		cardCodes.push(card.code);
		player_deck.push(card);
	});
	await addToPile(deck_id, pile, { cards: cardCodes });
}

function checkScore() {
	let sum = player_deck.reduce((prev, next) => {
		return prev + getCardValue(next.value);
	}, 0);
	return sum;
}

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