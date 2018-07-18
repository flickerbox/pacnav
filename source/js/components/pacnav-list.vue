<template>

  <ul>
    
    <pacnav-item v-for="(item, index) of items" v-bind="item" :key="index"/>
    
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

	}

}
</script>
