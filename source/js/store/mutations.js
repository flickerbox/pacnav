import _ from 'lodash'
import roundUp from '../utilities/round-up'

export default {

	updateItem( state, { index, fixed, width } ) {

		const fixedIndex = state.fixedItems.indexOf(index)

		if(-1 !== fixedIndex) {
			if(!!fixed) {
				state.fixedItems.push(index)
			} else {
				state.fixedItems.splice(fixedIndex, 1)
			}
		}

		state.itemWidths = _.assign(
			{},
			state.itemWidths,
			{ [index]: roundUp(width) }
		)

	},

	updateToggle( state, width ) {
		state.toggleWidth = roundUp(width)
	}

}
