<template>

	<div :class="classList()">
  	
  	<ul v-if="items.length">
      <pacnav-item v-for="(item, index) of items" v-bind="item" :key="index"/>
  	</ul>
    
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

  	classList() {

    	let classes = [
    		'PacnavDropdown'
  		]

  		return classes

  	}

  }

}
</script>
