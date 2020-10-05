import validations from '../units/validations.js';

class Street {

    constructor(input, histories, mainInfo) {

        this.input = input.replace(/\s+/g, '').trim();
        this.histories = histories;
        this.mainInfo = mainInfo;
        this.history = histories[histories.length - 1];

        this.adjustHistory();
        this.incrementStreet();

        this.isValid = this.trySetStreetCards();
    }

    static get STREETS() {

        return ['PRE-FLOP', 'FLOP', 'TURN', 'RIVER', 'SUMMARY'];
    }

    get getIsValid() {
        return this.isValid;
    }


    resetPlayers() {

        const players = this.history.players;

        players.forEach(p => {
            p.acted = false;
            p.moneyOnStreet = 0;
        });
    }


    rotatePlayersToSmallBlind() {

        const players = this.history.players;

        while (!players[players.length - 1].isButton) {
            players.unshift(players.pop());
        }

    }

    adjustHistory() {

        this.history.currentBet = 0;

        this.resetPlayers();

        this.rotatePlayersToSmallBlind();
    }


    incrementStreet() {
        this.history.street++;
    }

    getFormatedStreetCards() {

        const previousCards = this.histories.map(h => h.streetCards)
            .filter(h => h)
            .join('');

        const formatStreet = string => string
            .replace(/[\w]/gi, (match, offset) => (offset % 2)
                ? match.toLowerCase() + ' '
                : match.toUpperCase()).trim();

        const result = [previousCards, this.input]
            .filter(x => x)
            .map(y => y = formatStreet(y))
            .join('] [');

        return `[${result}]`;
    }


    trySetStreetCards(){

        if (validations.business.geral.isStreetCards(this.input, this.history.street)){

            const history = this.history;

            const streetName = Street.STREETS[history.street];
            const cardsFormated = this.getFormatedStreetCards();
    
            history.streetCards = this.input;
            history.log = `*** ${streetName} *** ${cardsFormated}`;

            return true;
        }
        return false;
    }


    static getNextStreet(histories) {

        const lastIndex = histories.length - 1;
        const streetIndex = histories[lastIndex].street + 1;

        return Street.STREETS[streetIndex];
    }

}

export default Street;