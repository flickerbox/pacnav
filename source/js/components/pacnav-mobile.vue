<template>
	<div :class="classList">
		<ul>

			<pacnav-mobile-item
				v-for="(item, index) of items"
				v-bind="item"
				:key="index"
				:store="store"
			/>

		</ul>
	</div>
</template>

<script>
export default {

	name: 'pacnav-mobile',

	props: {

		active: {
			default: false,
			type: Boolean,
		},
		items: {
			default: () => [],
			type: Array,
		},
		store: {
			default: null,
			type: Object,
		},

	},

	computed: {

		classList() {

			const classes = [
				'PacnavMobile',
			]

			if(this.isActive) {
				classes.push('is-active')
			}

			return classes

		},

	},

	watch: {

		active(newActive) {
			this.isActive = newActive
		},

	},

	methods: {

	},

	data() {

		return {
			isActive: false,
		}

	},

	mounted() {
	}

}
</script>
