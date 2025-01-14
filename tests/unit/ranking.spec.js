import mkRanking from "../../src/units/ranking";
import { bestRanking } from "../../src/units/ranking";


describe('ranking.js', () => {

    describe('# ranking - 5 cards', () => {

        it('1. pair', () => {

            const actual = mkRanking(['As', '5c', '6h', '6c', 'Ts']);

            const expected = {
                ranking: 1, kickers: [6, 6, 14, 10, 5], multiple: false,
                text: 'a pair of Sixes',
            };

            expect(actual).toEqual(expected);
        });

        it('2. high card', () => {

            const actual = mkRanking(['As', '5c', '6h', '2c', 'Ts']);

            const expected = {
                ranking: 0, kickers: [14, 10, 6, 5, 2], multiple: false,
                text: 'high card Ace',
            };

            expect(actual).toEqual(expected);
        });

        it('3. straight', () => {

            const actual = mkRanking(['As', 'Tc', 'Kh', 'Jc', 'Qs']);

            const expected = {
                ranking: 5, kickers: [14, 13, 12, 11, 10], multiple: false,
                text: 'a straight, Ten to Ace',
            };

            expect(actual).toEqual(expected);
        });

        it('4. Royal Flush', () => {

            const actual = mkRanking(['As', 'Ts', 'Ks', 'Js', 'Qs']);

            const expected = {
                ranking: 11, kickers: [14, 13, 12, 11, 10], multiple: false,
                text: 'a Royal Flush'
            };

            expect(actual).toEqual(expected);
        });

        it('5. three of a kind', () => {

            const actual = mkRanking(['As', 'Ts', 'Ts', '9c', 'Ts']);

            const expected = {
                ranking: 3, kickers: [10, 10, 10, 14, 9], multiple: false,
                text: 'three of a kind, Tens'
            };

            expect(actual).toEqual(expected);
        });

        it('6. two pairs', () => {

            const actual = mkRanking(['5s', 'As', '5c', 'Kc', 'Kh']);

            const expected = {
                ranking: 2, kickers: [13, 13, 5, 5, 14], multiple: false,
                text: 'two pair, Kings and Fives'
            };

            expect(actual).toEqual(expected);
        });

        it('7. four of a king', () => {

            const actual = mkRanking(['5s', 'As', '5d', '5c', '5h']);

            const expected = {
                ranking: 8, kickers: [5, 5, 5, 5, 14], multiple: false,
                text: 'four of a kind, Fives'
            };

            expect(actual).toEqual(expected);
        });

        it('8. full house', () => {

            const actual = mkRanking(['5s', 'As', '5d', '5c', 'Ah']);

            const expected = {
                ranking: 7, kickers: [5, 5, 5, 14, 14], multiple: false,
                text: 'a full house, Fives full of Aces'
            };

            expect(actual).toEqual(expected);
        });

        it('9. poker ', () => {

            const actual = mkRanking(['5s', 'As', '5d', '5c', '5h']);

            const expected = {
                ranking: 8, kickers: [5, 5, 5, 5, 14], multiple: false,
                text: 'four of a kind, Fives'
            };

            expect(actual).toEqual(expected);
        });

        it('10. steel wheel ', () => {

            const actual = mkRanking(['5s', 'As', '4s', '3s', '2s']);

            const expected = {
                ranking: 9, kickers: [14, 5, 4, 3, 2], multiple: false,
                text: 'a straight flush, Ace to Five'
            };

            expect(actual).toEqual(expected);
        });

        it('11. straight flush ', () => {

            const actual = mkRanking(['5s', '6s', '4s', '3s', '2s']);

            const expected = {
                ranking: 10, kickers: [6, 5, 4, 3, 2], multiple: false,
                text: 'a straight flush, Deuce to Six'
            };

            expect(actual).toEqual(expected);
        });

    });

    describe('# ranking - 7 cards', () => {

        it('1. pair', () => {

            const actual = mkRanking(['As', '5c', '6h', '6c', 'Ts', '2c', 'Kh']);

            const expected = {
                ranking: 1, kickers: [6, 6, 14, 13, 10], multiple: false,
                text: 'a pair of Sixes',
            };

            expect(actual).toEqual(expected);
        });

        it('2. two pair', () => {

            const actual = mkRanking(['As', '5c', '6h', '6c', 'As', '5d', 'Kh']);

            const expected = {
                ranking: 2, kickers: [14, 14, 6, 6, 13], multiple: false,
                text: 'two pair, Aces and Sixes',
            };

            expect(actual).toEqual(expected);
        });

        it('5. straight', () => {

            const actual = mkRanking(['3s', '5c', '6h', '7c', '4s', '5d', '8h']);

            const expected = {
                ranking: 5, kickers: [8, 7, 6, 5, 4], multiple: true,
                text: 'a straight, Four to Eight',
            };

            expect(actual).toEqual(expected);
        });

        it('6. Straight', () => {

            const actual = mkRanking(['6d', '7c', '2h', '3c', '4d', '5s', '7d']);

            const expected = {
                ranking: 5,
                text: 'a straight, Three to Seven',
                kickers: [7, 6, 5, 4, 3],
                multiple: true
            };

            expect(actual).toStrictEqual(expected);
        });

        it('7. full house', () => {

            const actual = mkRanking(['5s', '4h', 'As', '5d', '4c', '5c', 'Ah']);

            const expected = {
                ranking: 7, kickers: [5, 5, 5, 14, 14], multiple: false,
                text: 'a full house, Fives full of Aces'
            };

            expect(actual).toEqual(expected);
        });

    });


    describe('# bestRanking', () => {

        it('1. lot of two pairs, kicker counts', () => {

            const rankings = [
                { ranking: 2, kickers: [13, 13, 5, 5, 10] },
                { ranking: 2, kickers: [13, 13, 5, 5, 2] },
                { ranking: 1, kickers: [13, 13, 9, 5, 14] },
                { ranking: 2, kickers: [13, 13, 5, 5, 14] },
            ];

            const actual = bestRanking(rankings);

            const expected = { ranking: 2, kickers: [13, 13, 5, 5, 14], multiple: false };

            expect(actual).toEqual(expected);
        });

        it('2. same hand', () => {

            const rankings = [
                { ranking: 2, kickers: [13, 13, 5, 5, 10] },
                { ranking: 2, kickers: [13, 13, 5, 5, 10] },
            ];

            const actual = bestRanking(rankings);

            const expected = { ranking: 2, kickers: [13, 13, 5, 5, 10], multiple: true };

            expect(actual).toEqual(expected);
        });
    });

});
