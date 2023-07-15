<template>
	<input
		class="input--main-info"
		v-model="text"
		v-bind="attributes"
		@input="onInputHandler"
		:disabled="!enabled"
		@paste="onPaste"
	>
</template>

<script>

import validation from "../../units/validations.js";

export default {

	props: ['attrs'],

	data() {
		return {
			text: this.attrs.text
		}
	},

	computed: {
		attributes() {
			return {
				[`type`]: this.attrs.type || 'text',
				[`placeholder`]: this.attrs.placeholder,
				[`maxlength`]: this.attrs.maxlength,
				[`inputmode`]: this.attrs.inputmode,
			};
		},

		enabled() {

			// NOTE:: Apenas `handTime`(key) é opcional
			if (!this.attrs.optional) return true;

			return this.attrs.enabled;
		}

	},

	methods: {

		onInputHandler(event) {

			const isInputDate = event.currentTarget.type === 'date';

			!isInputDate && this.forced();

			this.dispatch();
		},

		forced() {

			const rules = {

				handId: () => validation.force.onlyNumbers(this.text),
				tableName: () =>
					validation.force.onlyAlphaNumeric(this.text),
				stakes: () =>
					validation.force.onlyNumbersDotsAndBrackets(this.text),
				handTime: () => validation.force.onlyNumbersAndColon(this.text),
			};

			this.text = rules[this.attrs.key].call();
		},

		dispatch() {

			const parcel = { [this.attrs.key]: this.text };

			window.EventVue.$emit('intelMainInfo', parcel);
		},

		setHandDate() {

			if (this.attrs.key === 'handDate') {

				this.$el.valueAsDate = new Date();
				this.text = this.$el.value;

				this.dispatch();
			}
		},

		reset() {

			const work = {

				handId: () => this.text = Date.now(),

				handDate: () => this.setHandDate(),

				handTime: () => this.text = this.enabled ? '' : this.attrs.text,

				default: () => this.text = this.attrs.text
			};

			const { key } = this.attrs;

			(work[key] || work['default']).call();

			this.dispatch();
		},

		async onPaste() {

			if (this.attrs.key !== 'handTime') return;

			try {
				// NOTE:: Precisa de uma origem segura, HTTPS ou localhost
				await navigator.clipboard.writeText('');
			} catch (error) { console.error('Need HTTPS \n\n', error); }
		}
	},


	created() {

		this.dispatch();

		window.EventVue.$on(`${this.attrs.key}MainInfoHighlight`, () => {

			this.$el.focus();
		});

		if (['handId', 'handTime'].includes(this.attrs.key)) {

			window.EventVue.$on(`${this.attrs.key}MainInfoText`, (value) => {

				this.text = value;

				this.dispatch();
			});
		}
	},

	mounted() {

		this.setHandDate();
	}

}
</script>

<style>
</style>