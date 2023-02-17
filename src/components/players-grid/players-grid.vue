<template>
	<div>

		<div class="divorced bm-m">

			<!-- ::CHECKBOX RANDOM NAMES:: -->

			<label class="train pointer">
				<input
					class="pointer"
					type="checkbox"
					v-model="randomPlayerInfo"
				>
				<span class="lm-s">Random Info</span>
			</label>

			<!-- ::ADD PLAYER BUTTON:: -->

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

	</div>
</template>

<script>
import PlayerRow from './player-row.vue';
import state from '../../units/state.js';
import { tail } from '../../units/absx';
import biz from '../../units/biz';
import Player from '../../classes/player.js';

const autoFillerData = [
	{ seat: '1', name: 'vik', stack: '2000', holeCards: '__ __' },
	{ seat: '2', name: 'rita', stack: '1500', holeCards: '__ __' },
	{ seat: '3', name: 'joana', stack: '1000', holeCards: '__ __' },
];

const addRow = function () {

	const { view } = this.$root.$data;
	const tableMax = view.mainInfoVue.$data.values.tableMax;

	if (!this.randomPlayerInfo) this.inputs.push(Player.model());
	else this.inputs.push(Player.model(...this.generateRandomPlayerInfo(tableMax)));

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
			dealerSeat: 1,
			randomPlayerInfo: true
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
		},

		generateRandomPlayerInfo(tableMaxExtended) {

			const seatsTaken = this.inputs.map(v => Number(v.seat));
			const tableMax = biz.playersLimitTableMax(tableMaxExtended);
			const namesTaken = this.inputs.map(v => v.name);

			return [
				biz.nextAvailableSeat(seatsTaken, tableMax).toString(),
				biz.pickAvailableName(namesTaken),
				Math.max(...this.inputs.map(v => v.stack)) || this.hundredBlinds,
				'__ __'
			];
		},

		tryFillPlayersInfo(tableMaxExtended) {

			const trySetSeat = player => {

				if (player.seat?.toString().trim()) return;

				const seatsTaken = this.inputs.map(v => Number(v.seat));
				const tableMax = biz.playersLimitTableMax(tableMaxExtended);
				player.seat = biz.nextAvailableSeat(seatsTaken, tableMax).toString();
			};

			const trySetName = player => {

				if (player.name?.toString().trim() !== '') return;

				const namesTaken = this.inputs.map(v => v.name);
				player.name = biz.pickAvailableName(namesTaken);
			};

			const trySetStack = player => {

				if (player.stack?.toString().trim()) return;

				player.stack = Math.max(...this.inputs.map(v => v.stack)) || this.hundredBlinds;
			};

			this.inputs.forEach(player => {

				trySetSeat(player);
				trySetName(player);
				trySetStack(player);
			});
		},
	},

	computed: {

		addPlayerButtonState() {

			return `button--${this.isAddPlayerEnabled ? 'green' : 'disabled'}`;
		},

		hundredBlinds() {

			const { view } = this.$root.$data;
			const [, big] = view.mainInfoVue.$data.values.stakes.match(/\/(.*)/) ?? [];

			// NOTE:: '1000' para quando não há stacks ou big in `NaN`
			return big * 100 || 1000;
		}
	},

	watch: {

		randomPlayerInfo(value) {

			const { view } = this.$root.$data;
			const tableMax = view.mainInfoVue.$data.values.tableMax;

			if (value) this.tryFillPlayersInfo(tableMax);
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
.pointer {
	cursor: pointer;
}

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



