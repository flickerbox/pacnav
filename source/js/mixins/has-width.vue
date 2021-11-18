<script>
import _ from 'lodash'

export default {

	methods: {

		width__getMargin() {

			const {
				marginLeft,
				marginRight,
			} = this.width__getStyle()

			return _.parseInt(marginLeft) + _.parseInt(marginRight)

		},

		width__getRect() {

			return this.$el && this.$el.getBoundingClientRect()

		},

		width__getStyle() {

			return window.getComputedStyle(this.$el) || this.$el.currentStyle

		},

		width__getWidth() {

			const {
				left,
				right,
				width,
			} = this.width__getRect()

			return width || (right - left)

		},

		width__handleResize() {

			this.margin = this.width__getMargin()
			this.width = this.width__getWidth()

		},

	},

	data() {

		return {
			margin: 0,
			width: 0,
		}

	},

	created() {

		document.addEventListener('readystatechange', this.width__handleResize)
		window.addEventListener('resize', this.width__handleResize)
		window.addEventListener('orientationchange', this.width__handleResize)

	},

	destroyed() {

		document.removeEventListener('readystatechange', this.width__handleResize)
		window.removeEventListener('resize', this.width__handleResize)
		window.removeEventListener('orientationchange', this.width__handleResize)

	},

	mounted() {

		this.width__handleResize()

	},

}
</script>
