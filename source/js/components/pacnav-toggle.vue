<template>
	<li
		:class="classList"
		@click="onToggle"
		@mouseover="mouseOver"
		@mouseleave="mouseOut"
	>

		<pacnav-toggle-icon :state="state"/>

	</li>
</template>

<style>
.PacnavToggle.is-desktop {
	display: none;
}
</style>

<script>
export default {

	name: 'pacnav-toggle',

	props: {

		active: {
			default: false,
			type: Boolean,
		},
		state: {
			default: 'desktop',
			type: String,
		},
		store: {
			default: null,
			type: Object,
		},

	},

	watch: {

		active(newActive) {
			this.isActive = newActive
		},

	},

	computed: {

		classList() {

			let classes = [
				'PacnavToggle',
				`is-${this.state}`
			]

			if(this.isActive) {
				classes.push('is-active')
			}

			if(this.hasHover) {
				classes.push('has-hover')
			}

			return classes

		},

		margin() {

			const {
				marginLeft,
				marginRight,
			} = this.style

			return _.parseInt(marginLeft) + _.parseInt(marginRight)

		},

		style() {

			return window.getComputedStyle(this.$el) || this.$el.currentStyle

		},

		width() {

			const {
				left,
				right,
				width,
			} = this.$el.getBoundingClientRect()

			return this.margin + (width || (right - left))

		},

	},

	methods: {

		onToggle() {

			this.isActive = !this.isActive
			this.$emit('toggle', this.isActive)

		},

		mouseOut() {
			this.hasHover = false
			this.$emit('hover', false)
		},

		mouseOver() {
			this.hasHover = true
			this.$emit('hover', true)
		},

	},

	data() {

		return {
			isActive: false,
			hasHover: false,
		}

	},

	mounted() {

		this.store.dispatch('updateToggle', this.width)

	},

}
</script>
