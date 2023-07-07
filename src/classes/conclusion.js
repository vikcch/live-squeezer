'use strict';

import Player from './player.js';
import History from './history.js';
import { findLast } from '../units/vikFunctions.js';
import { or } from '../units/fxnl.js';
import { tail, head } from '../units/absx.js';

export default class Conclusion {

    constructor() {

        this.uncalledBet = 0;
        this.uncalledPlayer = null;
        this.pots = [];
        this.winners = [];
        this.hasShowDown = false;
        this.showdownPlayersOrdered = [];
        this.decimalSplitsPots = true;
    }

    isOnShowdown = (histories) => ({ stillPlaying, seat }) => {

        const wentAllIn = seat => {

            const isSameSeat = p => p.seat === seat;

            const isAllIn = h => h.players.find(isSameSeat).isAllIn;

            return histories.some(isAllIn);
        };

        return stillPlaying || wentAllIn(seat);
    }

    setUncalledBet(histories) {

        const stillPlaying = Player.getStillPlayingOnLastIndex(histories);

        const player = stillPlaying.length
            ? stillPlaying[0]
            : Player.getBiggerAllinOnLastIndex(histories);

        // NOTE:: player é `null` quando há multiplos all-in com a mesma stack
        if (!player || stillPlaying.length > 1) return;

        if (player.isAllIn) {

            player.isAllIn = false;
            player.wasAllIn = true;
        }

        const lastHistory = histories[histories.length - 1];
        const { currentBet, street } = lastHistory;

        const maxNonStillPlaying = Math.max(...histories
            .filter(h => h.street === street)
            .map(h => h.players.filter(p => p.seat !== player.seat))
            .map(h => Math.max(...h.map(pls => pls.moneyOnStreet)))
        ) || 0;

        this.uncalledBet = currentBet - maxNonStillPlaying;
        this.uncalledPlayer = player;
    }

    getLastHistoryOfEachStreet(histories) {

        const lasts = histories.map(h => ({
            players: h.players.map(p => ({
                name: p.name,
                moneyOnStreet: p.moneyOnStreet,
                isAllIn: p.isAllIn
            })),
            street: h.street
        })).reduceRight((acc, cur) => {

            if (!acc.find(x => x.street === cur.street)) acc.push(cur);
            return acc;

        }, []).sort((a, b) => a.street - b.street);

        return lasts;
    }

    getPots(lasts) {

        const pots = lasts.reduce((acc, cur) => {

            let streetMoneyPlayers = [];

            do {

                streetMoneyPlayers = cur.players
                    .filter(p => p.moneyOnStreet !== 0)
                    .sort((a, b) => a.moneyOnStreet - b.moneyOnStreet);

                if (!streetMoneyPlayers.length) return acc;

                const lowerMoney = streetMoneyPlayers[0].moneyOnStreet;

                const accLastItem = acc.length - 1;
                acc[accLastItem] += lowerMoney * streetMoneyPlayers.length;

                const areLowerMoneyAllIns = streetMoneyPlayers
                    .some(p => p.moneyOnStreet === lowerMoney && p.isAllIn)

                if (areLowerMoneyAllIns) acc.push(0);

                streetMoneyPlayers.forEach(p => p.moneyOnStreet -= lowerMoney);

                streetMoneyPlayers = streetMoneyPlayers = cur.players
                    .filter(p => p.moneyOnStreet !== 0)

            } while (streetMoneyPlayers.length);

            return acc;

        }, [0]);

        return pots;
    }


    addAntesToMainPot(pots, mainInfo) {

        pots[0] += mainInfo.stakes.ante * mainInfo.players.length;
    }

    setPots(histories, mainInfo) {

        const lasts = this.getLastHistoryOfEachStreet(histories);

        const pots = this.getPots(lasts);

        const lastPot = pots.pop() - this.uncalledBet;
        if (lastPot) pots.push(lastPot);

        this.addAntesToMainPot(pots, mainInfo);

        this.pots = pots;
    }

    setAutoWinners(histories) {

        const stillPlaying = Player.getStillPlayingOnLastIndex(histories);
        const areAllins = Player.getAreAllinsOnLastIndex(histories);

        if (stillPlaying.length <= 1 && !areAllins) {

            this.winners = [[this.uncalledPlayer]];
        }
    }

    setHasShowDown(histories) {

        const stillPlaying = Player.getStillPlayingOnLastIndex(histories);
        const areAllins = Player.getAreAllinsOnLastIndex(histories);

        this.hasShowDown = stillPlaying.length > 1 || areAllins;
    }

    setShowHandsOrder(histories) {

        if (!this.hasShowDown) return;

        const betsOrRaises = or('bets', 'raises');

        const isAgro = h => betsOrRaises(h.action);

        const agroHistory = findLast(histories, isAgro);

        const lastHistory = tail(histories);

        const oop = lastHistory.players.length === 2 ? 'BB' : 'SB';

        const agro = agroHistory
            ? agroHistory.player
            : lastHistory.players.find(p => p.position === oop);

        const isOnShowdown = this.isOnShowdown(histories);

        const showdownPlayers = lastHistory.players
            .filter(isOnShowdown);

        while (head(showdownPlayers).seat !== agro.seat) {
            showdownPlayers.unshift(showdownPlayers.pop());
        }

        this.showdownPlayersOrdered = showdownPlayers;
    }

    createFinalHistory(histories) {

        History.createFromLast(histories);
    }

    addUncalledBetToStack(histories) {

        if (!this.uncalledBet) return;

        //this.uncalledPlayer.currentStack += this.uncalledBet;
        const lastHistory = tail(histories);

        const isSeat = p => p.seat === this.uncalledPlayer.seat;
        const player = lastHistory.players.find(isSeat);

        if (player) player.currentStack += this.uncalledBet;
    }

    addPotsToStacks(histories) {

        const lastHistory = tail(histories);

        this.winners.forEach((potWinner, index) => {

            const factor = this.decimalSplitsPots ? 100 : 1;
            const pot = this.pots[index];
            let modAvailable = pot * factor % potWinner.length;

            potWinner.forEach(w => {

                let splitPot = Math.floor(pot * factor / potWinner.length) / factor;
                splitPot += (modAvailable-- > 0 ? 1 / factor : 0);

                const isSeat = p => p.seat === w.seat;
                const player = lastHistory.players.find(isSeat);

                if (player) player.currentStack += splitPot;

            });
        });

    }
}

