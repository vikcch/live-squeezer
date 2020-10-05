<template>

	<div class="wrapper-grid">

		<app-local-storage-card
			:key="index"
			v-for="(item, index) in items"
			:intel="{item, index}"
		>

		</app-local-storage-card>

		<div
			v-show="!items.length"
			class="bullseye"
		>
			<p>Empty</p>
		</div>

	</div>

</template>

<script>

import localStorageCardVue from './local-storage-card.vue';
import ls from '../../eases/local-storage.js';

export default {

	components: {

		'app-local-storage-card': localStorageCardVue
	},

	data() {

		return {

			items: ls.getItems()
		};
	},

	computed: {},

	methods: {

		update(items) {

			const result = ls.update(items);

			const { view } = this.$root.$data;

			if (result.success) view.showSmallTopRightSuccessfully();
			else view.showGenericError();

			window.EventVue.$emit('updateLocalStorageProgressBar', null);

			window.EventVue.$emit('updateLocalStorageModalData', this.items);			
		}
	},

	created() {

		window.EventVue.$on('intelLocalStorageGrid', parcel => {

			const item = this.items[parcel.index];

			if (item) item.note = parcel.note;

		});
		
		this.$watch('items', this.update, { deep: true });

		window.EventVue.$emit('updateLocalStorageModalData', this.items);
	}

}
</script>

<style scoped>
.wrapper-grid {
	overflow-y: scroll;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: flex-start;
}
</style>