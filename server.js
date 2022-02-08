require('dotenv').config();

const { env } = process;
const path = require('path');
const http = require('http');
const express = require('express');
const WebSocket = require('ws');

// Default config values
const PORT = 3000;
const VERSION = '0.1';

// Variables
const app = express();
const server = new http.createServer(app);
const wss = new WebSocket.Server({ server });

// Static files
app.use('/', express.static('frontend'));
// app.use('/js', express.static('frontend/js'));
// app.use('/css', express.static('frontend/css'));

// WebSocket
wss.on('connection', (ws) => {
	ws.send('hello');

	ws.on('message', (message) => {
		console.log('[CLIENT] ' + message);
	});

	console.log(wss.clients);
});

// Routes
app.get('/status', (req, res) => {
	res.json({
		ok: true,
		version: env.VERSION || VERSION,
	});
});

server.listen(env.PORT || PORT, (err) => {
	if (err) {
		console.log(`Error while starting server on port ${PORT}`, err);

		return;
	}

	console.log(`Listening on port ${PORT}`);
});
