<template>
	<nav :class="classList">

		<ul>

			<pacnav-desktop-item
				v-for="(item, index) of visibleItems"
				v-bind="item"
				:key="index"
				:children="[]"
			>
				<slot :name="getSlot(index)"/>
			</pacnav-desktop-item>

			<pacnav-toggle
				:active="isActive"
				:state="state"
				:store="store"
				@toggle="onToggle"
			>
				<pacnav-dropdown v-if="'intermediate' === state" :items="hiddenItems"/>
			</pacnav-toggle>

		</ul>

		<pacnav-placeholder
			:items="items"
			:store="store"
		/>

		<pacnav-mobile
			v-if="'mobile' === state"
			:items="mobileItems.length && mobileItems || items"
		/>

	</nav>
</template>

<style>
.Pacnav {
	position: relative;
}

.Pacnav > ul {
	display: flex;
	flex-wrap: wrap;
	width: 100%;
}
</style>

<script>
import Vuex from 'vuex'
import store from '../store'
import hasWidth from '../mixins/has-width'

export default {

	name: 'pacnav',

	mixins: [
		hasWidth,
	],

	props: {

		items: {
			default: () => [],
			type: Array,
		},
		mobileItems: {
			default: () => [],
			type: Array,
		},
		minVisible: {
			default: 2,
			type: Number,
		},
		minWidth: {
			default: 840,
			type: Number,
		},
		showFixedOnMobile: {
			default: true,
			type: Boolean,
		},

	},

	computed: {

		classList() {

			const classes = [
				'Pacnav',
				`is-${this.state}`
			]

			if(this.isActive) {
				classes.push('is-active')
			}

			if(this.isMounted) {
				classes.push('is-mounted')
			}

			return classes

		},

		isMounted() {
			return this.items.length === this.store.getters.allItemsWidths.length
		},

		hiddenItems() {
			return _.filter(this.items, ( item, index ) => !this.isVisible(index))
		},

		fixedItemsWidth() {
			return this.store.getters.fixedItemsWidth
		},

		unfixedItems() {
			return this.store.getters.unfixedItems
		},

		unfixedItemsWidths() {
			return this.store.getters.unfixedItemsWidths
		},

		toggleWidth() {
			return this.store.state.toggleWidth
		},

		state() {

			const hasFewerVisibleThanMin = ( this.visible < this.minVisible )
			const hasFewerVisibleThanMax = ( this.visible < this.unfixedItems.length )
			const hasAtleastMin = ( this.unfixedItems.length >= this.minVisible )
			const isWindowMobile = ( this.windowWidth < this.minWidth )

			if( (hasAtleastMin && hasFewerVisibleThanMin) || isWindowMobile ) {
				return 'mobile'
			} else if( hasAtleastMin && hasFewerVisibleThanMax ) {
				return 'intermediate'
			} else {
				return 'desktop'
			}

		},

		visible() {

			let visible = 0
			let width = this.fixedItemsWidth

			for(let itemWidth of this.unfixedItemsWidths) {
				width += itemWidth

				let isLastItem = ( visible === this.unfixedItemsWidths.length - 1 )
				let hasExceededWidth = ( width > this.width )
				let hasExceededWidthWithToggle = ( width + this.toggleWidth > this.width )

				if((isLastItem && hasExceededWidth) || (!isLastItem && hasExceededWidthWithToggle)) {
					break
				}

				visible++
			}

			console.log(width)

			return visible

		},

		showFixed() {
			return 'mobile' !== this.state || ('mobile' === this.state && this.showFixedOnMobile)
		},

		visibleItems() {
			if(this.isMounted) {
				return _.filter(this.items, ( item, index ) => this.isVisible(index))
			}

			return this.items
		},

	},

	methods: {

		getSlot( index ) {
			return `item-${ index }`
		},

		handleResize() {

			this.windowWidth = window.innerWidth
			this.setBodyClass()

		},

		isVisible( index ) {

			const visibleItems = _.slice(this.unfixedItems, 0, this.visible)
			const isMobile = ( 'mobile' === this.state )
			const isFixed = ( -1 !== _.indexOf(this.fixedItems, index) )
			const isVisible = ( -1 !== _.indexOf(visibleItems, index) )

			return (isVisible && !isMobile) || (isFixed && this.showFixed)

		},

		onToggle(active) {

			this.isActive = active
			this.setBodyClass()

		},

		setBodyClass() {

			if(this.state === 'mobile' && !document.body.classList.contains('Pacnav--is-mobile')) {
				document.body.classList.add('Pacnav--is-mobile')
			} else if(this.state !== 'mobile' && document.body.classList.contains('Pacnav--is-mobile')) {
				document.body.classList.remove('Pacnav--is-mobile')
			}

			if(this.state === 'mobile' && this.isActive) {
				document.body.classList.add('Pacnav--is-active')
			} else if(document.body.classList.contains('Pacnav--is-active')) {
				document.body.classList.remove('Pacnav--is-active')
			}

		},

	},

	data() {

		return {
			isActive: false,
			store: new Vuex.Store(store),
			windowWidth: 0,
		}

	},

	created() {

		document.addEventListener('readystatechange', this.handleResize)
		window.addEventListener('resize', this.handleResize)
		window.addEventListener('orientationchange', this.handleResize)

	},

	destroyed() {

		document.removeEventListener('readystatechange', this.handleResize)
		window.removeEventListener('resize', this.handleResize)
		window.removeEventListener('orientationchange', this.handleResize)

	},

	mounted() {

		this.handleResize()

	}

}
</script>
