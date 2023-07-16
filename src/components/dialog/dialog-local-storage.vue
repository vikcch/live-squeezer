<template>

	<div>
		<app-dialog-header>Save Hand History on Local Storage</app-dialog-header>
		<app-dialog-body v-show="!isCollapsed">

			<div class="divorced bm-l">

				<button
					:class="['css-button', saveStyleState]"
					:disabled="!isSaveEnabled"
					@click="onSaveClick"
				>
					<span class="css-button-icon"><i
							class="fa fa-globe"
							aria-hidden="true"
						></i></span>
					<span class="css-button-text">Save</span>
				</button>

				<button
					class="css-button button--blue"
					@click="showStorageManager"
				>
					<span class="css-button-icon"><i
							class="fa fa-database"
							aria-hidden="true"
						></i></span>
					<span class="css-button-text">Manager</span>
				</button>

			</div>

			<app-progress-bar ref="pb"></app-progress-bar>

		</app-dialog-body>

		<app-local-storage-modal></app-local-storage-modal>

	</div>

</template>

<script>

import DialogHeader from './dialog-header.vue';
import DialogBody from './dialog-body.vue';
import ProgressBar from './../local-storage/progress-bar.vue';
import localStorageModalVue from './../local-storage/local-storage-modal.vue';
import ls from '../../eases/local-storage.js';

export default {

	components: {
		'app-dialog-header': DialogHeader,
		'app-dialog-body': DialogBody,
		'app-progress-bar': ProgressBar,
		'app-local-storage-modal': localStorageModalVue
	},

	data() {

		return {

			isSaveEnabled: false,
			isCollapsed: false
		}
	},

	methods: {

		async onSaveClick() {

			const { view } = this.$root.$data;
			const result = view.tryGetHandHistory();

			if (result.success) {

				const { handId, handDate } = view.mainInfoVue.values;

				const { hh } = result;

				const item = { handId, handDate, hh, note: 'Note:' };

				const resultInsert = ls.insertItem(item);

				if (resultInsert.success) {

					view.showSmallTopRightSuccessfully();
					this.isSaveEnabled = false;

				} else await view.showGenericError();

				window.EventVue.$emit('updateLocalStorageProgressBar', null);

				return resultInsert.success;
			}
		},

		showStorageManager() {

			this.$modal.show('manager');
		},

		tryEnableSaveButton() {

			const { view } = this.$root.$data;
			const result = view.tryGetHandHistory({ alert: false });

			if (result.success) {

				const item = ls.getItems().find(i => i.hh === result.hh);

				this.isSaveEnabled = item === undefined;
			}
		},

		async save() {

			return await this.onSaveClick();
		}

	},

	computed: {

		saveStyleState() {

			return `button--${this.isSaveEnabled ? 'blue' : 'disabled'}`;
		}
	}
}

</script>

<style scoped>
</style>