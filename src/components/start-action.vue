<template>

	<div class="wrapper">

		<button
			ref="start-action"
			@click="startAction"
			@mousedown.prevent=""
			:class="['css-button', styleState]"
			:disabled="!isEnabled"
		>
			<span class="css-button-icon"><i
					class="fa fa-flag-o"
					aria-hidden="true"
				></i></span>
			<span class="css-button-text">Start Action</span>
		</button>

		<div
			class="restart"
			role="button"
			tabindex="0"
			@click="restart_Click"
		>
			<span class="rm-m">Restart</span>
			<i
				id="next-hand-info"
				class="fa fa-info-circle text-info"
				aria-hidden="true"
				@click="showInfo_Click"
			></i>
		</div>

	</div>

</template>

<script>
export default {

	data() {

		return { isEnabled: true };
	},

	methods: {

		startAction(event) {

			event.preventDefault();

			const { controller } = this.$root.$data;
			controller.handleStartAction(event);
		},

		disable() {

			this.isEnabled = false;
		},

		enable() {

			this.isEnabled = true;
		},

		restart_Click(event) {

			const { controller } = this.$root.$data;
			controller.handleRestartAction(event);
		},

		showInfo_Click(event) {

			const { view } = this.$root.$data;
			view.showRestartActionInfoPopup(event);
		}
	},

	computed: {

		styleState() {

			return `button--${this.isEnabled ? 'blue' : 'disabled'}`;
		}
	}
}
</script>

<style scoped>
.wrapper {
	display: flex;
	justify-content: center;
	position: relative;
}

.restart {
	position: absolute;
	right: 0;
	top: 4px;
	text-decoration: underline;
	cursor: pointer;
}
</style>