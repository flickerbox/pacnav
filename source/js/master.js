import Vue from 'vue'
import Vuex from 'vuex'

/*
 * Store
 */

import store from './store'

/*
 * Components
 */

import _Pacnav from './components/pacnav'
import _PacnavDesktopItem from './components/pacnav-desktop-item'
import _PacnavDropdown from './components/pacnav-dropdown'
import _PacnavItem from './components/pacnav-item'
import _PacnavMobile from './components/pacnav-mobile'
import _PacnavMobileItem from './components/pacnav-mobile-item'
import _PacnavPlaceholder from './components/pacnav-placeholder'
import _PacnavPlaceholderItem from './components/pacnav-placeholder-item'
import _PacnavToggle from './components/pacnav-toggle'


export default new class Pacnav {

	install(Vue, options) {

		Vue.use(Vuex)

		Vue.component(_Pacnav.name, _Pacnav)
		Vue.component(_PacnavDesktopItem.name, _PacnavDesktopItem)
		Vue.component(_PacnavDropdown.name, _PacnavDropdown)
		Vue.component(_PacnavItem.name, _PacnavItem)
		Vue.component(_PacnavMobile.name, _PacnavMobile)
		Vue.component(_PacnavMobileItem.name, _PacnavMobileItem)
		Vue.component(_PacnavPlaceholder.name, _PacnavPlaceholder)
		Vue.component(_PacnavPlaceholderItem.name, _PacnavPlaceholderItem)
		Vue.component(_PacnavToggle.name, _PacnavToggle)

	}

}
