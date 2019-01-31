<template>

	<div :class="classList()">

		<ul v-if="items.length">

			<pacnav-item
				v-for="(item, index) of items"
				v-bind="item" :key="index"
				:class="itemClassList(item)"/>

		</ul>

		<slot name="featured"/>

	</div>

</template>

<script>
	export default {

		name: 'pacnav-dropdown',

		props: {

			items: {
				default: () => [],
				type: Array
			}

		},

		methods: {

			itemClassList( item ) {

				let preservedClasses = ''

				if (typeof item.attributes == 'object') {
					preservedClasses = item.attributes.class;
				}

				return {'has-children': item.children && item.children.length, [preservedClasses]: true}
			},

			classList() {

				let classes = [
					'PacnavDropdown'
				]

				return classes

			}

		}

	}
</script>
