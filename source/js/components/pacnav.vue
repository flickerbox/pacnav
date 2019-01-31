<template>

	<div :class="classList()">

		<ul>

			<pacnav-item
				v-for="(item, index) of items"
				v-if="isVisible(index)"
				v-bind="item.attributes"
				:key="index"
				:class="itemClassList(item)"
				:link="item.link"
				:link-title="item.linkTitle"
				:link-attributes="item.linkAttributes"
				:attributes="item.attributes"
				:include-margin="item.includeMargin">

				<pacnav-dropdown v-if="item.children && item.children.length" :items="item.children">

					<div slot="featured">

						<slot
							v-if="item.featured_post"
							:name="getSlot(item.item_id)"/>

					</div>

				</pacnav-dropdown>


			</pacnav-item>

			<pacnav-toggle :active="isActive" :mounted="isMounted" :state="state" :includeMargin="includeToggleMargin" @toggle="onToggle">
				<pacnav-dropdown v-if="state == 'intermediate'" :items="hiddenItems()"/>
			</pacnav-toggle>

		</ul>

		<div v-if="isMounted && state == 'mobile'" class="PacnavMobile">

			<ul>
				<pacnav-item
					v-for="(item, index) of mobileItems()"
					v-bind="item"
					:class="itemClassList(item)"
					:key="index"/>
			</ul>

		</div>

	</div>

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
	export default {

		name: 'pacnav',

		props: {
			items: {
				default: () => [],
				type: Array
			},
			minVisible: {
				default: 2,
				type: Number
			},
			minWidth: {
				default: 840,
				type: Number
			},
			includeToggleMargin: {
				default: true,
				type: Boolean
			},
			showFixedOnMobile: {
				default: true,
				type: Boolean
			}
		},

		methods: {

			getSlot( item_id ) {
				return `item-${ item_id }`
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

			getAllItems() {

				if(this.$children.length) {

					let $items = this.$children.filter($item => $item.$options._componentTag == 'pacnav-item')

					return $items.reduce((items, child, index) => {
						items.push({
							index: index,
							fixed: child.$el.classList.contains('is-fixed'),
							width: child.width
						})
						return items
					}, [])

				} else {

					return []

				}

			},

			getFixedItems() {

				return this.allItems.filter(item => item.fixed)

			},

			getUnfixedItems() {

				return this.allItems.filter(item => !item.fixed)

			},

			getAllItemsWidth() {

				return this.allItems.reduce((total, item) => total + item.width, 0)

			},

			getFixedItemsWidth() {

				return this.fixedItems.reduce((total, item) => total + item.width, 0)

			},

			getUnfixedItemsWidth() {

				return this.unfixedItems.reduce((total, item) => total + item.width, 0)

			},

			getNumberVisible() {

				let visible = 0
				let width = this.fixedItemsWidth

				for(let item of this.unfixedItems) {
					width += item.width

					let isLastItem = (visible == this.unfixedItems.length - 1)
					let itemOverWidth = (width + this.toggleWidth > this.width)
					let lastItemOverWidth = (width > this.width)

					if(isLastItem) {
						if(lastItemOverWidth) {
							break
						}
					} else if(itemOverWidth) {
						break
					}

					visible++
				}

				return visible

			},

			getState() {

				const hasFewerVisibleThanMin = ( this.numberVisible < this.minVisible )
				const hasFewerVisibleThanTotal = ( this.numberVisible < this.unfixedItems.length )
				const hasAtleastMin = ( this.unfixedItems.length >= this.minVisible )
				const isWindowMobile = ( this.windowWidth < this.minWidth )

				if( (hasAtleastMin && hasFewerVisibleThanMin) || isWindowMobile ) {
					return 'mobile'
				} else if( hasAtleastMin && hasFewerVisibleThanTotal ) {
					return 'intermediate'
				} else {
					return 'desktop'
				}

			},

			getToggleWidth() {

				if(this.$children && this.$children.length) {

					let $toggle = this.$children.filter($item => $item.$options._componentTag == 'pacnav-toggle').shift()
					return $toggle.width

				} else {

					return 0

				}

			},

			computeWidths() {

				this.allItems = this.getAllItems()
				this.fixedItems = this.getFixedItems()
				this.unfixedItems = this.getUnfixedItems()
				this.allItemsWidth = this.getAllItemsWidth()
				this.fixedItemsWidth = this.getFixedItemsWidth()
				this.unfixedItemsWidth = this.getUnfixedItemsWidth()
				this.toggleWidth = this.getToggleWidth()

			},

			computeVisible() {

				this.numberVisible = this.getNumberVisible()
				this.state = this.getState()

			},

			handleResize() {

				this.windowWidth = window.innerWidth
				this.width = this.$el.clientWidth

				this.computeVisible()
				this.setBodyClass()

			},

			onToggle(isActive) {

				this.isActive = isActive
				this.setBodyClass()

			},

			setBodyClass() {

				if(this.state == 'mobile' && !document.body.classList.contains('Pacnav--is-mobile')) {
					document.body.classList.add('Pacnav--is-mobile')
				} else if(this.state != 'mobile' && document.body.classList.contains('Pacnav--is-mobile')) {
					document.body.classList.remove('Pacnav--is-mobile')
				}

				if(this.state == 'mobile' && this.isActive && !document.body.classList.contains('Pacnav--is-active')) {
					document.body.classList.add('Pacnav--is-active')
				} else if(document.body.classList.contains('Pacnav--is-active')) {
					document.body.classList.remove('Pacnav--is-active')
				}

			},

			isVisible(index) {

				let visible = true

				if(this.allItems.length && this.unfixedItems.length) {

					let item = this.allItems[index]
					let lastItemVisible = this.unfixedItems[this.numberVisible - 1]

					if(item && item.fixed) {
						visible = this.showFixedOnMobile
					} else if(item && lastItemVisible) {
						visible = (this.state != 'mobile' && item.index <= lastItemVisible.index)
					} else if(!this.numberVisible) {
						visible = false
					}

				}

				return visible

			},

			hiddenItems() {

				return this.items.filter((item, index) => !this.isVisible(index))

			},

			mobileItems() {

				return this.items.filter((item, index) => {
					return (!this.hasFixedClass(item) || !this.showFixedOnMobile)
				})

			},

			hasFixedClass(item) {

				if(item.attributes && item.attributes.class) {
					return item.attributes.class.includes('is-fixed')
				}

				return false

			}

		},

		data() {

			return {
				isActive: false,
				isMounted: false,
				state: 'desktop',
				numberVisible: this.items.length,
				allItems: [],
				fixedItems: [],
				unfixedItems: [],
				allItemsWidth: 0,
				fixedItemsWidth: 0,
				unfixedItemsWidth: 0,
				toggleWidth: 0,
				windowWidth: 0,
				width: 0
			}

		},

		created() {

			window.addEventListener('resize', this.handleResize)
			window.addEventListener('orientationchange', this.handleResize)

		},

		destroyed() {

			window.removeEventListener('resize', this.handleResize)
			window.removeEventListener('orientationchange', this.handleResize)

		},

		mounted() {

			this.computeWidths()
			this.handleResize()

			this.isMounted = true

		}

	}
</script>
