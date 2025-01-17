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

    const { sideKeyCards } = SettingsStore.getters;

    if (value.length !== 1) return false;

    if (index === 0 || index === 3 || index === 6) {

        // STOPSHIP::
        // return value.match(/[2-9akqjt]/i) !== null;
        // return value.match(/[mpy/hnoiulkj.,]/i) !== null;

        if (sideKeyCards) return value.match(/[akqjtoiulgf.,]/i) !== null;

        else return value.match(/[2-9akqjt]/i) !== null;
    }

    const lastsCardChar = spacesOptions[this.maxLength].map(decrement);

    if (lastsCardChar.includes(index) || index >= this.maxLength - 1) {

        // STOPSHIP::
        // return value.match(/[dhsc]/i) !== null;
        // return value.match(/[dfsc]/i) !== null;

        if (sideKeyCards) return value.match(/[dhsc]/i) !== null;

        else return value.match(/[dhsc]/i) !== null;
    }

};

const cardCharFormat = (value) => {

    const replace = char => {

        // const workMap = {
        //     'm': 'A',
        //     'p': 'K',
        //     'y': 'Q',
        //     '/': 'Q',
        //     'h': 'J',
        //     'n': 'T',
        //     'o': '9',
        //     'i': '8',
        //     'u': '7',
        //     'l': '6',
        //     'k': '5',
        //     'j': '4',
        //     '.': '3',
        //     ',': '2',

        //     'f': 'h'
        // };

        const workMap = {
            'o': '9',
            'i': '8',
            'u': '7',
            'l': '6',
            'g': '5',
            'f': '4',
            '.': '3',
            ',': '2',
        };

        return workMap[char.toLowerCase()];
    };

    const { sideKeyCards } = SettingsStore.getters;

    if (sideKeyCards) return value
        .replace(/[akqjt]/g, match => match.toUpperCase())
        .replace(/[oiulgf.,]/i, match => replace(match))
        .replace(/[DSCH]/, match => match.toLowerCase());

    else return value
        .replace(/[akqjt]/g, match => match.toUpperCase())
        .replace(/[DHSC]/g, match => match.toLowerCase());

    // return value
    //     // .replace(/[akqjt]/g, match => match.toUpperCase())
    //     // .replace(/[DHSC]/g, match => match.toLowerCase());
    //     .replace(/[mpy/hnoiulkj.,]/i, match => replace(match))
    //     .replace(/[f]/i, match => replace(match))
    //     .replace(/[DSC]/, match => match.toLowerCase());

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




const handleKeypress = function (event) {

    event.preventDefault();

    const { key } = event;
    const { selectionStart } = this;

    if (!isCharValid.call(this, key, selectionStart)) return;

    const properChar = cardCharFormat(key);

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

};

const preventDefault = event => event.preventDefault();

const createEvents = function (element) {

    element.addEventListener('focus', handleFocus);
    element.addEventListener('focusout', handleFocusout);

    element.addEventListener('keypress', handleKeypress);
    element.addEventListener('keydown', handleKeydown);

    element.addEventListener('paste', preventDefault);
    element.addEventListener('dragstart', preventDefault);
    element.addEventListener('drop', preventDefault);
};

const removeEvents = function (element) {

    element.removeEventListener('focus', handleFocus);
    element.removeEventListener('focusout', handleFocusout);

    element.removeEventListener('keypress', handleKeypress);
    element.removeEventListener('keydown', handleKeydown);

    element.removeEventListener('paste', preventDefault);
    element.removeEventListener('dragstart', preventDefault);
    element.removeEventListener('drop', preventDefault);
};

export default { createEvents, removeEvents };