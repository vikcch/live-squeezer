<template>
	<div
		id="app"
		class="page-container"
	>
		<app-header></app-header>

		<div class="content-container">

			<main ref="main">

				<app-main-info ref="main-info"></app-main-info>

				<app-players-grid ref="players-grid"></app-players-grid>

				<app-start-action ref="start-action"></app-start-action>

				<div
					class="switcher"
					ref="placeholder-switcher-main"
				>
					<app-switcher ref="switcher"></app-switcher>
				</div>

				<app-dialog
					ref="dialog-action"
					:item="'app-dialog-action'"
				></app-dialog>

				<app-dialog
					ref="dialog-street"
					:item="'app-dialog-street'"
				></app-dialog>

				<app-dialog
					ref="dialog-save"
					:item="'app-dialog-save'"
				></app-dialog>

				<app-dialog
					ref="dialog-local-storage"
					:item="'app-dialog-local-storage'"
				></app-dialog>

				<app-dialog
					ref="dialog-export"
					:item="'app-dialog-export'"
				></app-dialog>

				<app-dialog
					ref="dialog-new-hand"
					:item="'app-dialog-new-hand'"
				></app-dialog>

				<app-footer>

				</app-footer>
			</main>

			<aside ref="aside">

				<div>

					<div
						class="switcher bm-m"
						ref="placeholder-switcher-aside"
					></div>

					<app-hand-history ref="hand-history"></app-hand-history>

					<app-forum-format ref="forum-format"></app-forum-format>

				</div>

			</aside>

		</div>

	</div>

</template>

<script>
import Vue from 'vue';

import Header from './components/header.vue';
import MainInfo from './components/main-info/main-info.vue';
import PlayersGrid from './components/players-grid/players-grid.vue';
import HandHistory from './components/hand-history/hand-history.vue';
import StartAction from './components/start-action.vue';
import Dialog from './components/dialog/dialog.vue';
import Switcher from './components/switcher.vue';
import ForumFormat from './components/forum-format.vue';
import Footer from './components/footer.vue';

Vue.config.productionTip = false;
Vue.config.devtools = false;

window.EventVue = new Vue;

export default {
	name: 'app',
	components: {
		'app-header': Header,
		'app-main-info': MainInfo,
		'app-players-grid': PlayersGrid,
		'app-start-action': StartAction,
		'app-switcher': Switcher,
		'app-dialog': Dialog,
		'app-hand-history': HandHistory,
		'app-forum-format': ForumFormat,
		'app-footer': Footer
	},

	data() {
		return {};
	},
	created() {

		window.addEventListener('keyup', (event) => {

			if (event.key === 'F8') {

				this.$refs['players-grid'].focusFirstPlayerInput();
			}

			if (event.key === 'F9') {

				if (!this.$refs['start-action'].$data.isEnabled) return;

				const { controller } = this.$root.$data;
				controller.handleStartAction(event);
			}

		});
	}
};
</script>

<style>
#app {
	font-family: "Open Sans", Arial, Helvetica, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	font-size: 15px;

	color: #6a737c;
}
.page-container {
	max-width: 960px;
	margin: auto;
	display: flex;
	flex-direction: column;
	height: 100.1vh;
}

.content-container {
	display: flex;
	height: 100%;
}

main {
	flex: 9;
}

main > * + * {
	margin-bottom: 10px;
}

aside {
	flex: 11;
	display: none;
}

aside > * + * {
	margin-top: 10px;
}

@media only screen and (min-width: 769px) {
	.switcher {
		display: none;
	}

	main,
	aside {
		display: block !important;
	}

	.content-container > * + * {
		margin-left: 10px;
	}

	aside > * + * {
		margin-top: 0px;
	}
}
</style>
