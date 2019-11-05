import _ from 'lodash'

export default function countDepth( items, depth = 1 ) {

	let childDepth = depth

	_.each(items, ( item ) => {

		let children = _.get(item, 'children', [])

		if(children.length > 0) {
			const itemDepth = countDepth(children, depth + 1)

			if( itemDepth > childDepth ) {
				childDepth = itemDepth
			}
		}

	})

	return childDepth

}
