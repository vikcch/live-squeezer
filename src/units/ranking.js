import { mkCombinations } from '../extra/fns';

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

    const [cardVi0, , cardVi2, cardVi3] = flatDV.map(v => v.value);

    const workMap = {

        '4': () => {
            // (a pair of Fives)
            const textCard = valueToText(cardVi0);

            return { ranking: 1, text: `a pair of ${textCard}` };
        },

        '3': () => {

            // (three of a kind, Nines)
            if (cardVi0 === cardVi2) {

                const textCard = valueToText(cardVi0);

                return { ranking: 3, text: `three of a kind, ${textCard}` };
            }

            // (two pair, Kings and Fives)
            const highTextCard = valueToText(Math.max(cardVi0, cardVi2));
            const lowTextCard = valueToText(Math.min(cardVi0, cardVi2));

            return { ranking: 2, text: `two pair, ${highTextCard} and ${lowTextCard}` };

        },

        '2': () => {

            //  (four of a kind, Queens)
            if (cardVi0 === cardVi3) {

                const textCard = valueToText(cardVi0);

                return { ranking: 8, text: `four of a kind, ${textCard}` };
            }

            // (a full house, Threes full of Tens)
            const tripsTextCard = valueToText(cardVi0);
            const pairTextCard = valueToText(cardVi3);

            return { ranking: 7, text: `a full house, ${tripsTextCard} full of ${pairTextCard}` };
        }
    };

    return workMap[distintValues].call();
};


const rankUniquesValue = (flatDV) => {

    const lowValueCard = flatDV.at(-1).value;
    const highValueCard = flatDV.at(0).value;

    const isFlush = flatDV.every(v => v.suit === flatDV.at(0).suit);
    const isStraight = highValueCard - lowValueCard === 4;
    const isWheel = flatDV.every(v => [2, 3, 4, 5, 14].includes(v.value));
    const isRoyal = isFlush && isStraight && lowValueCard === 10;

    // (a Royal Flush)
    if (isRoyal) return { ranking: 11, text: 'a Royal Flush' };

    // (a straight flush, Nine to King)
    if (isFlush && isStraight) {
        const lowTextCard = valueToText(lowValueCard, { singular: true });
        const highTextCard = valueToText(highValueCard, { singular: true });
        return { ranking: 10, text: `a straight flush, ${lowTextCard} to ${highTextCard}` };
    }

    // (a straight flush, Ace to Five)
    if (isFlush && isWheel) return { ranking: 9, text: `a straight flush, Ace to Five` };

    // (a flush, Queen high)
    if (isFlush) {

        const textCard = valueToText(highValueCard, { singular: true });
        return { ranking: 6, text: `a flush, ${textCard} high` };
    }

    // (a straight, Ten to Ace)
    if (isStraight) {

        const lowTextCard = valueToText(lowValueCard, { singular: true });
        const highTextCard = valueToText(highValueCard, { singular: true });
        return { ranking: 5, text: `a straight, ${lowTextCard} to ${highTextCard}` };
    }

    // (a straight, Ace to Five)
    if (isWheel) return { ranking: 4, text: `a straight, Ace to Five` };

    // (high card King)
    const textCard = valueToText(highValueCard, { singular: true });
    return { ranking: 0, text: `high card ${textCard}` };
};


export const bestRanking = rankings => {

    const maxRanking = Math.max(...rankings.map(v => v.ranking));

    const bestsRank = rankings.filter(v => v.ranking === maxRanking);

    const blend = kickers => kickers.map(v => `${v}`.padStart(2, '0')).join('');

    const bestsBlended = bestsRank.map(v => ({ ...v, blend: blend(v.kickers) }));

    const maxKickers = Math.max(...bestsBlended.map(v => Number(v.blend)));

    const bests = bestsBlended.filter(v => Number(v.blend) === maxKickers);

    const best = bestsBlended.find(v => Number(v.blend) === maxKickers);

    delete best.blend;

    if (bests.length === 1) return best;
    
    // NOTE:: "multiple" aka "splitPot" quando vem de `winners-popup.js`
    else return { ...best, multiple: true };
};

const mkRanking = fiveCards => {

    const cardsV = fiveCards.map(v => ({ card: v, value: toValue(v.at(0)), suit: v.at(1) }));

    const groupBy = cardsV.reduce((acc, cur) => {

        acc[cur.value] = acc[cur.value] ? [...acc[cur.value], cur] : [cur];

        return acc;

    }, {});

    const orderDV = Object.values(groupBy)
        .toSorted(([a], [b]) => b.value - a.value)
        .toSorted((a, b) => b.length - a.length);

    const flatDV = orderDV.flatMap(v => v);

    const hasDupes = orderDV.length !== 5;

    const ranking = hasDupes
        ? rankDupesValue(flatDV, orderDV.length)
        : rankUniquesValue(flatDV);

    return { ...ranking, kickers: flatDV.map(v => v.value) };
};


/**
 * @param {string[]} cards Length: 5, 6 or 7
 */
export default (cards) => {

    if (cards.length < 5) return;

    const combinations = mkCombinations(cards, 5);

    const rankings = combinations.map(v => mkRanking(v));

    return bestRanking(rankings);
};