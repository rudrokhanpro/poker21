export const API_URL = 'https://deckofcardsapi.com/api';

export const GAME_ACTION = Object.freeze({
    START: Symbol("START"),
    DRAW: Symbol("DRAW"),
    CANCEL: Symbol("CANCEL"),
    STAND: Symbol("STAND"),
    RESTART: Symbol("RESTART")
});
