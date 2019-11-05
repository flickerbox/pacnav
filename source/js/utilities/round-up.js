export default function roundUp( number, precision = 2 ) {
	return Math.ceil(number * Math.pow(10, precision)) / Math.pow(10, precision)
}
