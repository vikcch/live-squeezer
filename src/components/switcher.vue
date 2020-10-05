<template>

	<div>
		<div
			v-show="isMobile"
			class="dummy"
		></div>
		<div class="switch switch-yellow">
			<input
				type="radio"
				class="switch-input"
				name="view"
				value="main"
				id="switch-main"
				checked=""
				@change="onChange"
			>
			<label
				for="switch-main"
				class="switch-label switch-label-off"
			>Input Data</label>
			<input
				type="radio"
				class="switch-input"
				name="view"
				value="aside"
				id="switch-aside"
				@change="onChange"
			>
			<label
				for="switch-aside"
				class="switch-label switch-label-on"
			>Hand History</label>
			<span class="switch-selection"></span>
		</div>

	</div>

</template>

<script>
import { head } from '../units/absx';
import vikFunctions from '../units/vikFunctions';

const parents = ['main', 'aside'];

export default {

	data() {

		return {

			parent: head(parents),

		}
	},

	methods: {

		onChange(event) {

			const { value } = event.currentTarget;

			const destination = `placeholder-switcher-${value}`;

			const app = head(this.$root.$children);

			const holder = app.$refs[destination];

			holder.appendChild(this.$el);

			//app.$refs['main'].style.display = 'block';
			//app.$refs['aside'].style.display = 'block';

			const destinationSuffix = parents[1 - parents.indexOf(value)];
			app.$refs[destinationSuffix].style.display = 'none';
			app.$refs[value].style.display = 'block';

			//this.$el.scrollIntoView({ behavior: 'smooth' });										
			this.$el.scrollIntoView();
			setTimeout(() => window.scrollBy(0, 0), 0);
		},

		onClick() {

			const destinationSuffix = parents[1 - parents.indexOf(this.parent)];

			const destination = `placeholder-switcher-${destinationSuffix}`;

			const app = head(this.$root.$children);

			const holder = app.$refs[destination];

			holder.appendChild(this.$el);

			this.parent = destinationSuffix;
		}
	},

	computed: {

		isMobile() {

			return vikFunctions.isMobileOrTablet()
		}

	}
}
</script>

<style scoped>
.dummy {
	height: 8px;
}

.switch {
	position: relative;
	margin: 0px auto;	
	height: 26px;
	width: 200px;
	/* background: rgba(0, 0, 0, 0.25); */
	border-radius: 3px;
	/* -webkit-box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3),
		0 1px rgba(255, 255, 255, 0.1);
	box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3),
		0 1px rgba(255, 255, 255, 0.1); */

	background: linear-gradient(180deg, #ededed 5%, #dfdfdf 100%);
	/* box-shadow: inset 1px 1px 0px 0px #ffffff; */
}

.switch-label {
	position: relative;
	z-index: 2;
	float: left;
	width: 98px;
	line-height: 26px;
	font-size: 11px;
	color: rgba(255, 255, 255, 0.35);
	text-align: center;
	text-shadow: 0 1px 1px rgba(0, 0, 0, 0.45);
	cursor: pointer;
}
.switch-label:active {
	font-weight: bold;
}

.switch-label-off {
	padding-left: 2px;
}

.switch-label-on {
	padding-right: 2px;
}

/*
 * Note: using adjacent or general sibling selectors combined with
 *       pseudo classes doesn't work in Safari 5.0 and Chrome 12.
 *       See this article for more info and a potential fix:
 *       http://css-tricks.com/webkit-sibling-bug/
 */
.switch-input {
	display: none;
}
.switch-input:checked + .switch-label {
	font-weight: bold;
	color: rgba(0, 0, 0, 0.65);
	text-shadow: 0 1px rgba(255, 255, 255, 0.25);
	-webkit-transition: 0.15s ease-out;
	-moz-transition: 0.15s ease-out;
	-o-transition: 0.15s ease-out;
	transition: 0.15s ease-out;
}
.switch-input:checked + .switch-label-on ~ .switch-selection {
	left: 100px;
	/* Note: left: 50% doesn't transition in WebKit */
}

.switch-selection {
	display: block;
	position: absolute;
	z-index: 1;
	top: 2px;
	left: 2px;
	width: 98px;
	height: 22px;
	background: #65bd63;
	border-radius: 3px;
	background-image: -webkit-linear-gradient(top, #9dd993, #65bd63);
	background-image: -moz-linear-gradient(top, #9dd993, #65bd63);
	background-image: -o-linear-gradient(top, #9dd993, #65bd63);
	background-image: linear-gradient(to bottom, #9dd993, #65bd63);
	-webkit-box-shadow: inset 0 1px rgba(255, 255, 255, 0.5),
		0 0 2px rgba(0, 0, 0, 0.2);
	box-shadow: inset 0 1px rgba(255, 255, 255, 0.5), 0 0 2px rgba(0, 0, 0, 0.2);
	-webkit-transition: left 0.15s ease-out;
	-moz-transition: left 0.15s ease-out;
	-o-transition: left 0.15s ease-out;
	transition: left 0.15s ease-out;
}
.switch-blue .switch-selection {
	background: #3aa2d0;
	background-image: -webkit-linear-gradient(top, #4fc9ee, #3aa2d0);
	background-image: -moz-linear-gradient(top, #4fc9ee, #3aa2d0);
	background-image: -o-linear-gradient(top, #4fc9ee, #3aa2d0);
	background-image: linear-gradient(to bottom, #4fc9ee, #3aa2d0);
}
.switch-yellow .switch-selection {
	background: #c4bb61;
	background-image: -webkit-linear-gradient(top, #e0dd94, #c4bb61);
	background-image: -moz-linear-gradient(top, #e0dd94, #c4bb61);
	background-image: -o-linear-gradient(top, #e0dd94, #c4bb61);
	background-image: linear-gradient(to bottom, #e0dd94, #c4bb61);
}
</style>