<template>
	<li
		v-bind="attributes"
		:class="classList"
		@mouseover="onMouseOver"
		@mouseleave="onMouseOut"
	>

		<div class="PacnavMobile-back" @click="onClickBack"/>

		<component :is="componentType" v-bind="componentAttributes" @click="onClick">

			<div v-if="icon" class="PacnavDropdown-icon">
				<img :src="icon"/>
			</div>

			<div>
				<div v-if="label" class="PacnavDropdown-label">{{ label }}</div>
				<span v-if="linkTitle">{{ linkTitle }}</span>
				<p v-if="description">{{ description }}</p>
			</div>

		</component>

		<ul v-if="children && children.length">
			<pacnav-mobile-item
				v-for="(item, index) of children"
				v-bind="item"
				:key="index"
				:store="store"
			/>
		</ul>

	</li>
</template>

<script>
import PacnavItem from './pacnav-item'

export default {

	name: 'pacnav-mobile-item',

	extends: PacnavItem,

	computed: {

		classList( item ) {

			const classes = [
				..._.castArray(_.get(this.attributes, 'class', [])),
				`is-${ this.depth }-deep`,
			]

			if(this.children.length) {
				classes.push('has-children')
			}

			if(this.hasHover) {
				classes.push('has-hover')
			}

			if(this.isActive) {
				classes.push('is-active')
			}

			return classes
		},

		mobileFormat() {
			return this.store.getters.mobileFormat
		},

	},

	methods: {

		onClick( event ) {

			if('paged' === this.mobileFormat && !this.isActive) {
				this.isActive = true
				this.$emit('active', true)
				event.preventDefault()
			}

		},

		onClickBack() {

			if('paged' === this.mobileFormat && this.isActive) {
				this.isActive = false
				this.$emit('active', false)
			}

		},

	},

	data() {

		return {
			isActive: false,
		}

	},

}
</script>
