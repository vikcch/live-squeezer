import state from '../units/state.js';
import fxnl from '../units/fxnl.js';
import absx from '../units/absx.js';
import SettingsStore from '../store/simple/settings.js';

const { pipe, cap, capFloor, add, iffLackValue, iffFns } = fxnl;
const { increment, decrement } = absx;

const isUnderscoreChar = char => char === '_';

const spacesOptions = { '2': [], '5': [2], '8': [2, 5] };

const placeChar = function (char, spliceIndex, advanceCaret = 0) {

    const array = Array.from(this.value);

    array.splice(spliceIndex, 1, char);

    this.value = array.join('');

    this.dispatchEvent(new Event('input'));

    this.selectionEnd = spliceIndex + advanceCaret;

    state.printCards(this);
};


const isCharValid = function (value, index) {

    if (value.length !== 1) return false;

    if (index === 0 || index === 3 || index === 6) {

        // NOTE:: "-" nas pontas não precisa de escape (inside brackets)
        return value.match(/[0-9akqjt/*-]/i) !== null;
    }

    const lastsCardChar = spacesOptions[this.maxLength].map(decrement);

    if (lastsCardChar.includes(index) || index >= this.maxLength - 1) {

        return value.match(/[sdch4526]/i) !== null;
    }

};

const cardCharFormat = (value, selectionStart) => {

    const replace = char => {

        const rankMap = {
            '1': 'A',
            '-': 'K',
            '*': 'Q',
            '/': 'J',
            '0': 'T',
        };

        const suitMap = {
            '4': 's',
            '5': 'd',
            '2': 'c',
            '6': 'h',
        };

        const isRank = [0, 3, 6].includes(selectionStart);

        const workMap = isRank ? rankMap : suitMap;

        return workMap[char] ?? char;
    };

    return value
        .replace(/[akqjt]/g, match => match.toUpperCase())
        .replace(/[0-9/*-]/i, match => replace(match))
        .replace(/[DSCH]/, match => match.toLowerCase());
}

const handleFocus = function (event) {

    this.selectionStart = 0;
    this.selectionEnd = 0;

    event.currentTarget.style.color = 'black';

    setTimeout(function () {

        const array = Array.from(this.value);

        const index = array.findIndex(isUnderscoreChar);

        this.setSelectionRange(index, index);

    }.bind(this), 0);

};


const handleFocusout = function (event) {

    const input = event.currentTarget;

    const color = input.value === '__ __' ? '#646464' : 'black';

    input.style.color = color;
};

/**
 * @param {KeyboardEvent} event 
 */
const getKeyWithPaintMap = ({ key, altKey, code }) => {

    if (!altKey) return key;

    const paintMap = {

        Numpad7: 'J',
        Numpad8: 'K',
        Numpad9: 'Q',
    };

    // NOTE:: Retorna `false` quando "code" não existe no map
    return code in paintMap && paintMap[code];
};



const handleKeypress = function (event) {

    // NOTE:: Não pode ser para todos, "TAB" é preciso para mudar "holecards"
    if (event.code === "AltLeft") event.preventDefault();

    const { selectionStart } = this;

    const key = getKeyWithPaintMap(event);

    if (!isCharValid.call(this, key, selectionStart)) return;

    const properChar = cardCharFormat(key, selectionStart);

    const capChars = cap(this.maxLength - 1);

    const spaces = spacesOptions[this.maxLength];
    const isOnSpace = spaces.includes(selectionStart);

    const spliceIndex = capChars(selectionStart + (isOnSpace ? 1 : 0));

    const beforeSpaces = spacesOptions[this.maxLength].map(decrement);
    const advanceCaret = beforeSpaces.includes(spliceIndex) ? 2 : 1;

    placeChar.call(this, properChar, spliceIndex, advanceCaret);
};

const handleKeydown = function (event) {

    const { key } = event;
    const { selectionStart } = this;

    const work = {

        ArrowRight: () => {

            const beforeSpaces = spacesOptions[this.maxLength].map(decrement);

            const x = selectionStart + 1;

            beforeSpaces.includes(selectionStart) && this.setSelectionRange(x, x);
        },

        ArrowLeft: () => {

            const afterSpaces = spacesOptions[this.maxLength].map(increment);

            const x = selectionStart - 1;

            afterSpaces.includes(selectionStart) && this.setSelectionRange(x, x);
        },

        Backspace: () => {

            event.preventDefault();

            const afterSpaces = spacesOptions[this.maxLength].map(increment);

            const isAfterSpace = afterSpaces.includes(selectionStart);

            const capMinZero = capFloor(0);

            const decrementTwo = add(-2);

            const decrementTwoOrOne = iffFns(isAfterSpace, decrementTwo, decrement);

            const spliceIndex = pipe(decrementTwoOrOne, capMinZero)(selectionStart);

            placeChar.call(this, '_', spliceIndex);
        },

        Delete: () => {

            event.preventDefault();

            const spaces = spacesOptions[this.maxLength];

            if (spaces.includes(selectionStart) || selectionStart > this.maxLength) return;

            const spliceIndex = iffLackValue(this.maxLength, decrement)(selectionStart);

            placeChar.call(this, '_', spliceIndex);
        }

    };

    key in work && work[key].call();

    // NOTE:: Já não existe evento "keypress", fica combinado com este "keydown"
    handleKeypress.call(this, event);
};

const preventDefault = event => event.preventDefault();

const createEvents = function (element) {

    element.addEventListener('focus', handleFocus);
    element.addEventListener('focusout', handleFocusout);

    element.addEventListener('keydown', handleKeydown);

    element.addEventListener('paste', preventDefault);
    element.addEventListener('dragstart', preventDefault);
    element.addEventListener('drop', preventDefault);
};

const removeEvents = function (element) {

    element.removeEventListener('focus', handleFocus);
    element.removeEventListener('focusout', handleFocusout);

    element.removeEventListener('keydown', handleKeydown);

    element.removeEventListener('paste', preventDefault);
    element.removeEventListener('dragstart', preventDefault);
    element.removeEventListener('drop', preventDefault);
};

export default { createEvents, removeEvents };