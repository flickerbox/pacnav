<template>
	<li v-bind="attributes" :class="classList">
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
	</li>
</template>

<script>
import _ from 'lodash'
import URL from 'url-parse'
import PacnavItem from './pacnav-item'
import countDepth from '../utilities/count-depth'

export default {

	name: 'pacnav-placeholder-item',

	extends: PacnavItem,

	props: {

		index: {
			default: 0,
			type: Number,
		},
		store: {
			default: null,
			type: Object,
		},

	},

	methods: {

		updateItem() {

			this.store.dispatch('updateItem', {
				index: this.index,
				fixed: this.fixed,
				margin: this.margin,
				width: this.width,
			})

		},

	},

	created() {

		document.addEventListener('readystatechange', this.updateItem)
		window.addEventListener('resize', this.updateItem)
		window.addEventListener('orientationchange', this.updateItem)

	},

	destroyed() {

		document.removeEventListener('readystatechange', this.updateItem)
		window.removeEventListener('resize', this.updateItem)
		window.removeEventListener('orientationchange', this.updateItem)

	},

	mounted() {

		this.updateItem()

	},

}
</script>
