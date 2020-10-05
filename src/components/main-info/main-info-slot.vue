<template>
	<div>
		<div			
			:key="index"
			v-for="(attrs, index) in attributes_"
		>
			<slot :slotAttrs="attrs"></slot>
		</div>
	</div>
</template>

<script>
export default {
	props: ['attributes_'],

}

</script>

<style>
</style>