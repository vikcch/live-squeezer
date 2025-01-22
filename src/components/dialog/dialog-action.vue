<template>
	<div v-show="isVisible">

		<app-dialog-header :collapsable="false">

			<div v-html="title"></div>

		</app-dialog-header>

		<app-dialog-body>

			<div class="small-text gray bm-l"> Hand Ranking: <i>{{ranking}}</i> </div>

			<div class="train bm-l">

				<label class="train">
					<span class="rm-s">Action:</span>
					<input
						type="text"
						autocomplete="new-password"
						ref="player-action"
						maxlength="12"
						v-model="text"
						@keyup="onKeyUp"
						@input="forced"
						@keydown="onKeyDown"
					>
				</label>

				<button
					id="player-action-submit"
					class="button-icon button-icon--green button-icon-solo"
					@click="onClick"
				>
					<i class="fa fa-check"></i>
				</button>

				<i
					id="file-upload-info"
					class="fa fa-info-circle text-info lm-m"
					aria-hidden="true"
					@click="actionInfoClick"
				></i>

				<span class="flex-1 text-right gray small-text">
					<i> {{amountToCall}} </i>
				</span>
			</div>

			<div class="train divorced bm-l">
				<div
					class="clicable-tag train"
					@click="onFoldClick"
				><kbd class="clicable rm-s">←</kbd><span>Fold</span></div>
				<div
					class="clicable-tag train"
					@click="onCallClick"
				><kbd class="clicable rm-s">→</kbd><span>Check \ Call</span></div>
				<div
					class="clicable-tag train"
					@click="onUndoClick"
				><kbd class="clicable rm-s">↑</kbd><span>Undo</span></div>
			</div>

			<div class="train bm-s">
				<kbd>6</kbd><kbd>5</kbd><kbd class="lm-s">Enter</kbd>
				<span class="lm-s">Bet \ Raise to</span>
			</div>

		</app-dialog-body>
	</div>
</template>

<script>

import DialogHeader from './dialog-header.vue';
import DialogBody from './dialog-body.vue';
import vikFunctions, { displayAmount } from '../../units/vikFunctions';
import { head } from '../../units/absx';
import validation from "../../units/validations.js";
import mkRanking from '../../units/ranking.js';
import Player from '../../classes/player.js';
import Street from '../../eases/street.js';
import SettingsStore from '@/store/simple/settings';


export default {

	components: {

		'app-dialog-header': DialogHeader,
		'app-dialog-body': DialogBody
	},

	data() {

		return {

			title: '',
			isVisible: false,
			text: ''
		};
	},

	methods: {

		onClick(event) {

			const { controller } = this.$root.$data;

			const submit = controller.handlePlayerActionSubmit(event);
			submit(this.text);
		},

		forced(event) {

			this.text = validation.force.onlyActionChars(this.text);
		},

		onKeyDown(event) {

			// https://www.toptal.com/developers/keycode

			const { code } = event;

			if (code === 'KeyC' || code === 'KeyF') {

				const { model } = this.$root.$data;
				const lastHistory = model.histories.at(-1);
				const wordC = lastHistory.currentBet ? 'calls' : 'checks';

				if (code === 'KeyF') this.text = 'folds';
				if (code === 'KeyC') this.text = wordC;

				event.preventDefault();
				event.stopPropagation();

				return;
			}


			// NOTE:: Subtituidas antes de "@input='forced'", "force validation" ignorado

			if (!SettingsStore.getters.sideKeyCards) return;

			const work = {

				KeyO: () => this.text += '9',
				KeyI: () => this.text += '8',
				KeyU: () => this.text += '7',
				KeyL: () => this.text += '6',
				KeyK: () => this.text += '5',
				KeyJ: () => this.text += '4',
				Period: () => this.text += '3',
				Comma: () => this.text += '2',
				KeyM: () => this.text += '1',
				Space: () => this.text += '0',

				KeyP: () => this.text += '.',
				KeyN: () => this.text += '000',
			};

			code in work && work[code].call();

			if (code in work) {

				event.preventDefault();
				event.stopPropagation();
			}
		},

		onKeyUp(event) {

			// https://www.toptal.com/developers/keycode

			const { code } = event;

			const work = {

				Backspace: () => this.text = this.text.replace(/calls|folds/, ''),

				ArrowUp: () => controller.undo(),

				ArrowLeft: () => submit('folds'),

				ArrowRight: () => submit('calls'),

				Enter: () => submit(this.text),

				NumpadEnter: () => submit(this.text),

				// « ou =
				Equal: () => this.text = this.text.replace(/«|=/, '000')
			};

			const { controller } = this.$root.$data;
			const submit = controller.handlePlayerActionSubmit(event);

			code in work && work[code].call();
		},

		onFoldClick(event) {

			const { controller } = this.$root.$data;

			const submit = controller.handlePlayerActionSubmit(event);
			submit('folds');
		},

		onCallClick(event) {

			const { controller } = this.$root.$data;

			const submit = controller.handlePlayerActionSubmit(event);
			submit('calls');
		},

		onUndoClick() {

			const { controller } = this.$root.$data;
			controller.undo();
		},

		wrapUp() {

			if (vikFunctions.isMobileOrTablet()) {

				//this.$el.scrollIntoView();
				const app = head(this.$root.$children);

				//app.$refs['switcher'].$el.scrollIntoView({ behavior: 'smooth' });				
				app.$refs['switcher'].$el.scrollIntoView();
				setTimeout(() => window.scrollBy(0, 0), 0);
			}

			setTimeout(() => {

				this.text = '';
				this.$refs['player-action'].focus();
			}, 0);
		},

		actionInfoClick() {

			const { view } = this.$root.$data;
			view.showActionInfoPopup();
		}
	},

	computed: {

		ranking() {

			const { model } = this.$root.$data;

			const emptyRanking = 'Not Available';

			if (!model.actionStarted) return emptyRanking;

			const { holeCards } = model.getPlayerToAct();

			const arrHolecards = Player.mkHoleCards(holeCards);

			if (!arrHolecards.length) return emptyRanking;

			const arrStreetCards = Street.mkStreetCards(model.histories);

			const ranking = mkRanking([...arrHolecards, ...arrStreetCards]);

			// return 'a straight flush, Ace to Five';
			return ranking?.text ?? emptyRanking;
		},

		amountToCall() {

			const { model } = this.$root.$data;

			const lastHistory = model.histories.at(-1);

			if (!lastHistory.currentBet) return '';

			const player = model.getPlayerToAct();

			const toCall = lastHistory.currentBet - player?.moneyOnStreet;

			if (!toCall) return '';

			return `${displayAmount(toCall)} To Call`;
		}
	},

	updated() { },

	beforeUpdate() { },

	mounted() { }
}

</script>

<style scoped>
input {
	width: 128px !important;
}

.gray {
	color: darkgray;
}

.flex-1 {
	flex: 1;
}

.text-right {
	text-align: right;
}
</style>
