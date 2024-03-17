<template>

	<header>

		<div class="divorced">

			<h1 class="logo">Live Squeezer - Poker Hand Generator</h1>

			<form
				action="https://www.paypal.com/cgi-bin/webscr"
				method="post"
				target="_top"
				class="train"
			>
				<input
					type="hidden"
					name="cmd"
					value="_s-xclick"
				/>
				<input
					type="hidden"
					name="hosted_button_id"
					value="MRHAEHLF9RYAN"
				/>
				<input
					type="image"
					:src="getPaypalImage"
					border="0"
					name="submit"
					title="PayPal - The safer, easier way to pay online!"
					alt="Donate with PayPal button"
				/>
			</form>
		</div>

		<div :hidden="!headerText">

			<p>Efficiently convert live and television poker hands into the PokerStars Hand History log format for record keeping and analysis.</p>

			<div class="divorced">

				<p class="self-employed"><span class="note">NOTE:</span> Need someone to transcribe poker hands? Contact us at <a
						class="light-link"
						href="mailto:winningpokerhud@gmail.com"
					>winningpokerhud@gmail.com</a>
					<button
						class="button-copy"
						@click="copyEmail_Click"
						:class="{copied}"
					>Copy Email</button>
				</p>

				<button
					:class="['button-hidden']"
					title="Hide Text"
					@click="headerText = false"
				>
					<i class="fa fa-times"></i>
				</button>

			</div>
		</div>

		<div class="github">
			<!-- Place this tag where you want the button to render. -->
			<a
				class="github-button"
				href="https://github.com/vikcch"
				data-color-scheme="no-preference: light; light: light; dark: dark;"
				aria-label="Follow @vikcch on GitHub"
			>Follow @vikcch</a>
			<!-- Place this tag where you want the button to render. -->
			<span>&nbsp;</span>
			<a
				class="github-button"
				href="https://github.com/vikcch/live-squeezer"
				data-color-scheme="no-preference: light; light: light; dark: dark;"
				data-icon="octicon-star"
				aria-label="Star vikcch/live-squeezer on GitHub"
			>Star</a>
		</div>

	</header>

</template>

<script>
import paypal147x47 from '../assets/paypal-147x47.js';
export default {

	data() {
		return {
			copied: false,
			headerText: true
		}
	},
	methods: {

		async copyEmail_Click() {
			try {
				// NOTE:: Precisa de uma origem segura, HTTPS ou localhost
				await navigator.clipboard.writeText('winningpokerhud@gmail.com');
				this.copied = true;
				setTimeout(() => { this.copied = false; }, 1500);
			} catch (error) { console.error(error); }
		}
	},

	computed: {

		getPaypalImage() {

			return paypal147x47;
		}
	},
}
</script>

<style scoped>
header {
	position: relative;
	background-color: #2c2b2b;
	padding: 20px 4px 8px 4px;
	color: white;
	margin-bottom: 8px;
}

h1 {
	font-weight: normal;
	font-size: 28px;
}

.github {
	position: absolute;
	top: 2px;
	right: 2px;
}

.self-employed {
	margin-top: 12px;
}

.note {
	color: orange;
}

.light-link {
	color: lightgray;
}

.button-copy {
	padding: 4px 8px;
	margin-left: 8px;
	margin-top: 2px;
	cursor: pointer;
	border: 0;
	border-radius: 4px;
}

.copied {
	background-color: green;
	color: white;
}

.button-hidden {
	background: #2c2b2b;
	color: lightgray;
	border: 1px solid lightgray;
	padding: 4px 8px;
	margin-left: 2px;
	border-radius: 4px;
}

@media only screen and (max-width: 770px) {
	.self-employed {
		font-size: 14px;
	}
	.button-copy {
		display: none;
	}
	.button-hidden {
		margin-right: -3px;
	}
}
</style>