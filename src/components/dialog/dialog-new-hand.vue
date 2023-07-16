<template>
	<div>
		<app-dialog-header>New Hand History</app-dialog-header>
		<app-dialog-body v-show="!isCollapsed">

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
					<span class="css-button-text next-hand-text">Next Hand</span>
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

		async onNextHandClick() {

			const { controller, view } = this.$root.$data;
			const result = view.tryGetHandHistory();

			const { isSaveEnabled } = view.dialogLocalStorageVue.$data;

			if (result.success) {

				if (isSaveEnabled && !await this.askNextHandConfirmation()) return;

				controller.handleNextHand();
			}
		},

		async askNextHandConfirmation() {

			const result = await this.$swal.fire({

				title: 'Are you sure?',
				text: 'The hand was not saved on Local Storage!',
				showCancelButton: true,
				cancelButtonText: 'Cancel',
				confirmButtonText: 'Yes',
				reverseButtons: true, // "cancel" como butao da esquerda
			});

			return result.isConfirmed && result.value;
		},

		async nextHand() {

			await this.onNextHandClick();
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

.next-hand-text::after {
	content: "F2";
	font-size: 10px;
	margin-left: 8px;
	vertical-align: 4px;
}
</style>