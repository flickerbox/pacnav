<template>
	<div :class="classList">

		<ul v-if="items.length">
			<pacnav-item
				v-for="(item, index) of items"
				v-bind="item"
				:key="index"
			>
				<slot :name="item.id"/>
				<template v-for="id of getItemSlots(item)">
					<div :key="id" :slot="id">
						<slot :name="id"/>
					</div>
				</template>
			</pacnav-item>

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

	methods: {

		getItemSlots( item ) {
			const slots = []

			if (item.children) {
				item.children.forEach((child) => {
					if (child.id in this.$slots) {
						slots.push(child.id)
					}
					slots.push(...this.getItemSlots(child))
				})
			}

			return slots
		},

	},

}
</script>
