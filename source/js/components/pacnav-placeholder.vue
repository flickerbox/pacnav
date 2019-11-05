<template>
	<ul class="Pacnav-placeholder">

		<pacnav-placeholder-item
			v-for="(item, index) of items"
			v-bind="item"
			:key="index"
			:index="index"
			:store="store"
		/>

	</ul>
</template>

<style>
.Pacnav-placeholder {
	bottom: 0;
	left: 0;
	overflow: hidden;
	position: absolute;
	right: 0;
	top: 0;
	visibility: hidden;
	z-index: -1;
}
</style>

<script>
export default {

	name: 'pacnav-placeholder',

	props: {

		items: {
			default: () => [],
			type: Array,
		},
		store: {
			default: null,
			type: Object,
		},

	},

}
</script>
