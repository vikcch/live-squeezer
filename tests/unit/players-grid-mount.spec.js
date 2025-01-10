import { shallowMount } from "@vue/test-utils";
import playersGridVue from '../../src/components/players-grid/players-grid.vue';
import Swal from 'sweetalert2';
import fns from '../../src/units/vikFunctions';
import Vue from 'vue';

// NOTE:: Precisa de configurar a prop `transformIgnorePatterns` em jest.config.js
// Para poder usar `Vue.swal.fire()`
import VueSweetalert2 from 'vue-sweetalert2';
Vue.use(VueSweetalert2);

window.EventVue = new Vue;

// ! Computed properties usadas no template quando precisam de "view" ou "model" 
// ! (this.$root.$data - settado em view.js) são `undefined`, podia usar "...$data.?view",
// ! a alternativa é usar o segundo paramentro do "shallowMount" e settar as computed.

describe('playersGridVue.vue - mount', function () {

    describe('# swal input stack - setStacks_Click', () => {

        it('1. Correct values', async () => {

            const swalMock = jest.spyOn(Swal, 'fire').mockResolvedValue({
                isConfirmed: true, value: '5000'
            });

            const wrapper = shallowMount(playersGridVue, {
                computed: {
                    nameOptionsStyle: () => { },
                    isAddPlayerEnabled: () => { },
                    setStackButtonStyle: () => { },
                }
            });

            wrapper.setData({
                inputs: [
                    { seat: '6', name: 'maria', stack: 1100, holeCards: '__ __' },
                    { seat: '3', name: 'joana', stack: 2000, holeCards: '__ __' }
                ]
            });

            // NOTE:: `setStacks_Click()` usa "actionStarted"
            wrapper.vm.$root = fns.makeComplexObject(['$data', 'model', 'actionStarted'], false);

            await wrapper.vm.setStacks_Click();

            const actual = wrapper.vm.$data.inputs;

            const expected = [
                { seat: '6', name: 'maria', stack: 5000, holeCards: '__ __' },
                { seat: '3', name: 'joana', stack: 5000, holeCards: '__ __' }
            ];

            expect(actual).toStrictEqual(expected);

            // Restaura o método original após o teste
            swalMock.mockRestore();
        });

        
        it('2. Invalid Input', async () => {

            const swalMock = jest.spyOn(Swal, 'fire').mockResolvedValue({
                isConfirmed: true, value: 'x5000'
            });

            const swalMockInvalid = jest.spyOn(Swal, 'fire');

            const wrapper = shallowMount(playersGridVue, {
                computed: {
                    nameOptionsStyle: () => { },
                    isAddPlayerEnabled: () => { },
                    setStackButtonStyle: () => { },
                }
            });

            wrapper.setData({
                inputs: [
                    { seat: '6', name: 'maria', stack: 1100, holeCards: '__ __' },
                    { seat: '3', name: 'joana', stack: 2000, holeCards: '__ __' }
                ]
            });

            // NOTE:: `setStacks_Click()` usa "actionStarted"
            wrapper.vm.$root = fns.makeComplexObject(['$data', 'model', 'actionStarted'], false);

            await wrapper.vm.setStacks_Click();


            const expected = expect.objectContaining({ title: 'Invalid Input' });

            expect(swalMockInvalid).toHaveBeenCalledWith(expected);

            // Testes extras. Confirma que não alterou

            const actual_extra = wrapper.vm.$data.inputs;

            const expected_extra = [
                { seat: '6', name: 'maria', stack: 1100, holeCards: '__ __' },
                { seat: '3', name: 'joana', stack: 2000, holeCards: '__ __' }
            ];

            expect(actual_extra).toStrictEqual(expected_extra);

            // Restaura o método original após o teste
            swalMock.mockRestore();
        });


        it('3. Action alerady Started - sem swalMock', async () => {

            const wrapper = shallowMount(playersGridVue, {
                computed: {
                    nameOptionsStyle: () => { },
                    isAddPlayerEnabled: () => { },
                    setStackButtonStyle: () => { },
                }
            });

            wrapper.setData({
                inputs: [
                    { seat: '6', name: 'maria', stack: 1100, holeCards: '__ __' },
                    { seat: '3', name: 'joana', stack: 2000, holeCards: '__ __' }
                ]
            });

            // NOTE:: `setStacks_Click()` usa "actionStarted"
            wrapper.vm.$root = fns.makeComplexObject(
                ['$data', 'model', 'actionStarted'], true
            );

            await wrapper.vm.setStacks_Click();


            // Testes extras. Confirma que não alterou

            const actual_extra = wrapper.vm.$data.inputs;

            const expected_extra = [
                { seat: '6', name: 'maria', stack: 1100, holeCards: '__ __' },
                { seat: '3', name: 'joana', stack: 2000, holeCards: '__ __' }
            ];

            expect(actual_extra).toStrictEqual(expected_extra);
        });

    });

});

