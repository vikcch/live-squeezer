<template>

	<div		
		:class="['box-header train divorced', headerStyleState]"
	>
		<slot></slot>
		<div v-show="isCollapsable">

			<button
				class="button-icon button-icon--gray no-select"
				title=""
				@click="onCollapseClick"
				aria-label="collapse"
			>
				<i :class="['fa', collapsedStyleState]"></i>
			</button>

		</div>
	</div>

</template>

<script>
/**
 * 	isCollapsable / collapsable => se expande ou não (tem icon)
 * 	isCollapsed => (estado) se está colapsado ou expandido
 * 
 * 	O default é ser 'collapsable', apenas 'dialog-action.vue' e
 * 	'dialog-street.vue' não são. (São essas que mencionam que não são)
 */
export default {

	props: ['collapsable'],

	data() {

		return {

			isCollapsed: false
		};

	},

	methods: {

		onCollapseClick() {

			this.isCollapsed = !this.isCollapsed;

			this.$parent.$data.isCollapsed = this.isCollapsed;
		}
	},

	computed: {

		isCollapsable() {

			return this.$props['collapsable'] !== false;
		},

		collapsedStyleState() {

			return `fa-chevron-${this.isCollapsed ? 'down' : 'up'}`;
		},

		headerStyleState() {

			return this.isCollapsable ? 'no-vertical-padding' : '';
		},

	},

}

</script>
<style scoped>
.box-header {
	border-bottom: 1px solid #d6d9dc;
	background: #fafafb;
	color: #6a737c;
	padding: 9px 12px;
}

.no-vertical-padding {
	padding: 0px 3px 0px 12px;
}

.no-select {
	outline: 0;
	-moz-outline: 0;
}
</style>