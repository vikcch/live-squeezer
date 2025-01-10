import playersGridVue from '../../src/components/players-grid/players-grid.vue';
import Swal from 'sweetalert2';
import Vue from 'vue';
import fns from '../../src/units/vikFunctions';

// NOTE:: Precisa de configurar a prop `transformIgnorePatterns` em jest.config.js
// Para poder usar `Vue.swal.fire()`
import VueSweetalert2 from 'vue-sweetalert2';
Vue.use(VueSweetalert2);



describe('players-grid.js', function () {

    describe('# tryFillPlayersInfo', function () {

        // NOTE:: Testa mutabilidade de `inputs`

        it('1. Should update inputs', () => {

            const inputs = [
                { seat: '1', name: 'vik', stack: '2000' },
                { seat: '', name: '', stack: '' },
            ];

            playersGridVue.methods.fillPlayersInfo.call({
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

            playersGridVue.methods.fillPlayersInfo.call({
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

    describe('# swal input stack - setStacks_Click', () => {

        // NOTE:: Componente não simulado... metodo `setStacks_Click()` desce um nivel
        // Para usar "$data.inputs" aqui, tinha tambem de usar no componente Vue

        it('1. valor correcto - component só de um nivel', async () => {

            const swalMock = jest.spyOn(Swal, 'fire').mockResolvedValue({
                isConfirmed: true, value: '10000'
            });

            const component = {
                inputs: [{ seat: '6', name: 'maria', stack: 1100, holeCards: '__ __' }],
                $swal: Swal,
                setStacks_Click: playersGridVue.methods.setStacks_Click,
                $root: fns.makeComplexObject(['$data', 'model', 'actionStarted'], false)
            };

            await component.setStacks_Click();

            const actual = component.inputs;

            const expected = [{ seat: '6', name: 'maria', stack: 10000, holeCards: '__ __' }]

            expect(actual).toStrictEqual(expected);

            // Restaura o método original após o teste
            swalMock.mockRestore();
        });

    });

});