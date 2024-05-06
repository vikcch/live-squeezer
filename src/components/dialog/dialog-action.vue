<template>
	<div v-show="isVisible">

		<app-dialog-header :collapsable="false">

			<div v-html="title"></div>

		</app-dialog-header>

		<app-dialog-body>

			<div class="train bm-l">

				<label class="train">
					<span class="rm-s">Action:</span>
					<input
						class="input--large"
						type="text"
						autocomplete="new-password"
						ref="player-action"
						v-model="text"
						@keyup="onKeyUp"
						@input="forced"
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
				<kbd>6</kbd><kbd>5</kbd><kbd>Enter</kbd>
				<span class="lm-s">Bet \ Raise to</span>
			</div>

		</app-dialog-body>
	</div>
</template>

<script>

import DialogHeader from './dialog-header.vue';
import DialogBody from './dialog-body.vue';
import vikFunctions from '../../units/vikFunctions';
import { head } from '../../units/absx';
import validation from "../../units/validations.js";


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

			// NOTE:: Evita multiplos 'ff' ou 'cc'
			if (this.text.toLocaleLowerCase() === 'f') this.text = 'folds';
			if (this.text.toLocaleLowerCase() === 'ff') this.text = 'folds';

			if (this.text.toLocaleLowerCase() === 'c') this.text = 'calls';
			if (this.text.toLocaleLowerCase() === 'cc') this.text = 'calls';
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

				Equal: () => this.text = this.text.replace('=', '000')
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


	updated() { },

	beforeUpdate() { },

	mounted() { }
}

</script>

<style scoped>
</style>
