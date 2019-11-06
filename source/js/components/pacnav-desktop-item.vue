<template>
	<li
		v-bind="attributes"
		:class="classList"
		@mouseover="onMouseOver"
		@mouseleave="onMouseOut"
	>

		<component :is="componentType" v-bind="componentAttributes">

			<div v-if="icon" class="Pacnav-icon">
				<img :src="icon"/>
			</div>

			<div>
				<div v-if="label" class="Pacnav-label">{{ label }}</div>
				<span v-if="linkTitle">{{ linkTitle }}</span>
				<p v-if="description">{{ description }}</p>
			</div>

			<pacnav-dropdown-icon
				v-if="children && children.length"
				:active="hasHover"
			/>

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
