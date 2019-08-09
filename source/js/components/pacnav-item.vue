<template>

	<li v-bind="attributes" :class="[itemClasses, {'has-hover': this.hover }]" @mouseover="mouseOver" @mouseleave="mouseOut">

		<a v-bind="linkAttributes" v-if="link" :href="link" :rel="rel">

			<div v-if="icon" class="PacnavDropdown-icon">
				<img :src="icon"/>
			</div>

			<div>
				<div v-if="label" class="PacnavDropdown-label" v-html="label"/>
				<span v-html="linkTitle"/>
				<p v-if="description">{{ description }}</p>
			</div>

		</a>
		<div v-else :class="linkClasses">

			<div v-if="icon" class="PacnavDropdown-icon">
				<img :src="icon"/>
			</div>

			<div>
				<div v-if="label" class="PacnavDropdown-label" v-html="label"/>
				<span v-html="linkTitle"/>
				<p v-if="description">{{ description }}</p>
			</div>

		</div>

		<ul v-if="children && children.length">
			<pacnav-item v-for="(item, index) of children" v-bind="item" :key="index"/>
		</ul>

		<slot/>

	</li>

</template>

<script>
	import URL from 'url-parse'

	export default {

		name: 'pacnav-item',

		props: {

			includeMargin: {
				default: true,
				type: Boolean,
			},
			children: {
				default: () => [],
				type: Array,
			},
			attributes: {
				default: () => {},
				type: Object,
			},
			linkAttributes: {
				default: () => {},
				type: Object,
			},
			linkTitle: {
				default: '',
				type: String,
			},
			link: {
				default: '/',
				type: String,
			},
			description: {
				default: '',
				type: String,
			},
			icon: {
				default: null,
				type: String,
			},
			label: {
				default: null,
				type: String,
			},
			itemClasses: {
				default: null,
				type: String,
			},

		},

		computed: {

			margin() {

				let margin = 0

				if(this.includeMargin) {
					margin = parseInt(this.style.marginLeft, 10) + parseInt(this.style.marginRight, 10)
				}

				return margin

			},

			rel() {

				let url = new URL(this.link)

				if(url.hostname != location.hostname) {
					return 'noopener'
				}

				return false

			},

			style() {

				return window.getComputedStyle(this.$el) || this.$el.currentStyle

			},

			width() {

				let rect = this.$el.getBoundingClientRect()
				return this.margin + (rect.width || rect.right - rect.left)

			},

			linkClasses() {
				let classes = ''

				if ('undefined' !== typeof this.linkAttributes) {
					classes = this.linkAttributes.class
				}

				return classes
			},

		},

		methods: {

			mouseOut(event) {
				this.hover = false

				if (event.currentTarget.classList.contains('has-children')) {
					this.$emit('PacNavMobileHover', {'hasHover' : this.hover, 'linkTitle' : ''})
				}

			},

			mouseOver(event) {
				this.hover = true

				if (event.currentTarget.classList.contains('has-children')) {
					this.$emit('PacNavMobileHover', {'hasHover' : this.hover, 'linkTitle' : this.linkTitle})
				}

			},

		},

		data() {

			return {
				hover: false
			}

		},

	}
</script>
