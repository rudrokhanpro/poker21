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
import { newShuffle, drawCard } from './utils/api.js';

const loader = new Loader('loader');

const { deck_id } = await newShuffle({ deck_count: 1 });

console.log(deck_id);

const drawBtn = document.querySelector('#draw');
const countInput = document.querySelector('#count');
const player_deck = [];

drawBtn.onclick = async (event) => {
	const count = countInput.value;
	const { success, cards } = await drawCard(deck_id, { count });

	console.log(cards);

	document.getElementById('card').setAttribute('src', cards[0].image);

	
	var value = document.getElementById('logger').innerText= "Vous avez eu la carte " + ('value', cards[0].value);

	var p=document.getElementById("console");
	var e=document.createElement("div");
	e.innerHTML="Element n°"+ value;
	p.appendChild(e);

	cards.forEach((card) => player_deck.push(card));
};
