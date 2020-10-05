<template>

	<div class="divTableRow">

		<div class="divTableCell">

			<div class="inner">
				<button
					:class="['button-icon remove-player', removePlayerButtonState]"
					:disabled="!intel.isEditable"
					title="Remove Player"
					@click="deleteRow()"
					ref="remove-player"
					name="remove-player"
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
					maxlength="2"
					inputmode="numeric"
					ref="seat"
					class="text-right small-input"
				/>

				<div :class="['bullseye', isDealer]"></div>

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
					ref="name"
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
					inputmode="numeric"
					ref="stack"
					class="text-right min-w-64"
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
					/>

				</div>

				<button
					class="button-icon button-icon--green open-cards-popup"
					title="Pick Cards"
					@click="onCardsPopupClick"
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

export default {
	props: ["intel"],

	data() {

		return {

			text: '',
		};
	},

	methods: {

		deleteRow() {

			const { inputs } = this.$parent.$data;
			this.$delete(inputs, this.intel.index);

			const { view } = this.$root.$data;
			const tableMax = view.mainInfoVue.$data.values.tableMax;

			view.addPlayerButtonState(tableMax);
		},

		forced(event) {

			const rules = {

				seat: () => validation.force.onlyNumbers(field.value),
				stack: () => validation.force.onlyNumbers(field.value),
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

		onHoldCardsInput() {

			const { view, model } = this.$root.$data;

			const { seat, holeCards } = this.intel.input;

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
</style>