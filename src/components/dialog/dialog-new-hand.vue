<template>
	<div>
		<app-dialog-header>New Hand History</app-dialog-header>
		<app-dialog-body v-show="!isCollapsed">

			<!-- TODO:: Implementar ? -->
			<!-- <label class="train">

				<input
					type="checkbox"
					checked
				>
				<span class="lm-m">Ask confirmation if not saved</span>
			</label> -->

			<div class="right bm-s">

				<i
					id="next-hand-info"
					class="fa fa-info-circle text-info"
					aria-hidden="true"
					@click="onShowInfoClick"
				></i>

			</div>

			<div class="divorced">

				<button
					id="new-hand"
					class="css-button button--blue"
					@click="onNewHandClick"
				>
					<span class="css-button-icon"><i
							class="fa fa-file"
							aria-hidden="true"
						></i></span>
					<span class="css-button-text">New Hand</span>
				</button>

				<button
					id="next-hand"
					:class="['css-button', nextHandStyleState]"
					@click="onNextHandClick"
					:disabled="!isNextHandEnabled"
				>
					<span class="css-button-icon"><i
							class="fa fa-arrow-circle-right"
							aria-hidden="true"
						></i></span>
					<span class="css-button-text">Next Hand</span>
				</button>

			</div>

		</app-dialog-body>
	</div>
</template>

<script>

import DialogHeader from './dialog-header.vue';
import DialogBody from './dialog-body.vue';

export default {

	data() {

		return {

			isNextHandEnabled: false,
			isCollapsed: false
		};
	},

	components: {

		'app-dialog-header': DialogHeader,
		'app-dialog-body': DialogBody
	},

	methods: {

		onShowInfoClick() {

			const { view } = this.$root.$data;

			view.showNextHandInfoPopup();
		},

		onNewHandClick() {

			const { controller } = this.$root.$data;

			controller.handleNewHand();
		},

		onNextHandClick() {

			const { controller, view } = this.$root.$data;
			const result = view.tryGetHandHistory();

			if (result.success) {
				controller.handleNextHand();
			}
		}
	},

	computed: {

		nextHandStyleState() {

			return `button--${this.isNextHandEnabled ? 'blue' : 'disabled'}`;
		}
	}
}
</script>

<style scoped>
input {
	width: auto;
}
</style>