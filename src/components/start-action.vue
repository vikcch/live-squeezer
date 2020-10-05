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

		enable(){

			this.isEnabled = true;
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
}
</style>