<template>
	<li :class="classList()" @click="onToggle">

		<svg width="20px" height="20px" viewBox="0 0 20 20">
			<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">

			    <g v-if="state != 'intermediate'" class="PacnavToggle-lines" fill="#000">
			        <rect class="PacnavToggle-line1" x="0" y="4" width="20" height="2"></rect>
			        <rect class="PacnavToggle-line2" x="0" y="9" width="20" height="2"></rect>
			        <rect class="PacnavToggle-line3" x="0" y="9" width="20" height="2"></rect>
			        <rect class="PacnavToggle-line4" x="0" y="14" width="20" height="2"></rect>
			    </g>

			    <g v-if="state == 'intermediate'" class="PacnavToggle-circles" fill="#000">
			        <circle class="PacnavToggle-circle1" cx="3" cy="10" r="2"></circle>
			        <circle class="PacnavToggle-circle2" cx="10" cy="10" r="2"></circle>
			        <circle class="PacnavToggle-circle3"cx="17" cy="10" r="2"></circle>
			    </g>

		    </g>
		</svg>

		<slot/>

	</li>
</template>

<style>
.PacnavToggle:not(.is-mounted) {
  visibility: hidden;
}

.PacnavToggle.is-mounted.is-desktop {
  display: none;
}
</style>

<script>
export default {
  
  name: 'pacnav-toggle',

	props: {

    includeMargin: {
      default: true,
      type: Boolean
    },
		active: {
			default: false,
			type: Boolean
		},
		mounted: {
			default: false,
			type: Boolean
		},
		state: {
  		default: 'desktop',
  		type: String
		}

	},

	computed: {

  	margin() {

      let margin = 0

  		if(this.includeMargin) {
    		margin = parseInt(this.style.marginLeft, 10) + parseInt(this.style.marginRight, 10)
      }

      return margin

  	},

  	style() {

    	return window.getComputedStyle(this.$el) || this.$el.currentStyle

  	},

  	width() {

      let rect = this.$el.getBoundingClientRect()
      return this.margin + (rect.width || rect.right - rect.left)

  	}

  },

	methods: {

  	classList() {

    	let classes = [
    		'PacnavToggle',
        `is-${this.state}`
  		]

  		if(this.isActive) {
    		classes.push('is-active')
  		}

  		if(this.mounted) {
    		classes.push('is-mounted')
  		}

  		return classes

  	},

		onToggle() {

			this.isActive = !(this.active || this.isActive)
			this.$emit('toggle', this.isActive)

		}

	},

	data() {

		return {
			isActive: false
		}

	}

}
</script>
