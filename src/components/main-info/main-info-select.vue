<template>
	<select
		class="input--main-info"
		v-model="text"
		@change="onChange()"
	>
		<option
			:key="index"
			v-for="(option, index) in attrs.options"
			v-bind:value="option.value"
		>{{option.text}}</option>
	</select>
</template>

<script>
export default {

	props: ['attrs'],

	data() {
		return { text: this.attrs.text };
	},

	methods: {

		onChange(event) {

			if (this.attrs.key === 'tableMax') {

				const { controller } = this.$root.$data;

				controller.handleTableMax(event)(this.text);
			}

			this.dispatch();
		},

		dispatch() {

			const parcel = { [this.attrs.key]: this.text };

			window.EventVue.$emit('intelMainInfo', parcel);
		},

		reset() {

			this.text = this.attrs.text;
		}

	},

	watch: {

		text(value) {

			if (this.attrs.key === 'dealer') {

				window.EventVue.$emit('updateDealerDisplay', value);
			}
		}
	},


	created() {

		this.dispatch();

		if (this.attrs.key === 'dealer') {

			window.EventVue.$on('updateDealer', value => {

				this.text = value;
				this.dispatch();
			});
		}

		window.EventVue.$on(`${this.attrs.key}MainInfoHighlight`, () => {

			this.$el.focus();
		});
	},

	mounted() {

		if (this.attrs.key === 'dealer') {

			window.EventVue.$emit('updateDealerDisplay', this.attrs.text);
		}
	}
}

</script>

<style scoped>
select {
	text-align-last: center;
}
</style>