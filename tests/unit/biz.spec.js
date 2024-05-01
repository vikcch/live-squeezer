import biz from '../../src/units/biz';

describe('biz.js', function () {

    describe('# nextAvailableSeat', function () {

        it('1. ', () => {

            const actual = biz.nextAvailableSeat([1, 3, 5], 6);
            const expected = 6;

            expect(actual).toStrictEqual(expected);
        });

        it('2. ', () => {

            const actual = biz.nextAvailableSeat([1, 3, 6], 6);
            const expected = 2;

            expect(actual).toStrictEqual(expected);
        });

        it('3. ', () => {

            const actual = biz.nextAvailableSeat([1, 3, 8], 9);
            const expected = 9;

            expect(actual).toStrictEqual(expected);
        });

        it('4. ', () => {

            const actual = biz.nextAvailableSeat([1, 2, 9], 9);
            const expected = 3;

            expect(actual).toStrictEqual(expected);
        });
    });

    describe('# pickAvailableName', function () {

        const allNames = ['maria', 'diana', 'micaela', 'adriana', 'ruth',
            'teresa', 'sara', 'madonna', 'britney', 'adele'];

        it('1.', () => {

            const names = ['micaela', 'adriana', 'ruth',
                'teresa', 'sara', 'britney', 'adele']

            const name = biz.pickAvailableName(['rita', 'maria', 'diana', 'madonna']);

            const actual = names.includes(name);

            expect(actual).toStrictEqual(true);
        });

        it('2.', () => {

            const actual = biz.pickAvailableName(['maria', 'diana', 'micaela', 'adriana',
                'ruth', 'teresa', 'sara', 'britney', 'adele']);

            const expected = 'madonna';

            expect(actual).toStrictEqual(expected);
        });

        it('3.', () => {

            const actual = biz.pickAvailableName(['diana', 'micaela', 'adriana',
                'ruth', 'teresa', 'sara', 'madonna', 'britney', 'adele']);

            const expected = 'maria';

            expect(actual).toStrictEqual(expected);
        });

        it('4.', () => {

            const actual = biz.pickAvailableName(['maria', 'diana', 'micaela', 'adriana',
                'ruth', 'teresa', 'sara', 'madonna', 'britney']);

            const expected = 'adele';

            expect(actual).toStrictEqual(expected);
        });

    });

    describe('# toggleStaddles', () => {

        it('1. all true', () => {

            expect(biz.toggleStaddles('5/10')).toStrictEqual('5/10[20]');
            expect(biz.toggleStaddles('5/10[20]')).toStrictEqual('5/10[20][40]');
            expect(biz.toggleStaddles('5/10[20][40]')).toStrictEqual('5/10[20][40][80]');
            expect(biz.toggleStaddles('5/10[20][40][80]')).toStrictEqual('5/10');
            expect(biz.toggleStaddles('5/10(1)')).toStrictEqual('5/10(1)[20]');
            expect(biz.toggleStaddles('5/10{10}')).toStrictEqual('5/10{10}[20]');
            expect(biz.toggleStaddles('5/10{10}[20][40][80]')).toStrictEqual('5/10{10}');
        });

    });

});