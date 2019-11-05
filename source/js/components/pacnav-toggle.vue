<template>
	<li
		:class="classList"
		@click="onToggle"
		@mouseover="mouseOver"
		@mouseleave="mouseOut"
	>

		<svg width="20px" height="20px" viewBox="0 0 20 20">
			<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">

				<g v-if="state !== 'intermediate'" class="PacnavToggle-lines" fill="#000">
					<rect class="PacnavToggle-line1" x="0" y="4" width="20" height="2"/>
					<rect class="PacnavToggle-line2" x="0" y="9" width="20" height="2"/>
					<rect class="PacnavToggle-line3" x="0" y="9" width="20" height="2"/>
					<rect class="PacnavToggle-line4" x="0" y="14" width="20" height="2"/>
				</g>

				<g v-if="state === 'intermediate'" class="PacnavToggle-circles" fill="#000">
					<circle class="PacnavToggle-circle1" cx="3" cy="10" r="2"/>
					<circle class="PacnavToggle-circle2" cx="10" cy="10" r="2"/>
					<circle class="PacnavToggle-circle3"cx="17" cy="10" r="2"/>
				</g>

			</g>
		</svg>

		<slot/>

	</li>
</template>

<style>
.PacnavToggle.is-desktop {
	display: none;
}
</style>

<script>
import Pacnav from '../index'

export default {

	name: 'pacnav-toggle',

	props: {

		active: {
			default: false,
			type: Boolean
		},
		state: {
			default: 'desktop',
			type: String
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
