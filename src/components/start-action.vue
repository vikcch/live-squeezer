<template>

	<div class="wrapper">

		<!-- NOTE:: `@mouseup` e `@keyup` porque `displayDialogAction()` está no mesmo -->
		<!-- "thread" e disparava o erro "Invalid Action" pelo teclado com `@click` -->
		<!-- porque dialog-action já estava visivel... evita um `setTimeout()` -->

		<button
			ref="start-action"
			@mouseup="startAction"
			@keyup="startAction_keyup"
			:class="['css-button', styleState]"
			:disabled="!isEnabled"
		>
			<span class="css-button-icon"><i
					class="fa fa-flag-o"
					aria-hidden="true"
				></i></span>
			<span :class="['css-button-text start-action-text', fetchedStyle]">Start Action</span>
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

		return {
			isEnabled: true,
			fetched: undefined
		};
	},

	methods: {

		startAction(event) {

			event.preventDefault();

			const { controller } = this.$root.$data;
			controller.handleStartAction(event);
		},

		startAction_keyup(event) {

			if (event.key !== "Enter") return;

			const { controller } = this.$root.$data;
			controller.handleStartAction(event);
		},

		disable() {

			this.isEnabled = false;
		},

		enable() {

			this.isEnabled = true;
		},

		state() {

			return this.isEnabled;
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
		},

		fetchedStyle() {

			const workMap = {
				'true': 'green',
				'false': 'red',
				'null': 'black',
				'undefined': ''
			};

			return workMap[this.fetched];
		}
	},

	created() {

		window.EventVue.$on('updateFetched', value => {

			this.fetched = value;

			setTimeout(() => { this.fetched = undefined }, 2500);
		});
	}
}
</script>

<style scoped>
.wrapper {
	display: flex;
	justify-content: center;
	position: relative;
}

.start-action-text::after {
	content: "F9";
	font-size: 10px;
	margin-left: 8px;
	vertical-align: 4px;
}

.start-action-text.green::after {
	color: green;
}
.start-action-text.red::after {
	color: lightcoral;
}
.start-action-text.black::after {
	color: black;
}

.restart {
	position: absolute;
	right: 0;
	top: 4px;
	text-decoration: underline;
	cursor: pointer;
}
</style>