import ranking from "../../src/units/ranking";


describe('ranking.js', () => {

    it('1. ', () => {

        const actual = ranking(['As', '5c', '6h', '6c', 'Ts']);

        const expected = { ranking: 1, text: 'a pair of Sixes' };

        expect(actual).toEqual(expected);
    });

    it('2. ', () => {

        const actual = ranking(['As', '5c', '6h', '2c', 'Ts']);

        const expected = { ranking: 0, text: 'high card Ace' };

        expect(actual).toEqual(expected);
    });

});