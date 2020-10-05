import vikFunctions from '../units/vikFunctions.js';
import validation from '../units/validations.js';
import Street from './street.js';
import biz from '../units/biz.js';

export default class Deck {

    constructor() {

        this.pickedPlayersCards = [];

        this.pickedStreetsCards = [];

        this.fieldCards = [];
    }

    /**
     * @param {any[]} playersInput
     */
    set setpickedPlayersCards(playersInput) {

        const validHC = validation.business.player.isHoleCards;

        this.pickedPlayersCards = playersInput.reduce((acc, cur) => {

            const crampedHC = vikFunctions.cramped(cur.value);

            if (validHC(crampedHC)) {

                const holeCards = biz.stringToCards(crampedHC);

                return acc.concat(holeCards);
            }

            return acc;

        }, []);
    }

    /**
     * @param {{ isHoleCardsField: any; value: any; street: any; }} fieldInfo
     */
    set setFieldCards(fieldInfo) {

        if (fieldInfo.isHoleCardsField) {

            if (validation.business.player.isHoleCards(fieldInfo.value)) {

                this.fieldCards = biz.stringToCards(fieldInfo.value);
            }

        } else {

            const streetIndex = Street.STREETS.indexOf(fieldInfo.street);

            if (validation.business.geral.isStreetCards(fieldInfo.value, streetIndex)) {

                this.fieldCards = biz.stringToCards(fieldInfo.value);
            }

        }

    }

    /**
     * @param {{ map: (arg0: (h: any) => any) => { filter: (arg0: (h: any) => any) => { reduce: (arg0: (acc: any, cur: any) => any, arg1: any[]) => any[]; }; }; }} histories
     */
    set setPickedStreetsCards(histories) {

        this.pickedStreetsCards = histories
            .map(h => h.streetCards)
            .filter(h => h)
            .reduce((acc, cur) => acc.concat(biz.stringToCards(cur)), []);

    }

    get getPickedCards() {

        return this.pickedPlayersCards.concat(this.pickedStreetsCards);
    }

    get getFieldCards() {

        return this.fieldCards;
    }

    static getAbbr() {

        return [
            "Ad", "Kd", "Qd", "Jd", "Td", "9d", "8d", "7d", "6d", "5d", "4d", "3d", "2d",
            "Ah", "Kh", "Qh", "Jh", "Th", "9h", "8h", "7h", "6h", "5h", "4h", "3h", "2h",
            "As", "Ks", "Qs", "Js", "Ts", "9s", "8s", "7s", "6s", "5s", "4s", "3s", "2s",
            "Ac", "Kc", "Qc", "Jc", "Tc", "9c", "8c", "7c", "6c", "5c", "4c", "3c", "2c"
        ];
    }
}