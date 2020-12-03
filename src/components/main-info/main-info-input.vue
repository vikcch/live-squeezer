<template>
	<input
		class="input--main-info"
		v-model="text"
		v-bind="attributes"
		@input="onInputHandler"
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

				default: () => this.text = this.attrs.text
			};

			const { key } = this.attrs;

			(work[key] || work['default']).call();

			this.dispatch();
		}
	},

	created() {

		this.dispatch();

		window.EventVue.$on(`${this.attrs.key}MainInfoHighlight`, () => {

			this.$el.focus();
		});
	},

	mounted() {

		this.setHandDate();
	}

}
</script>

<style>
</style>