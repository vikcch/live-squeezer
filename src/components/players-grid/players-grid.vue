<template>
	<div>

		<!-- ::GRID:: -->

		<div class="divTable minimalistBlack">
			<div class="divTableHeading">
				<div class="divTableRow">
					<div class="divTableHead"></div>
					<div class="divTableHead">Seat</div>
					<div class="divTableHead">Name</div>
					<div class="divTableHead">Stack</div>
					<div class="divTableHead">Cards</div>
				</div>
			</div>

			<div class="divTableBody">

				<app-player-row
					:key="index"
					v-for="(input, index) in inputs"
					:intel="{ input, index, isEditable, dealerSeat }"
				></app-player-row>

			</div>

		</div>

		<!-- ::ADD PLAYER BUTTON:: -->

		<div class="right tm-s">
			<button
				@click="addRow"
				ref="add-player-button"
				:class="['css-button', addPlayerButtonState]"
				:disabled="!isAddPlayerEnabled"
			>
				<span class="css-button-icon"><i
						class="fa fa-plus"
						aria-hidden="true"
					></i></span>
				<span class="css-button-text">Add Player</span>
			</button>
		</div>

	</div>
</template>

<script>
import PlayerRow from './player-row.vue';
import state from '../../units/state.js';
import { tail } from '../../units/absx';
import Player from '../../classes/player.js';

const autoFillerData = [
	{ seat: '1', name: 'vik', stack: '2000', holeCards: '__ __' },
	{ seat: '2', name: 'rita', stack: '1500', holeCards: '__ __' },
	{ seat: '3', name: 'joana', stack: '1000', holeCards: '__ __' },
	// { seat: '1', name: '', stack: '', holeCards: '__ __' },
	// { seat: '2', name: '', stack: '', holeCards: '__ __' },
	// { seat: '3', name: '', stack: '', holeCards: '__ __' },
];

const addRow = function () {

	const { view } = this.$root.$data;
	const tableMax = view.mainInfoVue.$data.values.tableMax;

	this.inputs.push(Player.model());

	view.addPlayerButtonState(tableMax);

	setTimeout(() => tail(this.$children).$refs['seat'].focus(), 0);
};

const deleteRow = function (index) {

	this.inputs.splice(index, 1);
};


const highlight = function (invalidPlayer) {

	const { index, field, duplicates } = invalidPlayer;

	if (duplicates) return;

	const lowerCaseName = field.toLowerCase();

	this.$children[index].$refs[lowerCaseName].focus();
};

const disable = function () {

	this.isEditable = false;
	this.isAddPlayerEnabled = false;
};

const enable = function () {

	this.isEditable = true;
	this.isAddPlayerEnabled = true;
}

const orderCardsDisplay = function () {

	this.$children.forEach(row => {

		const el = row.$refs['hole-cards'];

		state.printCards(el);

		el.dispatchEvent(new Event('focusout'));
	});
};


export default {
	components: {
		'app-player-row': PlayerRow
	},

	data() {
		return {
			inputs: autoFillerData,
			isAddPlayerEnabled: true,
			isEditable: true,
			dealerSeat: 1
		};
	},

	methods: {

		addRow,
		deleteRow,
		highlight,
		disable,
		enable,
		orderCardsDisplay,

		getAllHoleCardsEl() {

			return this.$children.map(c => c.$refs['hole-cards']);
		},

		removeHoleCards() {

			this.inputs.forEach(input => input.holeCards = '__ __');
		},

		removeImageCards() {

			const wcs = document.querySelectorAll('.wrapper-cards');
			wcs.forEach(wc => state.removeChildElements(wc));
		}
	},

	computed: {

		addPlayerButtonState() {

			return `button--${this.isAddPlayerEnabled ? 'green' : 'disabled'}`;
		}
	},

	created() {

		window.EventVue.$on('updateDealerDisplay', value => {

			this.dealerSeat = value;
		});
	},
};

</script>

<style>
div.minimalistBlack {
	border: 1px solid #d6d9dc;
	width: 100%;
	text-align: left;
	border-collapse: collapse;
}
.divTable.minimalistBlack .divTableCell,
.divTable.minimalistBlack .divTableHead {
	border: 1px solid #d6d9dc;
	padding: 5px 4px;
}

.divTable.minimalistBlack .divTableHeading .divTableHead {
	/* font-size: 15px; */
	font-weight: bold;
	/* color: #6a737c; */
	text-align: center;
	background: #fafafb;
	border-bottom: 1px solid #d6d9dc;
}

/* DivTable.com */
.divTable {
	display: table;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 4px rgba(0, 0, 0, 0.05),
		0 2px 8px rgba(0, 0, 0, 0.05);
}
.divTableRow {
	display: table-row;
}
.divTableHeading {
	display: table-header-group;
}
.divTableCell,
.divTableHead {
	display: table-cell;
}
.divTableBody {
	display: table-row-group;
}

.divTableRow:nth-child(even) {
	background-color: #fafafb;
}

.divTableRow:hover {
	background-color: #f2f2f2;
}
</style>



