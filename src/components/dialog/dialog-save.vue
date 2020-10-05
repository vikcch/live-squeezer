<template>
	<div>
		<app-dialog-header>Save Hand History on File</app-dialog-header>
		<app-dialog-body v-show="!isCollapsed">

			<div class="save-append">

				<div>
					<label
						for="file-upload"
						class="custom-file-upload"
					>
						<i class="fa fa-file-text-o"></i> Select a file to append
					</label>
					<input
						id="file-upload"
						type="file"
						accept='text/plain'
						@change='openFile'
						ref="file-upload"
					/>
					<i
						id="file-upload-info"
						class="fa fa-info-circle text-info lm-m"
						aria-hidden="true"
						@click="onAppendToInfoClick"
					></i>
				</div>

				<button
					:class="['css-button', appendToStyleState]"
					@click="onAppendToClick"
					:disabled="!isAppendToEnabled"
				>
					<span class="css-button-icon"><i
							class="fa fa-plus"
							aria-hidden="true"
						></i></span>
					<span
						id="append-file-label"
						class="css-button-text hide-overflow max-w-250"
					>Append to: <em>{{appendToText}}</em></span>
				</button>

			</div>

			<div class="bullseye">
				<div class="separator"></div>
				<em class="very-small-text lm-m rm-m">OR</em>
				<div class="separator"></div>
			</div>

			<div class="save-new tm-m">
				<button
					:class="['css-button', saveAsNewStyleState]"
					@click="onSaveAsNewClick"
					:disabled="!isSaveAsNewEnabled"
				>
					<span class="css-button-icon"><i
							class="fa fa-floppy-o"
							aria-hidden="true"
						></i></span>
					<span class="css-button-text">Save as a new File</span>
				</button>
			</div>

		</app-dialog-body>
	</div>
</template>

<script>
// class="css-button button--disabled"
import DialogHeader from './dialog-header.vue';
import DialogBody from './dialog-body.vue';

import fs from '../../extra/filesaver.js';
import { handGap } from '../../units/absx';

const saveTofile = function (text, fileName) {

	const blob = new Blob([text], {
		type: "text/plain;charset=utf-8"
	});

	fs.saveAs(blob, fileName);
};

export default {

	data() {

		return {

			// appendToText: '<No file selected>',
			appendToText: null, // read on `created` lifecycle 
			isAppendToEnabled: false,
			isSaveAsNewEnabled: false,
			isCollapsed: false
		};
	},

	components: {

		'app-dialog-header': DialogHeader,
		'app-dialog-body': DialogBody
	},

	methods: {

		openFile() {

			const input = this.$refs['file-upload'];

			const reader = new FileReader();

			reader.onload = () => {

				// const text = reader.result;

				this.appendToText = input.value.replace(/^.*\\/, '');
			};

			reader.onerror = () => {

				const { view } = this.$root.$data;
				const htmlText = 'Please report this error!';
				view.showGenericError(htmlText);
			};

			if (input.value.length) reader.readAsText(input.files[0]);
		},

		onAppendToClick() {

			const file = this.$refs['file-upload'].value;

			if (!file.length) {

				const { view } = this.$root.$data;
				const title = 'Please select a file!';
				view.showGenericError(null, title);

				return;
			}

			const input = this.$refs['file-upload'];

			const reader = new FileReader();

			reader.onload = () => {

				const { view } = this.$root.$data;
				const result = view.tryGetHandHistory();

				if (result.success) {

					const textToSave = handGap(`${reader.result}${result.hh}`);
					const fileName = input.value.replace(/^.*\\/, '');

					saveTofile(textToSave, fileName);
				}

			};

			reader.onerror = () => {

				const { view } = this.$root.$data;
				const htmlText = 'Please report this error!';
				view.showGenericError(htmlText);
			};

			if (input.value.length) reader.readAsText(input.files[0]);
		},

		onAppendToInfoClick() {

			const { view } = this.$root.$data;
			view.showAppendToInfoPopup();
		},

		onSaveAsNewClick() {

			const { view } = this.$root.$data;
			const result = view.tryGetHandHistory();

			if (result.success) {

				const { handId } = view.mainInfoVue.values;

				const textToSave = handGap(result.hh);
				const fileName = `HH${handId}.txt`;

				saveTofile(textToSave, fileName);
			}
		},

		abateAppendedFile() {

			// Dava erro quando se o fazia `Append to: ...` pela segunda vez
			// Era preciso voltar a clicar em `Select a file to append`
			this.$refs['file-upload'].value = null;
			this.appendToText = this.appendToTextDefault;
		}

	},

	computed: {

		appendToStyleState() {

			return `button--${this.isAppendToEnabled ? 'blue' : 'disabled'}`;
		},

		saveAsNewStyleState() {

			return `button--${this.isSaveAsNewEnabled ? 'blue' : 'disabled'}`;
		},

		appendToTextDefault() {

			return '<No file selected>';
		}
	},

	created() {

		this.appendToText = this.appendToTextDefault;
	}
}
</script>

<style scoped>
.save-append > div {
	margin-bottom: 6px;
}

.save-append {
	margin-bottom: 8px;
}

input[type="file"] {
	display: none;
}
.custom-file-upload {
	border: 1px solid #ccc;
	display: inline-block;
	padding: 6px 12px;
	cursor: pointer;
}

.max-w-250 {
	max-width: 250px;
}

.separator {
	border-bottom: 1px #d6d9dc solid;
	width: 100%;
}
</style>
