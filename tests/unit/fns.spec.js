import fns from '../../src/units/vikFunctions';

describe('vikFunctions.js', () => {

    describe('# neat', () => {

        it('1.', () => {

            const actual = fns.neat('merda ');

            const expected = 'merda';

            expect(actual).toStrictEqual(expected);
        });

        it('2.', () => {

            const actual = fns.neat('vik  man ');

            const expected = 'vik man';

            expect(actual).toStrictEqual(expected);
        });

    });

});