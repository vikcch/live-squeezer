import playersGridVue from '../../src/components/players-grid/players-grid.vue';

describe('players-grid.js', function () {

    describe('# tryFillPlayersInfo', function () {

        // NOTE:: Testa mutabilidade de `inputs`

        it('1. Should update inputs', () => {

            const inputs = [
                { seat: '1', name: 'vik', stack: '2000' },
                { seat: '', name: '', stack: '' },
            ];

            playersGridVue.methods.tryFillPlayersInfo.call({
                inputs,
                hundredBlinds: 435
            }, '9-max');

            const actual = inputs.map(({ name, ...rest }) => ({ ...rest }));

            const expected = [
                { seat: '1', stack: '2000' },
                { seat: '2', stack: 2000 }
            ];

            expect(actual).toStrictEqual(expected);
        });

        it('2. Should update inputs', () => {

            const inputs = [
                { seat: '', name: '', stack: '' },
            ];

            playersGridVue.methods.tryFillPlayersInfo.call({
                inputs,
                hundredBlinds: 435
            }, '9-max');

            const actual = inputs.map(({ name, ...rest }) => ({ ...rest }));

            const expected = [
                { seat: '1', stack: 435 },
            ];

            expect(actual).toStrictEqual(expected);
        });


    });

    describe('# generateRandomPlayerInfo', function () {

        it('1. Should gemerate player info', () => {

            const inputs = [
                { seat: '1', name: 'vik', stack: '2000', holeCards: '__ __' },
                { seat: '', name: '', stack: '', holeCards: '__ __' },
            ];

            // NOTE:: Retorna array com primitivos, index `1` é o name
            const actual = playersGridVue.methods.generateRandomPlayerInfo.call({
                inputs,
                hundredBlinds: 435
            }, '9-max').filter((v, index) => index !== 1);

            const expected = ['2', 2000, '__ __'];

            expect(actual).toStrictEqual(expected);
        });

        it('2. Should gemerate player info', () => {

            const inputs = [];

            // NOTE:: Retorna array com primitivos, index `1` é o name
            const actual = playersGridVue.methods.generateRandomPlayerInfo.call({
                inputs,
                hundredBlinds: 435
            }, '9-max').filter((v, index) => index !== 1);

            const expected = ['1', 435, '__ __'];

            expect(actual).toStrictEqual(expected);
        });
    });
});