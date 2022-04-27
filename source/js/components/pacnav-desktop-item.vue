<template>
	<li
		v-bind="attributes"
		:class="classList"
		:style="styles"
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
			<template v-for="name of childSlots">
				<div :key="name" :slot="name">
					<slot :name="name"/>
				</div>
			</template>
		</pacnav-dropdown>

	</li>
</template>

<script>
import PacnavItem from './pacnav-item'

export default {

	name: 'pacnav-desktop-item',

	extends: PacnavItem,

	props: {
		index: {
			default: null,
			type: Number,
		},
	},

	computed: {
		styles() {
			const width = this.store.getters.itemWidth(this.index, false)
			return {
				width: `${width}px`,
			}
		},
	},

}
</script>
