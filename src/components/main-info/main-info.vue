<template>

	<fieldset>

		<app-mi-slot
			class="main-info-wrapper"
			:attributes_="attributes"
		>
			<template slot-scope="props">

				<app-mi-cell :props="props"></app-mi-cell>

			</template>

		</app-mi-slot>

	</fieldset>

</template>

<script>

/**
 * 	mi ==> main-info :)
 */

import MainInfoSlot from './main-info-slot.vue';
import MainInfoCell from './main-info-cell.vue';
import { head } from '../../units/absx.js';

const numberOption = (v, k) => ({ value: k + 1, text: k + 1 });
const oneToNineOptions = Array.from(Array(9), numberOption);

const attrs_ = [
	{
		// STOPSHIP:: SER COMO FUNCTION?? (date.now) ... tem falha a ordenar quando grava... ser TODO
		key: 'handId', label: 'Hand Id:', text: Date.now(),
		el: 'app-mi-input', maxlength: '20', inputmode: 'numeric'
	},

	{
		key: 'tableName', label: 'Table Name:', text: 'WinningPokerHud',
		el: 'app-mi-input', maxlength: '20'
	},

	{
		key: 'perspective', label: 'Perspective:', text: 'tv', info: true,
		el: 'app-mi-select', options: [
			{ value: 'tv', text: 'TV' },
			{ value: 'hero', text: 'Hero' }
		]
	},

	{
		key: 'handDate', label: 'Date:', text: '',
		el: "app-mi-input", type: 'date'
	},

	{
		key: 'stakes', label: 'Stakes:', text: '2/5', info: true,
		placeholder: '10/20(2)[40][60]', el: 'app-mi-input', status: true
	},

	{
		key: 'heroSeat', label: 'Hero Seat:', el: 'app-mi-select', text: '1',
		options: oneToNineOptions
	},

	/* 	{
			key: 'dealer', label: 'Button:', text: '1',
			el: 'app-mi-input', maxlength: '2', inputmode: 'numeric'
		}, */

	{
		key: 'dealer', label: 'Button:', el: 'app-mi-select', text: '1',
		options: oneToNineOptions
	},

	{
		key: 'tableMax', label: 'Table Max:', el: 'app-mi-select', text: '9-max',
		options: [
			{ value: '2-max', text: '2-max' },
			{ value: '6-max', text: '6-max' },
			{ value: '9-max', text: '9-max' },
			{ value: '10-max', text: '10-max' },
		]
	},

	{
		key: 'handTime', label: 'Time:', text: '00:00:00',
		el: 'app-mi-input', maxlength: '8', optional: true
	}

];

export default {

	components: {

		'app-mi-slot': MainInfoSlot,
		'app-mi-cell': MainInfoCell,
	},

	computed: {

		attributes() {

			return attrs_;
		},
	},

	methods: {

		highlight(key) {

			window.EventVue.$emit(`${key}MainInfoHighlight`, null);
		},

		updateDealer(value) {

			window.EventVue.$emit(`updateDealer`, value);
		},

		updateInput({ key, value }) {

			// NOTE:: Nem todos os inputs tém "EventVue.$on"
			window.EventVue.$emit(`${key}MainInfoText`, value);
		},

		getElementByKey(key) {

			const childrenHasKey = c => head(c.$children).attrs.key === key;

			return head(this.$children).$children.find(childrenHasKey);
		},

		resetCell(key) {

			const cellVue = this.getElementByKey(key);
			head(cellVue.$children).reset();
		},

		reset() {

			head(this.$children).$children.forEach(cellVue => {

				head(cellVue.$children).reset();
			});
		}
	},

	data() {

		return {
			values: {}
		};
	},

	created() {

		window.EventVue.$on('intelMainInfo', parcel => {

			const [key, value] = head(Object.entries(parcel));
			this.$data.values[key] = value;
		});
	}
}
</script>

<style scoped>
.main-info-wrapper {
	display: grid;
	grid-template-rows: 1fr 1fr 1fr;
	grid-template-columns: 2fr 2fr 2fr;
	grid-auto-flow: column;
	grid-gap: 8px;
}

fieldset {
	border: none;
}
</style>