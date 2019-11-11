<template>
	<li
		v-bind="attributes"
		:class="classList"
		@mouseover="onMouseOver"
		@mouseleave="onMouseOut"
	>

		<component :is="componentType" v-bind="componentAttributes">

			<div v-if="icon" class="PacnavDropdown-icon">
				<img :src="icon"/>
			</div>

			<div>
				<div v-if="label" class="PacnavDropdown-label">{{ label }}</div>
				<span v-if="linkTitle">{{ linkTitle }}</span>
				<p v-if="description">{{ description }}</p>
			</div>

		</component>

		<ul v-if="children && children.length">
			<pacnav-item
				v-for="(item, index) of children"
				v-bind="item"
				:key="index"
			/>
		</ul>

	</li>
</template>

<script>
import _ from 'lodash'
import URL from 'url-parse'
import hasWidth from '../mixins/has-width'
import countDepth from '../utilities/count-depth'

export default {

	name: 'pacnav-item',

	mixins: [
		hasWidth,
	],

	props: {

		attributes: {
			default: () => {},
			type: Object,
		},
		children: {
			default: () => [],
			type: Array,
		},
		link: {
			default: null,
			type: String,
		},
		linkAttributes: {
			default: () => {},
			type: Object,
		},
		linkTitle: {
			default: null,
			type: String,
		},
		description: {
			default: null,
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

	},

	computed: {

		classList( item ) {

			const classes = [
				..._.castArray(_.get(this.attributes, 'class', [])),
			]

			if(this.depth) {
				classes.push(`is-${ this.depth }-deep`)
			}

			if(this.children.length) {
				classes.push('has-children')
			}

			if(this.hasHover) {
				classes.push('has-hover')
			}

			return classes
		},

		componentAttributes() {

			let attributes = {}

			if(this.link) {
				attributes = _.assign(attributes, this.linkAttributes)
				attributes.href = this.link
				attributes.rel = this.rel
			}

			if(this.linkClassList.length) {
				attributes.class = this.linkClassList
			}

			return attributes

		},

		componentType() {

			return this.link && 'a' || 'div'

		},

		depth() {

			return countDepth(this.children)

		},

		fixed() {
			return this.classList && this.classList.indexOf('is-fixed') !== -1
		},

		linkClassList() {

			const classes = _.get(this.linkAttributes, 'class', [])
			return classes
		},

		rel() {

			const url = new URL(this.link)

			if(url.hostname !== location.hostname) {
				return 'noopener'
			}

			return false

		},

	},

	methods: {

		onMouseOut() {
			this.hasHover = false
			this.$emit('hover', false)

		},

		onMouseOver() {
			this.hasHover = true
			this.$emit('hover', true)

		},

	},

	data() {

		return {
			hasHover: false,
		}

	},

}
</script>
