import { $q } from '../units/vikFunctions.js';
import { elFactory } from '../extra/fns.js';
import Deck from './deck.js';
import state from '../units/state.js';
import Vue from 'vue';
import deck20x27 from '../assets/deck-20x27.js';

export default class CardsPopup {

    constructor(deck, fieldInfo, relatedInput, playersInput) {

        this.deck = deck;
        this.fieldInfo = fieldInfo;

        this.relatedInput = relatedInput;
        this.playersInput = playersInput;

        this.divContent = this.obtainDivContent();

        this.setCardsImage();

        this.deletePlayersButton = this.divContent.querySelector('#clear-all-players-cards-popup');

        this.deleteFieldButton = this.divContent.querySelector('#clear-field-cards-popup');

        this.setDeleteButtonText();

        this.createCardsElements();

        this.divCards = this.divContent.querySelector('#cards-popup');

        this.setFieldInfo();

        this.show();

        this.updateFieldCards();

        this.addEventListeners();

        this.setAllCardsState();
    }

    obtainDivContent() {

        const fragment = $q('#template-popup-cards').content.cloneNode(true);

        const div = document.createElement('div');
        div.appendChild(fragment);

        return div.querySelector('.popup-content');
    }

    setCardsImage() {

        this.imgCardsImage = this.divContent.querySelector('#popup-cards-image');
        this.imgCardsImage.src = deck20x27;
    }

    setDeleteButtonText() {

        if (this.relatedInput.name !== 'hole-cards') return;

        const span = this.deletePlayersButton.querySelector('.css-button-text');

        span.textContent = 'Delete Others Players Cards';
    }

    createCardsElements() {

        const pickedCards = this.deck.getPickedCards;
        const pickedFieldCards = this.deck.getFieldCards;

        const cardsWrapper = this.divContent.querySelector('#cards-wrapper');

        Deck.getAbbr().forEach(card => {

            let classes = 'card card--';
            classes += pickedCards.includes(card) ? 'picked' : 'hoverable';

            if (pickedFieldCards.includes(card)) classes += ' card--picked-field';

            const el = elFactory('div', { class: classes, 'data-card': card });

            cardsWrapper.appendChild(el);
        });
    }

    setFieldInfo() {

        const fieldLabel = this.divContent.querySelector('#field-label');
        fieldLabel.innerHTML = this.fieldInfo.name;
    }

    updateFieldCards() {

        const divFieldCards = this.divContent.querySelector('#field-cards');

        state.removeChildElements(divFieldCards);

        const fieldCards = this.deck.getFieldCards;

        const placeHolders = this.fieldInfo.capacity - fieldCards.length;

        fieldCards.push(...Array.from(Array(placeHolders), () => ''));

        fieldCards.forEach(card => {

            const divCard = elFactory('div', {
                class: `card ${card ? 'viewport' : 'card-place-holder'}`,
                style: 'margin-bottom: 0px'
            });

            if (card) {

                const cardSize = { width: 20, height: 27 };

                state.appendFieldCard(divCard, card, cardSize, deck20x27, 4);
            }

            divFieldCards.appendChild(divCard);
        });

    }

    show() {

        Vue.swal.fire({
            title: `Choose the cards!`,
            html: this.divContent,
            input: 'text',
            showCancelButton: true,
            onClose: this.removeEventListeners.bind(this),

            inputValidator: () => {

                const { fieldCards } = this.deck;

                if (fieldCards.includes('')) {

                    document.querySelector('.swal2-validation-message').style.marginTop = '12px';

                    return 'Pick the Cards or Cancel!';
                }

                this.relatedInput.value = fieldCards.join(' ');

                state.printCards(this.relatedInput);

                this.relatedInput.dispatchEvent(new Event('input'));
            }
        });

        const input = document.querySelector('.swal2-input');
        input.style.display = 'none';
    }

    handleCard_Click = (event) => {

        const { classList } = event.target;

        if (!Array.from(classList).includes('card')) return;

        if (Array.from(classList).includes('card--picked')) return;

        const toggleFieldCard = (toAdd, toRemove) => {

            const index = fieldCards.indexOf(toRemove);
            fieldCards[index] = toAdd;

            this.updateFieldCards();

            classList.toggle('card--picked-field');
        };

        const cardAbbr = event.target.getAttribute('data-card');

        const { fieldCards } = this.deck;

        if (fieldCards.includes(cardAbbr)) {

            toggleFieldCard('', cardAbbr);

        } else if (fieldCards.includes('')) {

            toggleFieldCard(cardAbbr, '');
        }

        this.setAllCardsState();
    }

    setAllCardsState() {

        const { fieldCards } = this.deck;

        const taskArr = ['add', 'remove'];
        const taskIndex = fieldCards.includes('') | 0; // ou & 1

        const task = {

            disabled: taskArr[taskIndex],
            hoverable: taskArr[1 - taskIndex]
        };

        this.divContent.querySelectorAll('.card').forEach(c => {

            !Array.from(c.classList).includes('card-picked') && c.classList[task.disabled]('card--disabled');
            !Array.from(c.classList).includes('card-picked-field') && c.classList[task.hoverable]('card--hoverable');
        });
    }

    deleteWrapUp(inputEl) {

        inputEl.value = '__ __';

        state.printCards(inputEl);

        inputEl.dispatchEvent(new Event('input'));
        inputEl.dispatchEvent(new Event('focusout'));
    }

    handleDeleteFieldCards_Click = () => {

        this.deck.fieldCards.filter(c => c).forEach(c => {

            const divCard = this.divCards.querySelector(`div[data-card="${c}"]`);
            divCard.classList.remove('card--picked-field');
        });

        const { capacity } = this.fieldInfo;

        this.deck.fieldCards = Array.from(Array(capacity), () => '');

        this.updateFieldCards();

        this.setAllCardsState();

        this.deleteWrapUp(this.relatedInput);
    }

    handleDeletePlayersCards_Click = () => {

        const { pickedPlayersCards } = this.deck

        pickedPlayersCards.forEach(c => {

            const divCard = this.divCards.querySelector(`div[data-card="${c}"]`);
            divCard.classList.remove('card--picked');
        });

        this.deck.pickedPlayersCards = [];

        this.playersInput.forEach(pi => {

            this.deleteWrapUp(pi);
        });
    }

    addEventListeners() {

        this.divCards.addEventListener('click', this.handleCard_Click);

        this.deleteFieldButton.addEventListener('click', this.handleDeleteFieldCards_Click.bind(this));

        this.deletePlayersButton.addEventListener('click', this.handleDeletePlayersCards_Click.bind(this));
    }

    removeEventListeners() {

        this.divCards.removeEventListener('click', this.handleCard_Click);

        this.deleteFieldButton.removeEventListener('click', this.handleDeleteFieldCards_Click);

        this.deletePlayersButton.removeEventListener('click', this.handleDeletePlayersCards_Click);
    }

}