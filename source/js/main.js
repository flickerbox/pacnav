import Vuex from 'vuex'

/*
 * Components
 */

import _Pacnav from './components/pacnav'
import _PacnavDesktopItem from './components/pacnav-desktop-item'
import _PacnavDropdown from './components/pacnav-dropdown'
import _PacnavDropdownIcon from './components/pacnav-dropdown-icon'
import _PacnavItem from './components/pacnav-item'
import _PacnavMobile from './components/pacnav-mobile'
import _PacnavMobileItem from './components/pacnav-mobile-item'
import _PacnavPlaceholder from './components/pacnav-placeholder'
import _PacnavPlaceholderItem from './components/pacnav-placeholder-item'
import _PacnavToggle from './components/pacnav-toggle'
import _PacnavToggleIcon from './components/pacnav-toggle-icon'


export default new class Pacnav {

	install(Vue, options) {

		Vue.use(Vuex)

		Vue.component(_Pacnav.name, _Pacnav)
		Vue.component(_PacnavDesktopItem.name, _PacnavDesktopItem)
		Vue.component(_PacnavDropdown.name, _PacnavDropdown)
		Vue.component(_PacnavDropdownIcon.name, _PacnavDropdownIcon)
		Vue.component(_PacnavItem.name, _PacnavItem)
		Vue.component(_PacnavMobile.name, _PacnavMobile)
		Vue.component(_PacnavMobileItem.name, _PacnavMobileItem)
		Vue.component(_PacnavPlaceholder.name, _PacnavPlaceholder)
		Vue.component(_PacnavPlaceholderItem.name, _PacnavPlaceholderItem)
		Vue.component(_PacnavToggle.name, _PacnavToggle)
		Vue.component(_PacnavToggleIcon.name, _PacnavToggleIcon)

	}

}
