import { makeTextTag } from '../units/fxnl.js';
import vikFunctions from '../units/vikFunctions.js';
import validation from '../units/validations';
import Vue from 'vue';
import { tail } from '../units/absx.js';


const winnersHandler = function () {

    this.value = validation.force.onlyNumbersOrSeparator(this.value);
};

const getSeatsAvailable = (histories, conclusion) => {

    const lastHistory = tail(histories);

    const isOnShowdown = conclusion.isOnShowdown(histories);

    const seatsAvailable = lastHistory.players
        .filter(isOnShowdown)
        .map(p => p.seat)
        .sort((a, b) => a - b);

    return seatsAvailable;
};

const markTag = makeTextTag('mark');

const getHtmlText = function (phase, seatsAvailableTagged, seatsAvailable) {

    const topText = `Please enter the${phase}winner seat: ${seatsAvailableTagged}`;

    const separators = `${markTag(',')}, ${markTag('.')} or ${markTag('-')}`;

    const bottomText = `Use ${separators} on split pots. e.g. ${markTag(seatsAvailable.slice(0, 2).join(', '))}`;

    return `${topText}<br>${bottomText}`;
};

const getWinnersFromPrompt = (htmlText) => Vue.swal.fire({

    html: htmlText,
    input: 'text',
    allowOutsideClick: false,
    allowEscapeKey: false,

    onBeforeOpen: (saEl) => {

        const input = saEl.querySelector('.swal2-input');
        input.setAttribute('inputmode', 'numeric');

        input.addEventListener('input', winnersHandler);
    },

    onClose: (saEl) => {

        const input = saEl.querySelector('.swal2-input');

        input.removeEventListener('input', winnersHandler);
    }
});

const resolveInput = function (value) {

    const cramped = vikFunctions.cramped(value);

    const numbersAndPoints = cramped.replace(/(,|-)/g, '.');

    const array = numbersAndPoints.split(/\./);

    return [...new Set(array)]
        .map(s => Number(s))
        .filter(s => s);
};

const core = async (histories, conclusion) => {

    const winners = [];

    const seatsAvailable = getSeatsAvailable(histories, conclusion);

    const seatsAvailableTagged = seatsAvailable
        .map(markTag)
        .join(' ');

    for (const index of conclusion.pots.keys()) {

        const phase = conclusion.pots.length === 1
            ? ' '
            : index === 0 ? ' (Main Pot) ' : ` (Side Pot ${index}) `;

        do {

            const htmlText = getHtmlText(phase, seatsAvailableTagged, seatsAvailable);

            const input = await getWinnersFromPrompt(htmlText);

            // Em split pot é mais que um por isso nome em plural (winnerSeats)
            // não confundir com main pot / side pot (que é outro index do 'for of')

            const winnerSeats = resolveInput(input.value);

            const isInputValid = winnerSeats.length && winnerSeats
                .every(s => seatsAvailable.includes(s));

            if (isInputValid) {

                const winnerPlayers = tail(histories).players
                    .filter(p => winnerSeats.includes(p.seat));

                winners.push(winnerPlayers);

            } else await Vue.swal.fire({
                icon: 'error',
                title: 'Incorrect data!',
                html: `Valid seats: ${seatsAvailableTagged}`
            });

        } while (winners.length === index);

    }

    return winners;
};


export default core;