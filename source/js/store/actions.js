import _ from 'lodash'

export default {

	updateItem( { commit, dispatch, state }, { index, fixed, width } ) {

		return new Promise(( resolve ) => {

			commit('updateItem', {
				index: _.parseInt(index),
				fixed: !!fixed,
				width: parseFloat(width),
			})

			resolve()

		})

	},

	updateToggle( { commit, dispatch, state }, width ) {

		return new Promise(( resolve ) => {

			commit('updateToggle', parseFloat(width))
			resolve()

		})

	},

}
