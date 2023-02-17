import validation from "../../src/units/validations";

describe('# validations', function () {


    describe('isStack', function () {

        it('1.', () => {

            const actual = validation.business.player.isStack('123');
            const expected = true;

            expect(actual).toStrictEqual(expected);
        });

        it('2.', () => {

            const actual = validation.business.player.isStack('123.00');
            const expected = true;

            expect(actual).toStrictEqual(expected);
        });

        it('3.', () => {

            const actual = validation.business.player.isStack('123.002');
            const expected = false;

            expect(actual).toStrictEqual(expected);
        });

        it('4.', () => {

            const actual = validation.business.player.isStack('123.00.2');
            const expected = false;

            expect(actual).toStrictEqual(expected);
        });

        it('5.', () => {

            const actual = validation.business.player.isStack('123..2');
            const expected = false;

            expect(actual).toStrictEqual(expected);
        });

        it('6.', () => {

            const actual = validation.business.player.isStack('15.2');
            const expected = true;

            expect(actual).toStrictEqual(expected);
        });

        it('7.', () => {

            // NOTE:: Causa floating point error
            const actual = validation.business.player.isStack('324.65');
            const expected = true;

            expect(actual).toStrictEqual(expected);
        });

        it('8.', () => {

            const actual = validation.business.player.isStack('asd.65');
            const expected = false;

            expect(actual).toStrictEqual(expected);
        });

        it('9.', () => {

            const actual = validation.business.player.isStack('vik');
            const expected = false;

            expect(actual).toStrictEqual(expected);
        });

        it('10.', () => {

            const actual = validation.business.player.isStack('12.');
            const expected = true;

            expect(actual).toStrictEqual(expected);
        });

        it('11.', () => {

            // NOTE:: Causa floating point error
            const actual = validation.business.player.isStack('567.32');
            const expected = true;

            expect(actual).toStrictEqual(expected);
        });

        it('12.', () => {

            // NOTE:: Causa floating point error
            const actual = validation.business.player.isStack('567 ');
            const expected = true;

            expect(actual).toStrictEqual(expected);
        });

    });



});