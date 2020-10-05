<template>

	<div class="wrapper">

		<div class="train">
			<p>Space monitor:</p>
			<i
				class="fa fa-info-circle text-info lm-m"
				aria-hidden="true"
				@click="onSpaceMonitorInfoClick"
			></i>
		</div>

		<p>{{printSpaceStats}}</p>

		<div class="train">

			<div class="wrapper-pb">

				<div class="background"></div>
				<div
					class="bar"
					:style="{width: value + '%'}"
				></div>

			</div>

			<span class="lm-s">{{ Math.round(value) }}%</span>
		</div>

	</div>

</template>

<script>

import { capFloorZero, cap100 } from './../../units/absx';
import { bytes } from './../../units/vikFunctions';
import ls from './../../eases/local-storage.js';

export default {

	data() {

		const stats = ls.spaceStats();

		return {
			capacity: ls.capacity,
			value: cap100(stats.used.percentage),
			used: stats.used.value,
			free: capFloorZero(stats.free.value),
			time: 0
		};
	},

	methods: {

		onSpaceMonitorInfoClick() {

			const { view } = this.$root.$data;
			view.showLocalStorageSpaceInfoPopup();
		}

	},

	computed: {

		printSpaceStats() {

			const capacityText = `Capacity: ${bytes(this.capacity)}`;
			const usedText = `Used: ${bytes(this.used)}`;
			const freeText = `Free: ${bytes(this.free)}`;

			return `${capacityText} - ${usedText} - ${freeText}`;
		}
	},

	beforeCreate() { },

	created() {

		window.EventVue.$on('updateLocalStorageProgressBar', () => {

			const stats = ls.spaceStats();

			this.$data['value'] = cap100(stats.used.percentage);
			this.$data['used'] = stats.used.value;
			this.$data['free'] = capFloorZero(stats.free.value);
		});
	},

	mounted() { }
}
</script>

<style scoped>
* {
	font-size: 14px;
}

.wrapper-pb {
	position: relative;
	width: 100%;
	height: 10px;
}

.bar {
	position: absolute;
	width: 0%;
	height: 100%;
	background: linear-gradient(180deg, #63b8ee 5%, #468ccf 100%);
	z-index: 2;
}

.background {
	position: absolute;
	width: 100%;
	height: 100%;
	background: linear-gradient(180deg, #ededed 5%, #dfdfdf 100%);
	z-index: 1;
}
</style>

