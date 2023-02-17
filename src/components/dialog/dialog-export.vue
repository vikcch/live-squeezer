<template>
	<div>
		<app-dialog-header>Export Hand</app-dialog-header>
		<app-dialog-body v-show="!isCollapsed">

			<div class="divorced">

				<button
					:class="['css-button', replayerStyleState]"
					@click="onReplayerClick"
					:disabled="!isReplayerEnabled"
				>
					<span class="css-button-icon"><i
							class="fa fa-play"
							aria-hidden="true"
						></i></span>
					<span class="css-button-text">Replayer</span>
				</button>

				<button
					:class="['css-button', forumStyleState]"
					@click="onExportToForumClick"
					:disabled="!isForumEnabled"
				>
					<span class="css-button-icon"><i
							class="fa fa-external-link"
							aria-hidden="true"
						></i></span>
					<span class="css-button-text">Forum</span>
				</button>

			</div>

			<div
				v-show="sweetAlertShowed"
				ref="sa-blueprint"
			>
				<div class="hh-popup bm-m">{{forumHH}}</div>

				<div class="train right">

					<span
						class="rm-m badge-s"
						ref="copied"
						hidden
					></span>

					<button
						class="css-button button--green"
						@click="onCopyToClipboard"
					>
						<span class="css-button-icon"><i
								class="fa fa-clipboard"
								aria-hidden="true"
							></i></span>
						<span class="css-button-text">Copy to Clipboard</span>
					</button>

				</div>

			</div>

		</app-dialog-body>
	</div>
</template>

<script>
import DialogHeader from './dialog-header.vue';
import DialogBody from './dialog-body.vue';
import { handGap } from '../../units/absx';

import forum from '../../eases/export-to-forum';
// import { post } from '../../extra/fns';


export default {

	data() {

		return {

			isReplayerEnabled: false,
			isForumEnabled: false,
			isCollapsed: false,
			sweetAlertShowed: false,
			forumHH: ''
		};
	},

	components: {

		'app-dialog-header': DialogHeader,
		'app-dialog-body': DialogBody
	},

	methods: {

		async onReplayerClick() {

			const { view, model } = this.$root.$data;

			const result = view.tryGetHandHistory();

			if (result.success) {

				this.isReplayerEnabled = false;

				const hero = model.mainInfo.players.find(p => p.isHero);

				const { href } = window.location;

				const isDev = href.includes('localhost') || href.includes('127.0.0.1');
				
				const prefixDev = 'http://localhost/dev/replayer-riropo/wwwroot';
				const prefixProd = 'https://replayer.winningpokerhud.com';

				const prefix = isDev ? prefixDev : prefixProd;

				const link = `${prefix}/php/converter-tv-save.php`;

				const formData = new FormData();
				formData.append('myrequest', 'send_data');
				formData.append('hero_js', hero?.name || 'vik fails');
				formData.append('log_js', handGap(result.hh));

				const options = { method: 'post', body: formData, mode: 'cors' };

				try {

					const rawResponse = await fetch(link, options);

					const content = await rawResponse.json();

					if (content.success) {

						window.open(content.link, '_blank');
						return;

					} else view.showGenericError();

				} catch (error) {

					/* eslint-disable-next-line */
					console.error(error);

					view.showGenericError();
				}

				this.isReplayerEnabled = true;
			}
		},

		onExportToForumClick() {

			const { view, model } = this.$root.$data;

			const result = view.tryGetHandHistory();

			if (result.success) {

				this.forumHH = forum(model);

				this.$swal.fire({
					showCloseButton: true,
					onBeforeOpen: saEl => {

						const content = saEl.querySelector('.swal2-content');

						const blueprint = this.$refs['sa-blueprint'];

						this.sweetAlertShowed = true;

						content.appendChild(blueprint);
					}
				});
			}
		},

		onCopyToClipboard() {

			const copied = this.$refs['copied'];
			const text = this.forumHH;

			const sculptCopiedEl = options => {

				copied.textContent = options.text;
				copied.style.color = options.color;
				copied.style.background = 'LightGreen';
				copied.removeAttribute('hidden');
				setTimeout(() => copied.setAttribute('hidden', 'true'), 3000);
			};

			navigator.clipboard.writeText(text).then(function () {

				sculptCopiedEl({ text: 'Copied!', color: 'darkgreen' });

			}, function (err) {

				sculptCopiedEl({ text: 'Error!', color: 'darkred' });

				/* eslint-disable-next-line */
				console.error(err);
			});

		},
	},

	computed: {

		replayerStyleState() {

			return `button--${this.isReplayerEnabled ? 'green' : 'disabled'}`;
		},

		forumStyleState() {

			return `button--${this.isForumEnabled ? 'green' : 'disabled'}`;
		},
	}
}
</script>

<style>
.badge-s {
	padding: 2px 4px;
	border-radius: 8px;
}
</style>