<template>

	<div class="wrapper">

		<p class="hide-overflow">{{intel.item.handDate}}</p>
		<p class="hide-overflow">{{intel.item.handId}}</p>

		<div
			class="hh clickable"
			@click="onShowHandHistoryClick"
		>
			<i
				class="fa fa-align-left fa-2x"
				aria-hidden="true"
			></i>
			<i
				class="fa fa-align-left fa-2x offset-x"
				aria-hidden="true"
			></i>

		</div>

		<div class="tm-s bm-s">

			<button
				class="button-icon button-icon--green"
				title="Save on File"
				@click="onSaveNewFileClick"
			>
				<i class="fa fa-solo fa-floppy-o"></i>
			</button>

			<button
				class="button-icon button-icon--red"
				title="Delete"
				@click="onDeleteClick"
			>
				<i class="fa fa-solo fa-trash"></i>
			</button>

			<button
				class="button-icon button-icon--green"
				title="Open"
				@click="onOpenClick"
			>
				<i class="fa fa-solo fa-external-link"></i>
			</button>

		</div>

		<div class="notes train divorced">
			<p
				class="hide-overflow lm-m clickable max-w-64"
				@click="onNoteClick"
			>{{intel.item.note}}</p>
			<button
				class="button-icon button-icon--chocolate"
				title="Create or Edit a Note"
				@click="onEditNoteClick"
			>
				<i class="fa fa-solo fa-pencil-square-o"></i>
			</button>
		</div>

	</div>
</template>

<script>
import fs from '../../extra/filesaver.js';
import { handGap } from '../../units/absx';

export default {

	props: ['intel'],

	methods: {

		onShowHandHistoryClick() {

			const htmlText = `<div class="hh-popup">${this.intel.item.hh}</div>`

			this.$swal.fire({
				html: htmlText,
				showCloseButton: true,
				// para nao animar => animation: false // is deprecated 
				showClass: {
					popup: '',
					icon: ''
				},
				hideClass: {
					popup: '',
				},
			});
		},

		onSaveNewFileClick() {

			const { handId, hh } = this.intel.item;

			const textToSave = handGap(hh);
			const fileName = `HH${handId}.txt`;

			const blob = new Blob([textToSave], {
				type: "text/plain;charset=utf-8"
			});

			fs.saveAs(blob, fileName);
		},

		async onDeleteClick() {

			const { view } = this.$root.$data;
			const result = await view.showDeleteConfirmation();

			if (result.value) {

				const { items } = this.$parent.$data;

				this.$delete(items, this.intel.index);
			}
		},

		onOpenClick() {

			// Para poder exportar para o forum, ter a opção de fazer `Next Hand`
			// tinha que meter a info no model e provavelmente preencher o array histories

			this.onShowHandHistoryClick();
		},

		onNoteClick() {

			this.$swal({ text: this.intel.item.note });
		},

		async onEditNoteClick() {

			const { value } = await this.$swal({
				title: 'Insert Note!',
				input: 'text'
			});

			if (value) {

				const parcel = { index: this.intel.index, note: value };

				this.dispatch(parcel);
			}
		},

		dispatch(parcel) {

			window.EventVue.$emit('intelLocalStorageGrid', parcel);
		},
	}

}

</script>

<style scoped>
.wrapper {
	border: 1px solid #d6d9dc;
	/* background: #fafafb; */
	padding: 8px;
	color: #6a737c;
	max-width: 142px;
	margin: 4px;
}

.notes {
	width: 100%;
	background: #fafafb;
	border: 1px solid #d6d9dc;
}

.hh {
	width: 100%;
	border: 1px solid #d6d9dc;
	background: #fafafb;
	padding: 8px;
	position: relative;
	text-align: left;
}

.clickable {
	cursor: pointer;
}

.offset-x {
	position: absolute;
	left: 28px;
}

.max-w-64 {
	max-width: 64px;
}
</style>