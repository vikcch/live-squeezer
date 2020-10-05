import Deck from '../eases/deck.js';
import { elFactory } from '../extra/fns.js';
import deck16x20 from '../assets/deck-16x20.js';

function appendFieldCard(divCard, card, cardSize, imageData, margin = 0) {

    const cardIndex = Deck.getAbbr().indexOf(card);

    const column = cardIndex % 13;
    const row = Math.floor(cardIndex / 13);

    const x = column * cardSize.width + column * margin;
    const y = row * cardSize.height + row * margin;

    const imgDeck = elFactory('img', {
        class: 'clipped',
        style: `left: -${x}px; top: -${y}px`,
        src: imageData
    });

    divCard.appendChild(imgDeck);
}

function removeChildElements(parent) {

    while (parent.firstChild) {

        parent.removeChild(parent.firstChild);
    }

}

const printCards = (inputEl) => {

    const wrapperCardsDiv = inputEl.previousElementSibling;

    removeChildElements(wrapperCardsDiv);

    wrapperCardsDiv.classList.remove('hidden');

    const cardsTotal = { '2': 1, '5': 2, '8': 3 }[inputEl.maxLength];

    const cards = inputEl.value.split(' ', cardsTotal);

    cards.forEach((card, index) => {

        if (!Deck.getAbbr().includes(card)) return;

        const ordinal = ['first', 'second', 'third'][index];

        const divCard = elFactory('div', { class: `card-small-ps viewport ${ordinal}-card` });

        const cardSize = { width: 16, height: 20 };

        appendFieldCard(divCard, card, cardSize, deck16x20);

        wrapperCardsDiv.appendChild(divCard);

    });

};

export default { appendFieldCard, removeChildElements, printCards };