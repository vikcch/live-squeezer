// ▁ ▂ ▄ ▅ ▆ ▇ █ [ Functional ] █ ▇ ▆ ▅ ▄ ▂ ▁

// http://www.webestools.com/tools.html

// importando cria dependencia circular
// import { head, tail } from './absx.js';

const head = array => array[0];

const tail = array => array.slice(-1)[0]; 

export const pipe = (...fns) => (arg) => fns.reduce((acc, cur) => cur(acc), arg);

export const or = (...args) => x => args
    .reduce((acc, cur) => acc === true || cur === x, false);

// Aritmeticas
export const add = x => y => x + y;

export const cap = max => value => value > max ? max : value;

export const capFloor = min => value => value < min ? min : value;

export const makePrefixer = prefix => string => `${prefix}${string}`;

export const makeSufixer = sufixe => string => `${string}${sufixe}`;

export const isInRange = (min, max) => value => Number(value) >= min && Number(value) <= max;

export const makeTextTag = (...tags) => text => {

    const tagEdges = [['<', '>'], ['</', '>']];

    const being = tags.reduce((acc, cur) => acc + head(tagEdges).join(cur), '');

    const end = tags.reduceRight((acc, cur) => acc + tail(tagEdges).join(cur), '');

    return being + text + end;
};

// const iff = (x, y, fn) => value => x === value ? y : fn(value);

const iffLackValue = (x, fn) => value => x === value ? fn(value) : value;

// const iffLackX = (x, fn) => value => x === value ? fn(value) : x;

// const iffFnFn = (bool, fnA, fnB) => value => bool ? fnA(value) : fnB(value);

const iffFns = (bool, ...fns) => value => bool ? head(fns)(value) : tail(fns)(value);

export const isSameProperty = (property, x) => y => x[property] === y[property];

export const delegate = (handler, ...args) => (e) => handler(e, ...args);

export default {
    pipe,
    cap,
    capFloor,
    add,
    iffLackValue,
    iffFns,
    makePrefixer,
    makeSufixer,
    isInRange, 
    or
};
