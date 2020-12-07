import vikFunctions from "./vikFunctions.js";
import { cap } from "./fxnl.js";
import { head } from "./absx.js";

const biz = {

    tablePositions: function (players) {

        const getPositionsHU = function () {

            const getPosition = p => p.seat === buttonSeat ? 'BU' : 'BB';

            const setPositionsHU = p => p.position = getPosition(p);

            playersSeats.forEach(setPositionsHU);

            return playersSeats;
        };

        const getPositionsNonHU = function () {

            const positions = ['BB', 'SB', 'BU', 'CO', 'HJ', 'LJ', 'MP', 'UTG+2', 'UTG+1', 'UTG'];

            while (playersSeats[playersSeats.length - 3].seat !== buttonSeat) {

                playersSeats.unshift(playersSeats.pop());
            }

            playersSeats.reverse().forEach((p, i) => {
                Object.assign(p, { position: positions[i] });
            });

            return playersSeats;
        };


        const buttonSeat = players.find(p => p.isButton).seat;

        const playersSeats = players.map(p => ({ seat: p.seat }));

        const isHeadsUp = players.length === 2;

        return isHeadsUp ? getPositionsHU() : getPositionsNonHU();
    },

    stringToCards: function (value) {

        return vikFunctions.cramped(value).match(/.{2}/g)
            .map(c => c.charAt(0).toUpperCase() + c.slice(1));

    },

    formatCards: function (input) {

        const value = vikFunctions.cramped(input);

        const formatedHand = value.replace(/[\w]/gi, (match, offset) => (offset % 2)
            ? match.toLowerCase() + ' '
            : match.toUpperCase()).trim();

        return formatedHand;
    },

    stringToStakes: function (value) {

        const blindsStr = value.match(/^[\d./]+/g);

        if (!blindsStr) return {};

        const decimalFail = x => !Number.isInteger(x * 100);
        const mapped = x => decimalFail(x) ? null : Number(x);
        const blinds = head(blindsStr).split('/').map(mapped);

        // Regex retorna `null` em >= 3 casas decimais
        const ante = value.match(/\((?:\d+)?\.?(?:\d{0,2})\)/);

        const straddles = value.match(/\[(?:\d+)?\.?(?:\d{0,2})]/g);

        const removeNonNumbers = str => Number(str.replace(/[^\d.]/g, ''));

        const stakes = {
            smallBlind: blinds[0] ?? 0,
            bigBlind: blinds[1] ?? 0,
            ante: ante ? removeNonNumbers(ante[0]) : 0,
            straddles: straddles ? [...straddles].map(n => removeNonNumbers(n)) : [],
            hasDecimal() {

                const temp = [this.smallBlind, this.bigBlind, this.ante];

                return temp.some(x => !Number.isInteger(x));
            }
        }

        return stakes;
    },



    /**
     * @param {object} stakes
     */
    stakesToString: function (stakes) {

        const { ante, smallBlind, bigBlind, straddles } = stakes;

        const anteText = ante ? `(${ante})` : '';

        const straddlesText = straddles != false ? `[${straddles.join('][')}]` : '';

        const result = `${smallBlind}/${bigBlind}${anteText}${straddlesText}`;

        return result;
    },

    potType(index, length) {

        if (length === 1) return 'pot';

        const sidePotNr = length > 2 && index ? `-${index}` : '';

        const potType = `${['main', 'side'][cap(1)(index)]} pot${sidePotNr}`;

        return potType;
    },

    playersLimitTableMax(value) {

        return Number(value.replace('-max', ''));
    }

};

export default biz;