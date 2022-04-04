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
