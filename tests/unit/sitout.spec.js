import Vue from 'vue';
import sitout from '../../src/eases/sitout';
import fns from '../../src/units/vikFunctions';
import Swal from 'sweetalert2';

// NOTE:: Precisa de configurar a prop `transformIgnorePatterns` em jest.config.js
// Para poder usar `Vue.swal.fire()`
import VueSweetalert2 from 'vue-sweetalert2';
Vue.use(VueSweetalert2);


describe('sitout.js', () => {

    it('1. Table full', () => {

        const swalMock = jest.spyOn(Swal, 'fire').mockResolvedValue({});

        const $root = fns.makeComplexObject([
            '$data', 'view', 'mainInfoVue', '$data', 'values', 'tableMax'
        ], '2-max');

        const component = {
            $root,
            inputs: new Array(5),
            $swal: Swal
        };

        sitout.call(component);

        const expected = expect.objectContaining({ title: 'Table is full' });

        expect(swalMock).toHaveBeenCalledWith(expected);

        // Restaura o método original após o teste
        swalMock.mockRestore();
    });


    it('2. Apenas um player em sitout', () => {

        const $root = fns.makeComplexObject([
            '$data', 'view', 'mainInfoVue', '$data', 'values', 'tableMax'
        ], '9-max');

        const sitouts = [{ seat: 4, name: 'rita', stack: 1000, holeCards: '__ __' }];

        const component = {
            $root,
            $data: { sitouts },
            inputs: new Array(5),
            $swal: Swal
        };

        const { ...inserted } = { ...sitouts[0] };

        sitout.call(component);

        const actual = component.$data.sitouts;
        const expected = [];

        expect(actual).toStrictEqual(expected);

        const [actual_] = component.inputs.slice(-1);
        const expected_ = inserted;

        expect(actual_).toStrictEqual(expected_);

    });

    it('3. Mais de um player em sitout, prompta pelo seat', async () => {

        const swalMock = jest.spyOn(Swal, 'fire').mockResolvedValue({ value: '6' });

        const $root = fns.makeComplexObject([
            '$data', 'view', 'mainInfoVue', '$data', 'values', 'tableMax'
        ], '9-max');

        const sitouts = [
            { seat: 4, name: 'rita', stack: 1000, holeCards: '__ __' },
            { seat: 6, name: 'joana', stack: 1200, holeCards: '__ __' }
        ];

        const component = {
            $root,
            $data: { sitouts },
            inputs: new Array(5),
            $swal: Swal
        };

        const { ...inserted } = { ...sitouts[1] };

        await sitout.call(component);

        const actual = component.$data.sitouts;

        const { ...stillSitout } = { ...sitouts[0] };
        const expected = [stillSitout];

        expect(actual).toStrictEqual(expected);

        const [actual_] = component.inputs.slice(-1);
        const expected_ = inserted;

        expect(actual_).toStrictEqual(expected_);

        // Restaura o método original após o teste
        swalMock.mockRestore();
    });

    it('4. Seat errado na primeira prompt, correcto na segunda', async () => {

        const swalMock = jest.spyOn(Swal, 'fire')
            .mockResolvedValueOnce({ value: 5 })
            .mockResolvedValueOnce({ value: '6' });

        const $root = fns.makeComplexObject([
            '$data', 'view', 'mainInfoVue', '$data', 'values', 'tableMax'
        ], '9-max');

        const sitouts = [
            { seat: 4, name: 'rita', stack: 1000, holeCards: '__ __' },
            { seat: '6', name: 'joana', stack: 1200, holeCards: '__ __' }
        ];

        const component = {
            $root,
            $data: { sitouts },
            inputs: new Array(5),
            $swal: Swal
        };

        const { ...inserted } = { ...sitouts[1] };

        await sitout.call(component);

        const actual = component.$data.sitouts;

        const { ...stillSitout } = { ...sitouts[0] };
        const expected = [stillSitout];

        expect(actual).toStrictEqual(expected);

        const [actual_] = component.inputs.slice(-1);
        const expected_ = inserted;

        expect(actual_).toStrictEqual(expected_);

        // Restaura o método original após o teste
        swalMock.mockRestore();
    });

    it('5. Seat duplicado - senta player e avisa user', async () => {

        const swalMock = jest.spyOn(Swal, 'fire')
            .mockResolvedValueOnce({ value: '5' })
            .mockResolvedValueOnce({ value: '6' });

        const swalMock_1 = jest.spyOn(Swal, 'fire').mockResolvedValue({});

        const $root = fns.makeComplexObject([
            '$data', 'view', 'mainInfoVue', '$data', 'values', 'tableMax'
        ], '9-max');

        const sitouts = [
            { seat: '4', name: 'rita', stack: 1000, holeCards: '__ __' },
            { seat: '6', name: 'joana', stack: 1200, holeCards: '__ __' }
        ];

        const component = {
            $root,
            $data: { sitouts },
            inputs: [{ seat: '6', name: 'maria', stack: 1100, holeCards: '__ __' }],
            $swal: Swal
        };

        const { ...inserted } = { ...sitouts[1] };

        await sitout.call(component);

        const actual = component.$data.sitouts;

        const { ...stillSitout } = { ...sitouts[0] };
        const expected = [stillSitout];

        expect(actual).toStrictEqual(expected);

        const [actual_] = component.inputs.slice(-1);
        const expected_ = inserted;

        expect(actual_).toStrictEqual(expected_);

        const expected_1 = expect.objectContaining({ title: 'Duplicate Seats!' });

        expect(swalMock_1).toHaveBeenCalledWith(expected_1);

        // Restaura o método original após o teste
        swalMock.mockRestore();

        swalMock_1.mockRestore();
    });


});