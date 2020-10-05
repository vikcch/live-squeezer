<template>
	<div>
		<component
			class="box"
			:is="item"
		></component>
	</div>
</template>

<script>

import DialogAction from './dialog-action.vue';
import DialogStreet from './dialog-street.vue';
import DialogSave from './dialog-save.vue';
import DialogLocalStorage from './dialog-local-storage.vue';
import DialogExport from './dialog-export.vue';
import DialogNewHand from './dialog-new-hand.vue';

export default {

	props: ['item'],

	components: {

		'app-dialog-action': DialogAction,
		'app-dialog-street': DialogStreet,
		'app-dialog-save': DialogSave,
		'app-dialog-local-storage': DialogLocalStorage,
		'app-dialog-export': DialogExport,
		'app-dialog-new-hand': DialogNewHand,
	},

	computed: {

		getComponent() {

			return null;
		},

		Vue() {

			return this.$children[0];
		}
	},

	mounted() {}

}
</script>

<style scoped>
.box {
	border: 1px solid #d6d9dc;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 4px rgba(0, 0, 0, 0.05),
		0 2px 8px rgba(0, 0, 0, 0.05);
}

::v-deep kbd {
	background-color: #eee;
	border-radius: 3px;
	border: 1px solid #b4b4b4;
	box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2),
		0 2px 0 0 rgba(255, 255, 255, 0.7) inset;
	color: #333;
	display: inline-block;
	font-size: 0.85em;
	font-weight: 700;
	line-height: 1;
	padding: 2px 4px;
	white-space: nowrap;
}

::v-deep kbd.clicable {
	font-size: 1.25em;
	line-height: 1.25;
	width: 24px;
	height: 24px;

	display: flex;
	align-items: center;
	justify-content: center;
}

::v-deep .clicable-tag {
	background-color: #fafafa;
	border-radius: 8px;
	border: 1px solid #b4b4b4;
	padding: 8px 8px;
	cursor: pointer;
}

::v-deep .clicable-tag:hover {
	background-color: #eee;
}
</style>