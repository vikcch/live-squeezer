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

		<p>Convert live and tv poker hands to a PokerStars Hand History file format.</p>

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
	background-color: #333333;
	padding: 16px 4px;
	color: white;
	margin-bottom: 8px;	
}

.logo {
	font-size: 28px;
}
</style>