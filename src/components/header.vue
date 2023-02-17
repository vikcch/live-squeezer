<template>

	<header>

		<div class="divorced">

			<p class="logo">Live Squeezer</p>

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

		<p>Efficiently convert live and television poker hands into the PokerStars Hand History log format for record keeping and analysis.</p>

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
	background-color: #333333;
	padding: 20px 4px;
	color: white;
	margin-bottom: 8px;
}

.logo {
	font-size: 28px;
}

.github {
	position: absolute;
	top: 2px;
	right: 2px;
}
</style>