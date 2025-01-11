/**
 * 
 *                          groupby    ranking
 * high card   = len 5                    0
 * pair        = len 4         4          1
 * two pair    = len 3         3          2
 * 3 of kind   = len 3         3          3
 * wheel       = len 5                    4
 * straight    = len 5                    5
 * flush       = len 5                    6
 * fullhouse   = len 2         2          7
 * poker       = len 2         2          8
 * steel wheel = len 5                    9
 * str8 flush  = len 5                    10
 * royal flush = len 5                    11
 * 
 */

const toValue = v => v <= 9 ? Number(v) : { T: 10, J: 11, Q: 12, K: 13, A: 14 }[v];

const valueToText = (value, { singular } = {}) => {

    const workMap = {

        '2': 'Deuce',
        '3': 'Three',
        '4': 'Four',
        '5': 'Five',
        '6': 'Six',
        '7': 'Seven',
        '8': 'Eight',
        '9': 'Nine',
        '10': 'Ten',
        '11': 'Jack',
        '12': 'Queen',
        '13': 'King',
        '14': 'Ace',
    };

    if (value === 6 && !singular) return 'Sixes';

    const suffix = singular ? '' : 's';

    return `${workMap[value]}${suffix}`;
};


const rankDupesValue = (flatDV, distintValues) => {

    const workMap = {

        '4': () => {
            // (a pair of Fives)
            const cardV = valueToText(flatDV.at(0).value);

            return { ranking: 1, text: `a pair of ${cardV}` };
        },

        '3': () => {

            // (three of a kind, Nines)
            if (flatDV.at(0).value === flatDV.at(1).value) {

                const cardV = valueToText(flatDV.at(0).value);

                return { ranking: 3, text: `three of a kind, ${cardV}` };
            }

            // (two pair, Kings and Fives)
            const sorted = [flatDV.at(0).value, flatDV.at(2).value].sort((a, b) => b - a);

            const cardV1 = valueToText(sorted.at(0));
            const cardV2 = valueToText(sorted.at(1));

            return { ranking: 2, text: `two pair, ${cardV1} and ${cardV2}` };
        },

        '2': () => {

            //  (four of a kind, Queens)
            if (flatDV.at(0).value === flatDV.at(3).value) {

                const cardV = valueToText(flatDV.at(0).value);

                return { ranking: 8, text: `four of a kind, ${cardV}` };
            }

            // (a full house, Threes full of Tens)
            const cardV1 = valueToText(flatDV.at(0).value);
            const cardV2 = valueToText(flatDV.at(3).value);

            return { ranking: 7, text: `a full house, ${cardV1} full of ${cardV2}` };
        }
    };

    return workMap[distintValues].call();
};


const rankUniquesValue = (flatDV) => {

    const isFlush = flatDV.every(v => v.suit === flatDV.at(0).suit);
    const isStraight = flatDV.at(-1).value - flatDV.at(0).value === 4;
    const isWheel = flatDV.every(v => [2, 3, 4, 5, 14].includes(v.value));
    const isRoyal = isFlush && flatDV.every(v => [10, 11, 12, 13, 14].includes(v.value));

    // (a Royal Flush)
    if (isRoyal) return { ranking: 11, text: 'a Royal Flush' };

    // (a straight flush, Nine to King)
    if (isFlush && isStraight) {
        const cardV1 = valueToText(flatDV.at(0).value, { singular: true });
        const cardV2 = valueToText(flatDV.at(-1).value, { singular: true });
        return { ranking: 10, text: `a straight flush, ${cardV1} to ${cardV2}` };
    }

    // (a straight flush, Ace to Five)
    if (isFlush && isWheel) return { ranking: 9, text: `a straight flush, Ace to Five` };

    // (a flush, Queen high)
    if (isFlush) {

        const cardV = valueToText(flatDV.at(-1).value, { singular: true });
        return { ranking: 6, text: `a flush, ${cardV} high` };
    }

    // (a straight, Ten to Ace)
    if (isStraight) {

        const cardV1 = valueToText(flatDV.at(0).value, { singular: true });
        const cardV2 = valueToText(flatDV.at(-1).value, { singular: true });
        return { ranking: 5, text: `a straight, ${cardV1} to ${cardV2}` };
    }

    // (a straight, Ace to Five)
    if (isWheel) return { ranking: 4, text: `a straight, Ace to Five` };

    // (high card King)
    const cardV = valueToText(flatDV.at(-1).value, { singular: true });
    return { ranking: 0, text: `high card ${cardV}` };
};


/**
 * @param {string[]} cards
 */
export default (cards) => {

    const cardsV = cards.map(v => ({ card: v, value: toValue(v.at(0)), suit: v.at(1) }));

    const orderV = cardsV.toSorted((a, b) => b.value - a.value);

    const groupBy = orderV.reduce((acc, cur) => {

        acc[cur.value] = acc[cur.value] ? [...acc[cur.value], cur] : [cur];

        return acc;

    }, {});

    const orderP = Object.values(groupBy).toSorted((a, b) => b.length - a.length);

    const flatDV = orderP.flatMap(v => v);

    const hasDupes = orderP.length !== 5;

    if (hasDupes) return rankDupesValue(flatDV, orderP.length);

    else return rankUniquesValue(flatDV);
};