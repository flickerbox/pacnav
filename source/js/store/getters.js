import _ from 'lodash'

export default {

	allItems: ( state, getters ) => (
		_.chain(state.itemWidths)
		 .keys()
		 .map(_.parseInt)
		 .value()
	),

	allItemsWidth: ( state, getters ) => _.reduce(
		getters.allItemsWidths,
		( totalWidth, width ) => totalWidth + width,
		0
	),

	allItemsWidths: ( state, getters ) => (
		_.values(state.itemWidths)
	),

	fixedItems: ( state, getters ) => (
		state.fixedItems || []
	),

	fixedItemsWidth: ( state, getters ) => _.reduce(
		getters.fixedItemsWidths,
		( totalWidth, width ) => totalWidth + width,
		0
	),

	fixedItemsWidths: ( state, getters ) => (
		_.chain(state.itemWidths)
		 .filter(( width, index ) => state.fixedItems.indexOf(index) !== -1)
		 .values()
		 .value()
	),

	mobileFormat: ( state, getters ) => (
		state.mobileFormat || 'default'
	),

	toggleWidth: ( state, getters ) => (
		state.toggleWidth || 0
	),

	unfixedItems: ( state, getters ) => (
		_.chain(state.itemWidths)
		 .filter(( width, index ) => state.fixedItems.indexOf(index) === -1)
		 .keys()
		 .map(_.parseInt)
		 .value()
	),

	unfixedItemsWidth: ( state, getters ) => _.reduce(
		getters.unfixedItemsWidths,
		( totalWidth, width ) => totalWidth + width,
		0
	),

	unfixedItemsWidths: ( state, getters ) => (
		_.chain(state.itemWidths)
		 .filter(( width, index ) => state.fixedItems.indexOf(index) === -1)
		 .values()
		 .value()
	),

}
