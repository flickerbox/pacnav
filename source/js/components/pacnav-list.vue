<template>

	<ul>
		
		<pacnav-item 
			v-for="(item, index) of items" v-bind="item"
			:class="itemClassList(item)"
			:key="index"/>
		
	</ul>

</template>

<script>
export default {
	
	name: 'pacnav-list',
	
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

	}

}
</script>
