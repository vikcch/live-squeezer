import validations from '../units/validations.js';
import biz from '../units/biz.js';
import { isSameProperty } from '../units/fxnl.js';
import { tail } from '../units/absx.js';

export default class Player {

    constructor(seat, name, stack, isButton, isHero) {
        this.seat = Number(seat);
        this.name = name;
        this.stack = Number(stack);
        this.isButton = isButton;
        this.isHero = isHero;

        this.position = '';
        this.post = false; // As antes não contam
        this.currentStack = Number(stack);
        this.acted = false;

        this.stillPlaying = true;   // AKA ainda pode actuar (ex: em AllIn é 'false')

        this.isAllIn = false;       // unstable, pode voltar a 'false' em 'setUncalledBet'
        this.wasAllin = false;      // setado a 'true' só em 'setUncalledBet' se 
        // 'this.isAllIn' voltar a 'false'
        this.moneyOnStreet = 0;

        this.holeCards = '__ __';   // só as instacias em mainInfo têm as holeCards
        // inseridas, outras instacias pode ter por 
        // deepCopy, apenas confiar nas de mainInfo
    }

    /**
     * @param {string} value
     */
    set setHoleCards(value) {

        if (validations.business.player.isHoleCards(value)) {

            this.holeCards = biz.formatCards(value);
        }
    }


    static deepCopy(players) {

        const newPlayers = [];
        players.forEach(p => {
            newPlayers.push(JSON.parse(JSON.stringify(p)));
        });

        return newPlayers;
    }


    static setTablePositions(players) {

        const playersChair = biz.tablePositions(players);

        const copySeat = p => {

            const isSameSeatPlayer = isSameProperty('seat', p);

            p.position = playersChair.find(isSameSeatPlayer).position;
        };

        players.forEach(copySeat);
    }

    static getStillPlayingOnLastIndex(histories) {

        const lastIndex = histories.length - 1;
        const players = histories[lastIndex].players;

        return players.filter(p => p.stillPlaying);
    }

    static getAllInsOnLastIndex(histories) {

        const lastIndex = histories.length - 1;
        const players = histories[lastIndex].players;

        return players.filter(p => p.isAllIn);
    }

    static getAreAllinsOnLastIndex(histories) {

        const lastIndex = histories.length - 1;
        const players = histories[lastIndex].players;

        return players.some(p => p.isAllIn);
    }

    static getBiggerAllinOnLastIndex(histories) {

        const history = histories
            .map(h => h)
            .reverse()
            .find(h => h.currentBet);

        const biggers = history.players
            .filter(p => p.moneyOnStreet === history.currentBet);

        // NOTE:: Quando têm a mesma stack e vão all-in nenhum é "bigger"
        if (biggers.length > 1) return null;
        else return biggers.pop();

        // return history.players
        //     .find(p => p.moneyOnStreet === history.currentBet);

    }


    static rotatePlayers(players) {

        const stillPlaying = players.filter(p => p.stillPlaying);

        const streetClosed = stillPlaying.every(p => p.acted);

        if (!streetClosed) {

            while (!players[0].stillPlaying || players[0].acted) {
                players.push(players.shift());
            }
        }
    }

    static getPreviousStreetsAllIns(histories) {

        const currentStreet = tail(histories).street;

        const previousStreets = histories
            .filter(h => h.street !== currentStreet);

        const getAllIns = Player.getAllInsOnLastIndex;
        return previousStreets.length && getAllIns(previousStreets);
    }

    static model(
        seat = null,
        name = '',
        stack = null,
        holeCards = '__ __') {

        return { seat, name, stack, holeCards };
    }

}