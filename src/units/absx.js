// ▁ ▂ ▄ ▅ ▆ ▇ █ [ Abstractions ] █ ▇ ▆ ▅ ▄ ▂ ▁

//import { add, makeSufixer, isInRange } from './fxnl.js';
//import { makeSufixer, isInRange } from './fxnl.js';
import fxnl from './fxnl.js';

const { add, makeSufixer, isInRange, capFloor, cap } = fxnl;

export const head = array => array[0];

export const tail = array => array.slice(-1)[0];

const increment = add(1);

const decrement = add(-1);

export const lineBreaker = makeSufixer('\r\n');

export const handGap = makeSufixer(('\r\n').repeat(3));

export const isWithinOneToTen = isInRange(1, 10);

export const capFloorZero = capFloor(0);

export const cap100 = cap(100);

export default { head, tail, increment, decrement, isWithinOneToTen };
