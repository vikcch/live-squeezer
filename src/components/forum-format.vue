<template>

	<div class="wrapper">

		<button
			@click="onClick"
			:class="['css-button', styleState]"
			:disabled="!isEnabled"
			@mousedown.prevent=""
		>
			<span class="css-button-icon"><i
					class="fa fa-css3"
					aria-hidden="true"
				></i></span>
			<span class="css-button-text">Show Forum Format</span>
		</button>

		<div
			v-show="sweetAlertShowed"
			ref="sa-blueprint"
		>

			<div
				class="hh-popup bm-m"
				ref="hh"
			></div>
			<div class="right">

				<button
					class="css-button button--green"
					@click="onSaveAsImageClick"
				>
					<span class="css-button-icon"><i
							class="fa fa-camera"
							aria-hidden="true"
						></i></span>
					<span class="css-button-text">Save as Image ⚠️</span>
				</button>
			</div>

		</div>

	</div>

</template>

<script>

import forum from '../eases/export-to-forum';
import html2canvas from 'html2canvas';


const stylingReplacement = function (text) {

	['b', 'i'].forEach(e => {

		text = text.replace(new RegExp(`\\[${e}]`, 'gi'), `<${e}>`);
		text = text.replace(new RegExp(`\\[.${e}]`, 'gi'), `</${e}>`);
	});

	const colors = ['orangered', 'sienna', 'green', 'red', 'darkblue', 'black'];

	colors.forEach(c => {

		const regex = new RegExp(`\\[COLOR=${c}]`, 'g');

		text = text.replace(regex, `<span style="color:${c}">`);
		text = text.replace(/\[.COLOR]/g, '</span>');
	});

	text = text.replace(/(\[URL=.+?]|\[.URL])/g, '');

	const suits = [
		{ name: ':diamond:', color: 'blue', char: '♦' },
		{ name: ':heart:', color: 'darkred', char: '♥' },
		{ name: ':spade:', color: 'black', char: '♠' },
		{ name: ':club:', color: 'green', char: '♣' },
	];

	suits.forEach(s => {

		const regex = new RegExp(`${s.name}`, 'g');

		const fix = `<span style="color:${s.color}; font-size:18px">${s.char}</span>`;

		text = text.replace(regex, fix);
	});

	return text;
};


export default {

	data() {

		return {
			isEnabled: false,
			sweetAlertShowed: false
		};
	},

	methods: {

		onClick() {

			const { view, model } = this.$root.$data;

			const result = view.tryGetHandHistory();

			if (result.success) {

				const forumHH = forum(model);

				this.$refs['hh'].innerHTML = stylingReplacement(forumHH);

				this.$swal.fire({
					showCloseButton: true,
					onBeforeOpen: saEl => {

						const content = saEl.querySelector('.swal2-content');

						const blueprint = this.$refs['sa-blueprint'];

						this.sweetAlertShowed = true;

						content.appendChild(blueprint);

						this.$refs['sa-blueprint'].removeAttribute('hidden');
					}
				});

			}

		},

		async onSaveAsImageClick() {

			const { model } = this.$root.$data;
			
			const canvas = await html2canvas(this.$refs['hh'], {});

			canvas.style.marginTop = '24px';
			canvas.style.border = '1px #d6d9dc solid';
			canvas.style.padding = '2px';

			const content = document.querySelector('.swal2-content');

			this.$refs['sa-blueprint'].setAttribute('hidden', 'true');

			content.appendChild(canvas);

			const link = document.createElement('a');			
			link.download = `IMG-${model.mainInfo.handId}.png`;
			link.href = canvas.toDataURL();
			link.click();
		},

		disable() {

			this.isEnabled = false;
		},

		enable() {

			this.isEnabled = true;
		}
	},

	computed: {

		styleState() {

			return `button--${this.isEnabled ? 'green' : 'disabled'}`;
		}
	}
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans&display=swap");

.wrapper {
	display: flex;
	justify-content: center;
}

.hh-popup {
	font-size: 15px;
	line-height: 1.3;
	font-family: "Open Sans", Arial, Helvetica, sans-serif;
	color: #333;
	-webkit-font-smoothing: antialiased;
}
</style>