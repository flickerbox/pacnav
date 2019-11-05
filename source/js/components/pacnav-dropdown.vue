<template>
	<div :class="classList">

		<ul v-if="items.length">
			<pacnav-item
				v-for="(item, index) of items"
				v-bind="item"
				:key="index"
			/>

		</ul>

		<slot/>

	</div>
</template>

<script>
import _ from 'lodash'
import countDepth from '../utilities/count-depth'

export default {

	name: 'pacnav-dropdown',

	props: {

		items: {
			default: () => [],
			type: Array,
		},

	},

	computed: {

		classList() {

			const classes = [
				'PacnavDropdown',
				`is-${ this.depth }-deep`,
			]

			return classes

		},

		depth() {

			return countDepth(this.items)

		},

	},

}
</script>
