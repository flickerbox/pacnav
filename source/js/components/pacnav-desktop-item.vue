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

		<pacnav-dropdown v-if="children && children.length" :items="children">
			<slot/>
		</pacnav-dropdown>

	</li>
</template>

<script>
import PacnavItem from './pacnav-item'

export default {

	name: 'pacnav-desktop-item',

	extends: PacnavItem,

}
</script>
