import vikFunctions from './vikFunctions.js';
import biz from './biz.js';
import absx from './absx.js';
import { isInRange } from './fxnl.js';

const regexs = {
    toHollow: /(\..*)\./g,
    alphaNumeric: /[^\w\s]+/g
};

const validation = {

    force: {

        onlyNumbers: value => value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1'),

        //        onlyNumbersOrSeparator: value => value.replace(/[^.0-9]/g, '').replace(/(.*)/g, '$1'),
        onlyNumbersOrSeparator: value => value.replace(/[^0-9.,-\s]/g, ''),

        //onlyNumbersAndBrackets: value => value.replace(/[^0-9\(\)/\[\]]/g, '').replace(/(\..*)\./g, '$1'),
        onlyNumbersAndBrackets: value => value.replace(/[^0-9()/[\]]/g, '').replace(/(\..*)\./g, '$1'),
        onlyNumbersDotsAndBrackets: value => value.replace(/[^0-9()/[\].]/g, ''),

        onlyAlphaNumeric: value => value.replace(regexs.alphaNumeric, '').replace(/(\..*)\./g, '$1'),

        onlyCardChars: value => value
            .replace(/[^0-9akqjtcdhsc\s]/gi, '')
            .replace(/(\..*)\./g, '$1')
            .replace(/[akqjt]/g, match => match.toUpperCase())
            .replace(/[DHSC]/g, match => match.toLowerCase())

    },

    input: {

        isAlphaNumeric: (value) => value.match(regexs.alphaNumeric) === null,

    },

    business: {

        player: {

            isSeat: function (value, seatLimit) {

                const n = Number(value);

                const isWithinOneSeatLimit = isInRange(1, seatLimit);

                return Number.isInteger(n) && isWithinOneSeatLimit(n);
            },

            isName: function (value) {

                return value.length > 0 && input.isAlphaNumeric(value);
            },

            isStack: function (value) {

                const n = Number(value);
                return Number.isInteger(n) && Number(n) > 0;
            },

            isValid: function (seat, name, stack, seatLimit) {

                return this.isSeat(seat, seatLimit) && this.isName(name) && this.isStack(stack);
            },

            getInvalidField: function (seat, name, stack, seatLimit) {

                if (!this.isSeat(seat, seatLimit)) return 'Seat';
                if (!this.isName(name)) return 'Name';
                if (!this.isStack(stack)) return 'Stack';

            },

            isHoleCards: function (value) {

                value = vikFunctions.cramped(value);

                if (value.length !== 4) return false;

                const cardA = value.substring(0, 2);
                const cardB = value.substring(2);

                return geral.isCard(cardA) && geral.isCard(cardB);
            }

        },

        mainInfo: {

            isHandId: function (value) {

                const n = Number(value);
                return Number.isInteger(n) && n > 0;
            },

            isDate: function (value) {

                const d = new Date(value);
                return (d && Object.prototype.toString.call(d) === "[object Date]" && !isNaN(d))
            },

            isDealer: function (value) {

                const n = Number(value);
                return Number.isInteger(n) && absx.isWithinOneToTen(n);
            },

            isTableName: function (value) {

                return value.length > 0 && input.isAlphaNumeric(value);
            },

            isStakes: function (value) {

                const straddlesFail = ({ straddles }) => {

                    const rdc = bracket => (acc, cur) => acc + (cur === bracket | 0);

                    const bracketsOpen = [...value].reduce(rdc('['), 0);
                    const bracketsClose = [...value].reduce(rdc(']'), 0);

                    const bracketsMatch = bracketsOpen === bracketsClose;

                    const properValues = straddles.every(x => x);

                    return !properValues || !bracketsMatch;
                };

                const anteBoundaries = ['(', ')'];
                const straddlesBoundaries = ['[', ']'];

                const includesChar = x => value.includes(x);

                const hasAnte = anteBoundaries.some(includesChar);
                const hasStraddles = straddlesBoundaries.some(includesChar);

                const stakes = biz.stringToStakes(value);

                if (hasAnte && stakes.ante === 0) return false;
                if (hasStraddles && straddlesFail(stakes)) return false;

                return stakes.smallBlind > 0 && stakes.bigBlind > 0;
            },

            isTableMax: function (value) {

                const valids = Array.from(Array(9), (v, k) => (k + 2) + '-max');
                return valids.includes(value);
            },

            isPerspective: function (value) {

                return value === 'tv' || value === 'hero';
            },

            isHeroSeat: function (value) {

                const n = Number(value);
                return Number.isInteger(n) && absx.isWithinOneToTen(n);
            }

        },

        geral: {

            isCard: function (value) {

                const fittings = [
                    Array.from(Array(8), (e, i) => `${i + 2}`).concat(['t', 'j', 'q', 'k', 'a']),
                    ['c', 'h', 's', 'd']
                ];

                const valid = Array.from(value.toLowerCase())
                    .map((c, index) => fittings[index % 2].includes(c))
                    .every(c => c);

                return value.length === 2 && valid;
            },

            isStreetCards: function (input, streetIndex) {

                const value = vikFunctions.cramped(input);

                const cards = value.match(/.{2}/g);

                const areAllCards = cards && cards.every(c => this.isCard(c));

                return areAllCards && (
                    (streetIndex === 1 && value.length === 6) ||
                    (streetIndex !== 1 && value.length === 2));

            },
        },

        handHistory: {

            hasSummary: function (value) {

                return value.match(/^\*{3}\sSUMMARY\s\*{3}$/gm) !== null;
            },

            hasHeroHoleCards: function (value) {

                return value.match(/^\*{3}\sHOLE\sCARDS\s\*{3}$/gm) !== null;
            }
        }

    }

};

const geral = validation.business.geral;
const input = validation.input;

export default validation;