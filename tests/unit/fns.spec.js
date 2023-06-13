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

    describe('# makeComplexObject', () => {

        it('1.', () => {

            const actual = fns.makeComplexObject(['a', 'b', 'c']);

            const expected = { a: { b: { c: {} } } };

            expect(actual).toStrictEqual(expected);
        });

        it('2.', () => {

            const actual = fns.makeComplexObject(['a', 'b', 'c'], '9-max');

            const expected = { a: { b: { c: '9-max' } } };

            expect(actual).toStrictEqual(expected);

        });

        it('3.', () => {

            const actual = fns.makeComplexObject(['$root', '$data', 'view'], 'myView');

            const expected = { $root: { $data: { view: 'myView' } } };

            expect(actual).toStrictEqual(expected);

        });

    });

});