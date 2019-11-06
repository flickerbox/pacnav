<template>
	<svg :class="{ 'PacnavDropdownIcon': true, 'is-active': active }" width="16" height="10" viewBox="0 0 16 10">
		<g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="square" stroke-width="2">
			<line x1="8" x2="3" y1="7.5" y2="2.5"/>
			<line x1="8" x2="13" y1="7.5" y2="2.5"/>
		</g>
	</svg>
</template>

<script>
export default {

	name: 'pacnav-dropdown-icon',

	props: {

		active: {
			default: false,
			type: Boolean,
		},

	},

}
</script>
