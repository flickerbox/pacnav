<template>

	<div :class="classList()">

		<ul v-if="items.length">

			<pacnav-item
				v-for="(item, index) of items"
				v-bind="item" :key="index"
				:class="itemClassList(item)"/>

		</ul>

		<slot name="content"/>

	</div>

</template>

<script>
import _ from 'lodash'

export default {

	name: 'pacnav-dropdown',

	props: {

		items: {
			default: () => [],
			type: Array
		},

	},

	computed: {

		depth() {

			return this.countDepth(this.items, 1)

		},

	},

	methods: {

		countDepth( items, depth = 0 ) {

			let childDepth = depth

			_.each(items, ( { children = [] } ) => {

				if( children.length > 0 ) {
					const itemDepth = this.countDepth(children, depth + 1)

					if( itemDepth > childDepth ) {
						childDepth = itemDepth
					}
				}

			})

			return childDepth

		},

		itemClassList( item ) {

			let preservedClasses = ''

			if (typeof item.attributes == 'object') {
				preservedClasses = item.attributes.class;
			}

			return {'has-children': item.children && item.children.length, [preservedClasses]: true}
		},

		classList() {

			let classes = [
				'PacnavDropdown',
				`is-${ this.depth }-deep`,
			]

			return classes

		}

	}

}
</script>
