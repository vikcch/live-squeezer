<template>
	<div>

		<div class="divorced bm-m">

			<!-- ::SET NAMES AS:: -->
			<label class="">
				<span class="rm-s">Set Names as:</span>
				<i
					id="next-hand-info"
					class="fa fa-info-circle text-info"
					aria-hidden="true"
					@click="showInfo_Click"
				></i>
				<div :class="['names-options space-x-m', nameOptionsStyle ]">
					<span @click="setNamesAs_Click('positions')">Positions</span>
					<span @click="setNamesAs_Click('seats')">Seats</span>
				</div>
			</label>

			<!-- ::SITOUT:: -->
			<label
				v-show="sitouts.length"
				class="pointer underline"
			>
				<span @click="sitout()">Sitout ({{sitouts.length}})</span>
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
					<div
						:class="['divTableHead', setStackButtonStyle]"
						@click="setStacks_Click"
					>Stack</div>
					<div class="divTableHead focus-short-cut">Cards</div>
				</div>
			</div>

			<div class="divTableBody">

				<app-player-row
					:key="index"
					v-for="(input, index) in inputs"
					:intel="{ 
						input, index, isEditable, dealerSeat, actionSeat, 
						hasFolded: hasFolded(input.seat), 
						position: getPosition(input.seat) 
					}"
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
import validation from '../../units/validations';
import sitoutEase from '../../eases/sitout';
import { displayAmount } from '../../units/vikFunctions';

const autoFillerData = [
	{ seat: '1', name: 'vik', stack: '1000', holeCards: '__ __' },
	{ seat: '2', name: 'rita', stack: '750', holeCards: '__ __' },
	{ seat: '3', name: 'joana', stack: '1000', holeCards: '__ __' },
];

const addRow = function () {

	const { view } = this.$root.$data;
	const tableMax = view.mainInfoVue.$data.values.tableMax;

	this.inputs.push(Player.model(...this.generateRandomPlayerInfo(tableMax)));

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
};

const enable = function () {

	this.isEditable = true;
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
			isEditable: true,
			dealerSeat: 1,
			actionSeat: null,
			sitouts: [],
			folds: [],
		};
	},

	methods: {

		addRow,
		deleteRow,
		highlight,
		disable,
		enable,
		orderCardsDisplay,

		async setStacks_Click() {

			const { model } = this.$root.$data;
			if (model.actionStarted) return;

			const response = await this.$swal.fire({
				title: `Players' Stack`,
				html: `All players' stack will be set with the value:`,
				showCloseButton: true,
				showCancelButton: true,
				input: 'text',
			});

			if (!response.isConfirmed) return;

			const value = response.value.trim();

			const isStack = validation.business.player.isStack(value);
			const isInDecimalType = /^[0-9.]+$/g.test(value);

			if (!isStack || !isInDecimalType) {

				await this.$swal.fire({ title: 'Invalid Input', text: 'Please enter a valid number!' });
				this.setStacks_Click();
				return;
			}

			const stack = displayAmount(value);

			this.inputs.forEach(v => v.stack = stack);
		},

		// Set Names as Positions or Seats
		showInfo_Click(event) {

			const { view } = this.$root.$data;

			view.showSetNamesAsInfoPopup(event);
		},

		setNamesAs_Click(option) {

			const { model } = this.$root.$data;

			if (model.actionStarted) return;

			const hasDealer = this.inputs.some(v => v.seat == this.dealerSeat);

			const isSeat = option === 'seats';

			if (!isSeat && !hasDealer) return this.$swal.fire({

				title: `The button has not been set.`,
				text: 'Please set an available button/dealer seat from the combobox!'
			});

			const getValue = seat => isSeat ? `Seat_${seat}` : this.getPosition(seat);

			const positions = biz.getPositions().map(v => v.replace('+', 'UTG_'));
			const seats = [...new Array(10)].map((v, i) => `Seat_${i + 1}`);

			const replacebleNames = [...biz.getDefaultNames(), ...positions, ...seats];

			this.inputs.forEach(v => {

				if (!replacebleNames.includes(v.name)) return;

				v.name = getValue(v.seat).replace('+', 'UTG_');
			});
		},

		focusFirstPlayerInput() {

			if (this.$children.length === 0) return;

			const el = this.$children[0].$refs['hole-cards'];

			el.focus();
		},

		sitout() {

			const { view } = this.$root.$data;

			const startActionEnabled = view.startActionVue.state();

			if (startActionEnabled) sitoutEase.call(this);

			else view.showGenericError('', 'The action already started!');
		},

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

			// NOTE:: `-Infinity` em array vazio
			const maxStack = Math.max(...this.inputs.map(v => v.stack));
			const stack = maxStack > 0 ? maxStack : this.hundredBlinds;

			return [
				biz.nextAvailableSeat(seatsTaken, tableMax).toString(),
				biz.pickAvailableName(namesTaken),
				stack,
				'__ __'
			];
		},

		fillPlayersInfo(tableMaxExtended) {

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

		setActionSeat(seat) {

			this.actionSeat = seat;
		},

		setFolds(seats) {

			this.folds = seats;
		},

		hasFolded(seat) {

			return this.folds.includes(seat);
		},

		getPosition(seat) {

			return this.positions.find(v => v.seat === seat)?.position ?? '';
		},

		clearSitouts() {

			this.sitouts = [];
		}
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
		},

		isAddPlayerEnabled() {

			const { view } = this.$root.$data;
			const tableMax = view.mainInfoVue?.$data?.values?.tableMax;

			// NOTE:: `undefined` quando inicia a app
			if (!tableMax) return true;

			const limit = biz.playersLimitTableMax(tableMax);

			return this.inputs.length < limit && this.isEditable;
		},

		positions() {

			// NOTE:: `seat` é string ('1')
			const isButton = seat => ({ isButton: seat == this.dealerSeat });

			const players = this.inputs.map(({ seat }) => ({ seat, ...isButton(seat) }));

			if (!players.some(v => v.isButton)) return [];

			if (players.length < 2) return [];

			return biz.tablePositions(players);
		},

		nameOptionsStyle() {

			const { model } = this.$root.$data;

			return !model.actionStarted ? 'pointer underline' : 'light-color';
		},

		setStackButtonStyle() {

			const { model } = this.$root.$data;

			return !model.actionStarted ? 'pointer underline' : '';
		}

	},

	created() {

		window.EventVue.$on('updateDealerDisplay', value => {

			this.dealerSeat = Number(value);
		});
	},
};

</script>

<style>
.pointer {
	cursor: pointer;
}
.underline {
	text-decoration: underline;
}

.names-options {
	font-size: 12px;
	margin-top: -2px;
}
.names-options.light-color {
	color: Gainsboro;
}

.focus-short-cut::after {
	content: "F8";
	font-size: 10px;
	color: #cccccc;
	margin-left: 4px;
	vertical-align: 4px;
	font-weight: normal;
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

/* .divTableRow:nth-child(even) {
	background-color: #fafafb;
}

.divTableRow:hover {
	background-color: #f2f2f2;
} */
</style>



