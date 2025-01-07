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

    describe('# tablePositions', () => {

        it('1. heads-up', () => {

            const players = [
                { seat: 1, isButton: true },
                { seat: 2 },
            ];

            const actual = biz.tablePositions(players);

            const expected = [
                { seat: 1, position: 'BU', },
                { seat: 2, position: 'BB' },
            ];

            expect(actual).toStrictEqual(expected);
        });

        it('2. three way', () => {

            const players = [
                { seat: 1, isButton: true },
                { seat: 2 },
                { seat: 3 },
            ];

            const actual = biz.tablePositions(players);

            const expected = [
                { seat: 3, position: 'BB' },
                { seat: 2, position: 'SB' },
                { seat: 1, position: 'BU', },
            ];

            expect(actual).toStrictEqual(expected);
        });

        it('3. another three way', () => {

            const players = [
                { seat: 1, },
                { seat: 2, isButton: true },
                { seat: 3 },
            ];

            const actual = biz.tablePositions(players);

            const expected = [
                { seat: 1, position: 'BB', },
                { seat: 3, position: 'SB' },
                { seat: 2, position: 'BU' },
            ];

            expect(actual).toStrictEqual(expected);
        });

        it('4. four ways', () => {

            const players = [
                { seat: 1, },
                { seat: 2, isButton: true },
                { seat: 3 },
                { seat: 4 },
            ];

            const actual = biz.tablePositions(players);

            const expected = [
                { seat: 4, position: 'BB', },
                { seat: 3, position: 'SB' },
                { seat: 2, position: 'BU' },
                { seat: 1, position: 'UTG' },
            ];

            expect(actual).toStrictEqual(expected);
        });


        it('5. five ways', () => {

            const players = [
                { seat: 1, },
                { seat: 2, isButton: true },
                { seat: 3 },
                { seat: 4 },
                { seat: 5 },
            ];

            const actual = biz.tablePositions(players);

            const expected = [
                { seat: 4, position: 'BB', },
                { seat: 3, position: 'SB' },
                { seat: 2, position: 'BU' },
                { seat: 1, position: 'CO' },
                { seat: 5, position: 'UTG' },
            ];

            expect(actual).toStrictEqual(expected);
        });

        it('5. another five ways', () => {

            const players = [
                { seat: 1 },
                { seat: 2 },
                { seat: 3 },
                { seat: 4, isButton: true },
                { seat: 7 },
            ];

            const actual = biz.tablePositions(players);

            const expected = [
                { seat: 1, position: 'BB', },
                { seat: 7, position: 'SB' },
                { seat: 4, position: 'BU' },
                { seat: 3, position: 'CO' },
                { seat: 2, position: 'UTG' },
            ];

            expect(actual).toStrictEqual(expected);
        });

        it('6. six ways', () => {

            const players = [
                { seat: 1 },
                { seat: 2 },
                { seat: 3 },
                { seat: 4, isButton: true },
                { seat: 5 },
                { seat: 7 },
            ];

            const actual = biz.tablePositions(players);

            const expected = [
                { seat: 7, position: 'BB' },
                { seat: 5, position: 'SB' },
                { seat: 4, position: 'BU' },
                { seat: 3, position: 'CO' },
                { seat: 2, position: 'HJ' },
                { seat: 1, position: 'UTG', },
            ];

            expect(actual).toStrictEqual(expected);
        });

        it('7. seven ways', () => {

            const players = [
                { seat: 1 },
                { seat: 2 },
                { seat: 3 },
                { seat: 4, isButton: true },
                { seat: 5 },
                { seat: 6 },
                { seat: 7 },
            ];

            const actual = biz.tablePositions(players);

            const expected = [
                { seat: 6, position: 'BB' },
                { seat: 5, position: 'SB' },
                { seat: 4, position: 'BU' },
                { seat: 3, position: 'CO' },
                { seat: 2, position: 'HJ', },
                { seat: 1, position: 'LJ', },
                { seat: 7, position: 'UTG' },
            ];

            expect(actual).toStrictEqual(expected);
        });

        it('8. eight ways', () => {

            const players = [
                { seat: 1 },
                { seat: 2 },
                { seat: 3 },
                { seat: 4, isButton: true },
                { seat: 5 },
                { seat: 6 },
                { seat: 7 },
                { seat: 8 },
            ];

            const actual = biz.tablePositions(players);

            const expected = [
                { seat: 6, position: 'BB' },
                { seat: 5, position: 'SB' },
                { seat: 4, position: 'BU' },
                { seat: 3, position: 'CO' },
                { seat: 2, position: 'HJ', },
                { seat: 1, position: 'LJ', },
                { seat: 8, position: '+1' },
                { seat: 7, position: 'UTG' },
            ];

            expect(actual).toStrictEqual(expected);
        });

        it('9. nine ways', () => {

            const players = [
                { seat: 1 },
                { seat: 2 },
                { seat: 3 },
                { seat: 4, isButton: true },
                { seat: 5 },
                { seat: 6 },
                { seat: 7 },
                { seat: 8 },
                { seat: 9 },
            ];

            const actual = biz.tablePositions(players);

            const expected = [
                { seat: 6, position: 'BB' },
                { seat: 5, position: 'SB' },
                { seat: 4, position: 'BU' },
                { seat: 3, position: 'CO' },
                { seat: 2, position: 'HJ', },
                { seat: 1, position: 'LJ', },
                { seat: 9, position: '+2' },
                { seat: 8, position: '+1' },
                { seat: 7, position: 'UTG' },
            ];

            expect(actual).toStrictEqual(expected);
        });

        it('10. 10-max', () => {

            const players = [
                { seat: 1 },
                { seat: 2 },
                { seat: 3 },
                { seat: 4, isButton: true },
                { seat: 5 },
                { seat: 6 },
                { seat: 7 },
                { seat: 8 },
                { seat: 9 },
                { seat: 10 },
            ];

            const actual = biz.tablePositions(players);

            const expected = [
                { seat: 6, position: 'BB' },
                { seat: 5, position: 'SB' },
                { seat: 4, position: 'BU' },
                { seat: 3, position: 'CO' },
                { seat: 2, position: 'HJ', },
                { seat: 1, position: 'LJ', },
                { seat: 10, position: '+3', },
                { seat: 9, position: '+2' },
                { seat: 8, position: '+1' },
                { seat: 7, position: 'UTG' },
            ];

            expect(actual).toStrictEqual(expected);
        });

    });

});