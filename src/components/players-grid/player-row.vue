<template>

	<div :class="['divTableRow', { action: hasAction, playing: isPlaying }]">

		<div class="divTableCell">

			<div class="inner">
				<button
					:class="['button-icon remove-player', removePlayerButtonState]"
					:disabled="!intel.isEditable"
					title="Remove Player"
					@click="deleteRow()"
					ref="remove-player"
					name="remove-player"
					tabindex="-1"
				>
					<i class="fa fa-times"></i>
				</button>
			</div>
		</div>

		<div class="divTableCell">

			<div class="train">

				<input
					type="text"
					v-model="intel.input.seat"
					:disabled="!intel.isEditable"
					name="seat"
					@input="forced"
					@focus="$event.target.select()"
					maxlength="1"
					inputmode="numeric"
					ref="seat"
					class="text-right small-input"
					tabindex="-1"
					aria-label="seat"
				/>

				<div :class="['position flex-1', isDealer]">{{position}}</div>

			</div>

		</div>

		<div class="divTableCell">

			<div class="bullseye">

				<input
					type="text"
					v-model="intel.input.name"
					:disabled="!intel.isEditable"
					name="name"
					@input="forced"
					@focus="$event.target.select()"
					maxlength="16"
					ref="name"
					tabindex="-1"
					aria-label="name"
				/>
			</div>
		</div>

		<div class="divTableCell">

			<div class="bullseye">

				<input
					type="text"
					v-model="intel.input.stack"
					:disabled="!intel.isEditable"
					name="stack"
					@input="forced"
					@focus="$event.target.select()"
					maxlength="12"
					inputmode="numeric"
					ref="stack"
					class="text-right min-w-64"
					tabindex="-1"
					aria-label="stack"
				/>
			</div>
		</div>

		<div class="divTableCell">
			<div class="bullseye">
				<div @click="onHoldCardsClick">
					<div class="wrapper-cards"></div>
					<input
						type="text"
						class="input--hole-cards cards-abbr"
						ref="hole-cards"
						v-model="intel.input.holeCards"
						maxlength="5"
						name="hole-cards"
						@input="onHoldCardsInput"
						aria-label="hole-cards"
					/>

				</div>

				<button
					class="button-icon button-icon--green open-cards-popup"
					title="Pick Cards"
					@click="onCardsPopupClick"
					tabindex="-1"
				>
					<i class="fa fa-solo fa-th"></i>
				</button>

			</div>
		</div>

	</div>
</template>

<script>

import validation from '../../units/validations.js';
import cardsInput from '../../eases/cards-input.js';
import biz from '../../units/biz.js';
import vikFunctions from '../../units/vikFunctions';
import History from '@/classes/history';
import state from '../../units/state.js';

export default {
	props: ["intel"],

	data() {

		return {

			text: ''
		};
	},

	methods: {

		async deleteRow() {

			const result = await this.$swal.fire({
				title: 'Sitout or Leave table?',
				showCancelButton: true,
				cancelButtonColor: '#3085d6',
				cancelButtonText: 'Sitout',
				confirmButtonText: 'Leave table',
				confirmButtonColor: '#d33',
				reverseButtons: true, // sitout aka "cancel" como butao da esquerda
			});

			const isLeave = result.isConfirmed && !result.isDismissed && result.value;
			const isSitout = result.dismiss === 'cancel';

			if (!isLeave && !isSitout) return;

			// NOTE:: o `seat` em "input[x]" pode ser string ou number:
			// - String quando inserido/primeira hand e Number em "next hand"
			// O mesmo para `stack`, só o `seat` faz comparações (sitout).
			const { inputs, sitouts } = this.$parent.$data;

			if (isSitout) {

				const player = inputs[this.intel.index];

				if (sitouts.some(v => Number(v.seat) === Number(player.seat))) {

					return this.$swal.fire({
						title: `Seat ${player.seat} is already sitout`,
						text: 'Please remove the sitout player first!'
					});
				}

				sitouts.push(player);
			}

			this.$delete(inputs, this.intel.index);

			this.$parent.removeImageCards();
		},

		forced(event) {

			const rules = {

				seat: () => validation.force.onlyNumbers(field.value),
				stack: () => validation.force.onlyNumbersAndDot(field.value),
				name: () => validation.force.onlyAlphaNumeric(field.value),
			};

			const field = event.target;
			this.intel.input[field.name] = rules[field.name].call();
		},

		onCardsPopupClick(event) {

			const { controller, view } = this.$root.$data;

			const { seat } = this.intel.input;

			const popup = controller.handleCardsPopup(event);

			const tableMax = view.mainInfoVue.values.tableMax;

			const limit = biz.playersLimitTableMax(tableMax);

			popup(this.$refs['hole-cards'], seat, limit);
		},

		invalidHoleCards() {

			const { view, model } = this.$root.$data;

			const { seat, holeCards } = this.intel.input;

			// NOTE:: Não tem "histories" antes de "actionStarted" 
			// (só depois de pelo menos a primeira action for gravada)

			const fakeHistories = model.histories.map(v => {

				const hasPlayers = !!v.players;

				const players = hasPlayers
					? v.players.filter(v => v.seat !== seat)
					: view.playersGridVue.inputs.filter(v => v.seat !== seat);

				const streetCards = hasPlayers
					? v.streetCards
					: null;

				return { players, streetCards };
			});

			return History.isInputCardsTaken(holeCards, fakeHistories);
		},

		onHoldCardsInput(e) {

			const { view, model } = this.$root.$data;

			const { seat, holeCards } = this.intel.input;

			if (!holeCards.includes('_') && this.invalidHoleCards()) {

				this.intel.input.holeCards = '__ __';
				// NOTE:: com o v-model (acima) não remove as cartas
				this.$refs['hole-cards'].value = '__ __';

				return view.showGenericError('', 'Do not repeat cards');
			}

			if (model.actionStarted) {

				const success = model.trySetHoleCards(holeCards, seat);

				view.printHoleCards(model.hero, model.vilansAlong, model.mainInfo);

				const { hasSummary, conclusion, mainInfo } = model;

				if (success && hasSummary) {

					view.tryEnableLocalStorageSaveButton();
				}

				const isHeroPerspective = mainInfo.perspective === 'hero';

				if (success && hasSummary && isHeroPerspective) {

					view.printCollects(conclusion, mainInfo);
				}
			}
		},

		onHoldCardsClick(event) {

			if (vikFunctions.isMobileOrTablet()) {

				this.onCardsPopupClick(event);
			}
		}
	},

	computed: {

		removePlayerButtonState() {

			const { isEditable } = this.intel;

			return `button-icon--${isEditable ? 'red' : 'disabled'}`;
		},

		isDealer() {

			const { dealerSeat } = this.intel;

			const { seat } = this.intel.input;

			return dealerSeat == seat ? 'dealer' : '';
		},

		showFocusShortcut() {

			return this.intel.index === 0;
		},

		hasAction() {

			const { seat } = this.intel.input;

			// NOTE:: Adicionar player sem "Random info" causava "ter action" (seat:null)
			return seat && this.intel.actionSeat === seat;
		},

		isPlaying() {

			const { model } = this.$root.$data;

			const actionStarted = !this.intel.isEditable;

			const actionTime = actionStarted && !model.hasSummary;

			return !this.intel.hasFolded && actionTime;
		},

		position() {

			if (this.isDealer) return null;

			return this.intel.position.replace('UTG', 'UG');
		}
	},

	watch: {

		'intel.input.seat'(current, previous) {

			if (!Number(current)) return;

			this.$parent.inputs.sort((a, b) => a.seat - b.seat);

			this.$parent.focusSeatInput(current);
		}
	},

	mounted() {

		const attributes = {

			autocomplete: 'off',
			spellcheck: 'false',
			autocorrect: 'off',
			autocapitalize: 'off'
		};

		const inputs = this.$el.querySelectorAll('input');
		inputs.forEach(input => {

			Object.entries(attributes).forEach(attr => {

				const [k, v] = attr;
				input.setAttribute(k, v);
			});
		});

		if (vikFunctions.isMobileOrTablet()) {

			this.$refs['hole-cards'].setAttribute('disabled', 'true');
		}

		cardsInput.createEvents(this.$refs['hole-cards']);
	},

	beforeDestroy() {

		cardsInput.removeEvents(this.$refs['hole-cards']);
	}
};
</script>

<style scoped>
input {
	padding: 0px 2px;
}

.button-icon {
	padding: 8px 11px;
}

.divTableCell:first-child {
	width: 36px;
}

.dealer:after {
	font-family: "Times New Roman", Times, serif;
	font-size: 11px;
	border-radius: 50%;
	padding: 2px 4px;
	content: "D";
	margin-left: 3px;
	background: #cccccc;
	border-radius: 50%;
	color: #ffffff;
	display: inline-block;
	font-weight: bold;
}

.position {
	font-family: "Share Tech Mono", serif;
	font-weight: 400;
	font-style: normal;

	color: DarkGray;
	font-size: 11px;
	text-align: center;
}

.flex-1 {
	flex: 1;
}

.small-input {
	width: 32px;
	/* max-width: 42px; */
}

.input--hole-cards {
	width: 52px;
}

.text-right {
	text-align: right;
}

.min-w-64 {
	min-width: 56px;
}

.divTableRow.playing {
	background-color: #e0e9e0;
}

/* .divTableRow.folded {
	background-color: #f2f2f2;
}
 */
.divTableRow.action {
	/* background-color: #f9e5e5 !important; */
	/* background: linear-gradient(
		0deg,
		rgba(249, 229, 229, 1) 0%,
		rgba(244, 204, 204, 1) 50%,
		rgba(249, 229, 229, 1) 100%
	); */
	box-shadow: inset 0 0 4px red;
}
</style>