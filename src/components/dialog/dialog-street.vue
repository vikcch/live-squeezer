<template>
	<div v-show="isVisible">
		<app-dialog-header :collapsable="false">{{title}}</app-dialog-header>
		<app-dialog-body>

			<div class="train bm-l">

				<label class="train">

					<span class="rm-s">Card(s):</span>

					<div
						style="position: relative;"
						@click="onStreetCardsClick"
					>
						<div
							ref="wrapper-cards"
							class="wrapper-cards"
						></div>
						<input
							class="input--large cards-abbr"
							type="text"
							autocomplete="new-password"
							ref="street-cards"
							:maxlength="maxlenght"
							v-model="text"
							@keyup="onKeyUp"
						>
					</div>

				</label>

				<button
					class="button-icon button-icon--green"
					title="Submit"
					@click="onSubmitClick"
				>
					<i class="fa fa-solo fa-check"></i>
				</button>

				<button
					class="button-icon button-icon--green open-cards-popup"
					title="Pick Cards"
					@click="onCardsPopupClick"
				>
					<i class="fa fa-solo fa-th"></i>
				</button>

			</div>

			<div class="right bm-l">
				<div
					class="clicable-tag train"
					@click="onUndoClick"
				><kbd class="clicable rm-s">↑</kbd>
					<span>Undo</span>
				</div>
			</div>

			<div class="train bm-s">
				<span class="rm-s">E.g.</span><kbd>7d</kbd> <kbd>Kh</kbd> <kbd>ts</kbd>
			</div>

		</app-dialog-body>
	</div>
</template>

<script>

import DialogHeader from './dialog-header.vue';
import DialogBody from './dialog-body.vue';
import cardsInput from '../../eases/cards-input.js';
import state from '../../units/state';
import vikFunctions from '../../units/vikFunctions';
import { head } from '../../units/absx';

export default {

	components: {

		'app-dialog-header': DialogHeader,
		'app-dialog-body': DialogBody
	},

	data() {

		return {
			title: '',
			isVisible: false,
			text: '__ __ __',
			maxlenght: 8
		};
	},

	methods: {

		onSubmitClick(event) {

			const { controller } = this.$root.$data;

			const submit = controller.handleStreetSubmit(event);
			submit(this.text);
		},

		onKeyUp(event) {

			const { key } = event;

			const work = {

				ArrowUp: () => controller.undo(),

				Enter: () => submit(this.text),
			};

			const { controller } = this.$root.$data;
			const submit = controller.handleStreetSubmit(event);

			key in work && work[key].call();
		},

		onCardsPopupClick(event) {

			const { controller } = this.$root.$data;

			const popup = controller.handleCardsPopup(event);

			popup(this.$refs['street-cards'], null);
		},

		onUndoClick() {

			const { controller } = this.$root.$data;
			controller.undo();
		},

		wrapUp() {

			state.removeChildElements(this.$refs['wrapper-cards']);

			if (vikFunctions.isMobileOrTablet()) {

				//this.$el.scrollIntoView();
				const app = head(this.$root.$children);

				//app.$refs['switcher'].$el.scrollIntoView({ behavior: 'smooth' });				
				app.$refs['switcher'].$el.scrollIntoView();
				setTimeout(() => window.scrollBy(0, 0), 0);
			}

			setTimeout(() => {

				this.$refs['street-cards'].focus();
				this.$refs['street-cards'].setSelectionRange(0, 0);
			}, 0);
		},

		onStreetCardsClick(event) {

			if (vikFunctions.isMobileOrTablet()) {

				this.onCardsPopupClick(event);
			}
		}
	},



	updated() { },

	beforeUpdate() { },

	mounted() {

		cardsInput.createEvents(this.$refs['street-cards']);

		if (vikFunctions.isMobileOrTablet()) {

			this.$refs['street-cards'].setAttribute('disabled', 'true');
		}
	},


}
</script>

<style scoped>
</style>