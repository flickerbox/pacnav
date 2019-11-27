import actions from './actions'
import getters from './getters'
import mutations from './mutations'

export default {

	state: {
		mobileFormat: 'default',
		fixedItems: [],
		itemWidths: {},
		toggleWidth: 0,
	},

	actions,

	getters,

	mutations,

}
