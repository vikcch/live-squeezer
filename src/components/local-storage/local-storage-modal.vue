<template>

	<modal
		name="manager"
		:height="getHeight"
		:width="getWidth"
		@before-open="beforeOpen"
		@before-close="beforeClose"
	>
		<div class="ladder text-center">

			<h2 class="tm-l bm-m tight">Local Storage {{itemsCountText}}</h2>

			<app-local-storage-grid
				class="flex-1"
				ref="grid"
			></app-local-storage-grid>

			<div class="divorced tight allm-s">

				<div>

					<button
						:class="['swal2-styled swal2-confirm', saveAllStyleState]"
						@click="onSaveAllClick"
						:disabled="isEmpty"
					>Save All</button>

					<button
						:class="['swal2-styled swal2-confirm', deleteAllStyleState ]"
						@click="onDeleteAllClick"
						:disabled="isEmpty"
					>Delete All</button>

				</div>

				<button
					class="swal2-styled swal2-confirm hoverable h-padding-m"
					@click="onCloseModalClick"
				>OK</button>
			</div>

		</div>

	</modal>

</template>

<script>
import localStorageGridVue from '../local-storage/local-storage-grid.vue';
import ls from '../../eases/local-storage.js';
import { handGap, head } from '../../units/absx';
import vikFunctions from '../../units/vikFunctions.js';
import fs from '../../extra/filesaver.js';

export default {

	components: {

		'app-local-storage-grid': localStorageGridVue
	},

	data() {

		return {

			isEmpty: false,
			itemsCountText: null
		}
	},

	methods: {

		onSaveAllClick() {

			const items = ls.getItems();

			const hhs = items
				.sort((a, b) => a.handId - b.handId)
				.map(i => i.hh);

			const gap = handGap('');

			const textToSave = handGap(hhs.join(gap));
			const fileName = `HH${head(items).handId}.txt`;

			const blob = new Blob([textToSave], {
				type: "text/plain;charset=utf-8"
			});

			fs.saveAs(blob, fileName);
		},

		async onDeleteAllClick() {

			const { view } = this.$root.$data;

			const result = await view.showDeleteConfirmation();

			if (result.value) {

				this.$refs['grid'].$data.items = new Array();

				window.EventVue.$emit('updateLocalStorageProgressBar', null);
			}
		},

		beforeOpen() {

			document.body.classList.add('no-scroll');
		},

		beforeClose() {

			document.body.classList.remove('no-scroll');
		},

		onCloseModalClick() {

			this.$modal.hide('manager');
		},
	},

	computed: {

		getWidth() {

			return vikFunctions.isMobileOrTablet() ? '100%' : '600';
		},

		getHeight() {

			return vikFunctions.isMobileOrTablet() ? '100%' : '530';
		},

		deleteAllStyleState() {

			return `btn-${!this.isEmpty ? 'danger hoverable' : 'disabled'}`;
		},

		saveAllStyleState() {

			return `btn-${!this.isEmpty ? 'success hoverable' : 'disabled'}`;
		},

	},

	created() {

		window.EventVue.$on('updateLocalStorageModalData', (value) => {

			this.isEmpty = value.length === 0;

			this.itemsCountText = this.isEmpty ? '' : `[${value.length}]`;
		});
	}
}
</script>

<style scoped>
.text-center {
	text-align: center;
}
.hoverable:hover {
	background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
}

.btn-disabled {
	background-color: #aaa !important;
}

.btn-danger {
	background-color: #dc3545 !important;
}

.btn-success {
	background-color: #218838 !important;
}

.swal2-styled {
	padding-left: 12px;
	padding-right: 12px;
}

.h-padding-m {
	padding-left: 28px;
	padding-right: 28px;
}

.flex-1 {
	flex: 1;
}

.allm-s {
	margin: 4px;
}

.tight {
	flex: 0;
}
</style>