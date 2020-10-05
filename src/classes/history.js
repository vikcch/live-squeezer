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

}

export default History;