import { makeTextTag } from '../units/fxnl.js';
import vikFunctions from '../units/vikFunctions.js';
import validation from '../units/validations';
import Vue from 'vue';
import { tail } from '../units/absx.js';
import Street from './street.js';
import Player from '../classes/player.js';
import mkRanking, { bestRanking } from '../units/ranking.js';

const winnersHandler = function () {

    this.value = validation.force.onlyNumbersOrSeparator(this.value);
};

const getPlayersAvailable = (histories, conclusion) => {

    const lastHistory = tail(histories);

    const isOnShowdown = conclusion.isOnShowdown(histories);

    const seatsAvailable = lastHistory.players
        .filter(isOnShowdown)
        .map(p => ({ seat: p.seat, name: p.name, holeCards: p.holeCards }))
        .sort((a, b) => a.seat - b.seat);

    return seatsAvailable;
};

const markTag = makeTextTag('mark');

const mkSeatsAvailableTagged = seats => seats.map(markTag).join(' ');

const mkHtmlText = function (phase, playersAvailable, bestRankingPlayer, singlePot) {

    // OPTIMIZE:: Meter component vue dentro de sweetalert

    const seats = playersAvailable.map(v => v.seat);

    const seatsAvailableTagged = mkSeatsAvailableTagged(seats);

    const coloredSeats = /* html */ `<span class="colored-seat"> ${seatsAvailableTagged} </span>`;

    const topText = `Please enter the${phase}winner seat: ${coloredSeats}`;

    const players = playersAvailable.map(v => `${markTag(v.seat)} ${v.name}`).join(' • ');
    const playersStyled = /* html */ `<div class="colored-seat tm-m"> ${players} </div>`;

    const separators = `${markTag(',')}, ${markTag('.')} or ${markTag('-')}`;

    const bottomText = `Use ${separators} on split pots. e.g. ${markTag(seats.slice(0, 2).join(', '))}`;

    const bottomTextStyled = /* html */ `<div class="tm-l small-text"> ${bottomText} </div>`;

    // NOTE:: "bestRankingPlayer.multiple" aka "splitPot"
    const winner = !singlePot || !bestRankingPlayer || bestRankingPlayer.multiple ? ''
        : /* html */ `<div class="colored-seat tm-l"> Winner: ${markTag(bestRankingPlayer.player.seat)} ${bestRankingPlayer.player.name}
                        <br><span class="small-text">(${bestRankingPlayer.text})</span>
                      </div>`;


    return `${topText}${playersStyled}${bottomTextStyled}${winner}`;
};

const getWinnersFromPrompt = (htmlText, bestSeat) => Vue.swal.fire({

    html: htmlText,
    input: 'text',
    inputValue: bestSeat,
    allowOutsideClick: false,
    allowEscapeKey: false,

    onOpen: (saEl) => {
        const input = saEl.querySelector('.swal2-input');
        input.select();
    },

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

const tryGetBestRankingPlayer = (histories, playersAvailable) => {

    const arrStreetCards = Street.mkStreetCards(histories);

    const rankings = playersAvailable.map(player => {

        const arrHolecards = Player.mkHoleCards(player.holeCards);

        const ranking = mkRanking([...arrHolecards, ...arrStreetCards]);

        return { ...ranking, player };
    });

    const hasHoleCards = player => Player.mkHoleCards(player.holeCards).length;

    if (playersAvailable.some(v => !hasHoleCards(v))) return null;

    return bestRanking(rankings);
};


const core = async (histories, conclusion) => {

    const winners = [];

    const playersAvailable = getPlayersAvailable(histories, conclusion);

    const seatsAvailable = playersAvailable.map(v => v.seat);

    const bestRankingPlayer = tryGetBestRankingPlayer(histories, playersAvailable);

    for (const index of conclusion.pots.keys()) {

        const singlePot = conclusion.pots.length === 1;

        const phase = singlePot
            ? ' '
            : index === 0 ? ' (Main Pot) ' : ` (Side Pot ${index}) `;

        do {

            const htmlText = mkHtmlText(phase, playersAvailable, bestRankingPlayer, singlePot);

            const singleWinnerAndPot = singlePot && bestRankingPlayer?.multiple === false;

            const bestSeat = singleWinnerAndPot ? bestRankingPlayer.player.seat : '';

            const input = await getWinnersFromPrompt(htmlText, bestSeat);

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
                html: `Valid seats: ${mkSeatsAvailableTagged(seatsAvailable)}`
            });

        } while (winners.length === index);

    }

    return winners;
};


export default core;

export const testables = {

    tryGetBestRankingPlayer
};