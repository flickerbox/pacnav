<template>
	<svg width="20" height="20" viewBox="0 0 20 20">
		<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">

			<g v-if="state !== 'intermediate'" class="PacnavToggle-lines" fill="#000">
				<rect class="PacnavToggle-line1" x="0" y="4" width="20" height="2"/>
				<rect class="PacnavToggle-line2" x="0" y="9" width="20" height="2"/>
				<rect class="PacnavToggle-line3" x="0" y="9" width="20" height="2"/>
				<rect class="PacnavToggle-line4" x="0" y="14" width="20" height="2"/>
			</g>

			<g v-if="state === 'intermediate'" class="PacnavToggle-circles" fill="#000">
				<circle class="PacnavToggle-circle1" cx="3" cy="10" r="2"/>
				<circle class="PacnavToggle-circle2" cx="10" cy="10" r="2"/>
				<circle class="PacnavToggle-circle3"cx="17" cy="10" r="2"/>
			</g>

		</g>
	</svg>
</template>

<script>
export default {

	name: 'pacnav-toggle-icon',

	props: {

		state: {
			default: 'desktop',
			type: String,
		},

	},

}
</script>
