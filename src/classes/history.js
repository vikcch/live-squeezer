'use strict';

import Player from './player.js';

class History {

    constructor(players = null, currentBet = 0, street = 0,
        streetCards = null, log = '', action = '', player = null) {

        this.players = players;
        this.currentBet = currentBet;
        this.street = street;
        this.streetCards = streetCards;
        this.log = log;
        this.action = action;
        this.player = player;
    }

    static initHistory(histories, mainInfo) {

        const firstHistory = histories[0];

        firstHistory.currentBet = mainInfo.stakes.straddles.length
            ? mainInfo.stakes.straddles[mainInfo.stakes.straddles.length - 1]
            : mainInfo.stakes.bigBlind;

        firstHistory.players = Player.deepCopy(mainInfo.players);
        firstHistory.street = 0;

    }

    static createFromLast(histories) {

        const lastHistory = histories[histories.length - 1];

        const history = new History(
            Player.deepCopy(lastHistory.players),
            lastHistory.currentBet,
            lastHistory.street
        );

        histories.push(history);

        return history;
    }

    static getStreetIndexOnLastIndex(histories) {

        const lastHistory = histories[histories.length - 1];
        return lastHistory.street;
    }

    static isStreetOnLastIndex(histories) {

        const lastHistory = histories[histories.length - 1];
        return lastHistory.streetCards !== null;
    }

    static isInputCardsTaken(input, histories) {

        // NOTE:: "caseless", são formatadas para lowerCase e upperCase no <input/>

        const work = {
            '2': () => [input],
            '5': () => input.replace(' ', '').match(/.{2}/g),
            '6': () => input.match(/.{2}/g),
        };

        const cards = work[input.length].call();

        const repited = (new Set(cards)).size !== cards.length;

        if (repited) return true;

        const lastHistory = histories[histories.length - 1];

        const playerCards = lastHistory.players.map(v => v.holeCards).join(' ');

        const streetCards = histories.map(v => v.streetCards).join(' ');

        return cards.some(v => playerCards.includes(v) || streetCards.includes(v));
    }

}

export default History;