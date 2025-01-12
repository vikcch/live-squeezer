import ranking from "../../src/units/ranking";


describe('ranking.js', () => {

    it('1. pair', () => {

        const actual = ranking(['As', '5c', '6h', '6c', 'Ts']);

        const expected = { ranking: 1, text: 'a pair of Sixes', kickers: [6, 6, 14, 10, 5] };

        expect(actual).toEqual(expected);
    });

    it('2. high card', () => {

        const actual = ranking(['As', '5c', '6h', '2c', 'Ts']);

        const expected = { ranking: 0, text: 'high card Ace', kickers: [14, 10, 6, 5, 2] };

        expect(actual).toEqual(expected);
    });

    it('3. straight', () => {

        const actual = ranking(['As', 'Tc', 'Kh', 'Jc', 'Qs']);

        const expected = { ranking: 5, text: 'a straight, Ten to Ace', kickers: [14, 13, 12, 11, 10] };

        expect(actual).toEqual(expected);
    });

    it('4. Royal Flush', () => {

        const actual = ranking(['As', 'Ts', 'Ks', 'Js', 'Qs']);

        const expected = { ranking: 11, text: 'a Royal Flush', kickers: [14, 13, 12, 11, 10] };

        expect(actual).toEqual(expected);
    });

    it('5. three of a kind', () => {

        const actual = ranking(['As', 'Ts', 'Ts', '9c', 'Ts']);

        const expected = { ranking: 3, text: 'three of a kind, Tens', kickers: [10, 10, 10, 14, 9] };

        expect(actual).toEqual(expected);
    });

    it('6. two pairs', () => {

        const actual = ranking(['5s', 'As', '5c', 'Kc', 'Kh']);

        const expected = { ranking: 2, text: 'two pair, Kings and Fives', kickers: [13, 13, 5, 5, 14] };

        expect(actual).toEqual(expected);
    });

    it('7. four of a king', () => {

        const actual = ranking(['5s', 'As', '5d', '5c', '5h']);

        const expected = { ranking: 8, text: 'four of a kind, Fives', kickers: [5, 5, 5, 5, 14] };

        expect(actual).toEqual(expected);
    });

    it('8. full house', () => {

        const actual = ranking(['5s', 'As', '5d', '5c', 'Ah']);

        const expected = { ranking: 7, text: 'a full house, Fives full of Aces', kickers: [5, 5, 5, 14, 14] };

        expect(actual).toEqual(expected);
    });

});