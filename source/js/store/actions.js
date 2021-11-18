import _ from 'lodash'

export default {

	updateItem( { commit, dispatch, state }, { index, fixed, width, margin } ) {

		return new Promise(( resolve ) => {

			commit('updateItem', {
				index: _.parseInt(index),
				fixed: !!fixed,
				margin: parseFloat(margin),
				width: parseFloat(width),
			})

			resolve()

		})

	},

	updateMobileFormat( { commit, dispatch, state }, format ) {

		return new Promise(( resolve ) => {

			commit('updateMobileFormat', _.toString(format))
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
