<template>
	<div class="cell">

		<div class="train bm-s">
			<span>{{props.slotAttrs.label}}</span>

			<i
				v-if="props.slotAttrs.info"
				class="fa fa-info-circle text-info lm-s"
				@click="showInfo"
				aria-hidden="true"
			></i>
		</div>

		<component
			:is="props.slotAttrs.el"
			:attrs="props.slotAttrs"
		></component>

	</div>
</template>

<script>
import MiInput from './main-info-input.vue';
import MiSelect from './main-info-select.vue';

export default {
	props: ['props'],

	components: {
		'app-mi-input': MiInput,
		'app-mi-select': MiSelect,
	},

	methods: {

		showInfo() {

			const { view } = this.$root.$data;
			const { key } = this.props.slotAttrs;

			const work = {

				stakes: () => view.showStakesInfoPopup(),
				perspective: () => view.showPerspectiveInfoPopup()
			};

			key in work && work[key].call();
		}
	}
}
</script>

<style scoped>

.input--main-info {
	height: 28px;
	/* width: 107px; */
	text-align: center;
	margin-bottom: 10px;
	width: 100%;
}
</style>
