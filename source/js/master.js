/*
 * Components
 */

import _Pacnav from './components/pacnav'
import _PacnavDropdown from './components/pacnav-dropdown'
import _PacnavItem from './components/pacnav-item'
import _PacnavToggle from './components/pacnav-toggle'


export default new class Pacnav {

	install(Vue, options) {

		Vue.component(_Pacnav.name, _Pacnav)
		Vue.component(_PacnavDropdown.name, _PacnavDropdown)
		Vue.component(_PacnavItem.name, _PacnavItem)
		Vue.component(_PacnavToggle.name, _PacnavToggle)

	}

}
