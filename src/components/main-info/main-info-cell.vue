<template>
	<div class="cell">

		<label class="train">
			<span>{{props.slotAttrs.label}}</span>

			<i
				v-if="props.slotAttrs.info"
				class="fa fa-info-circle text-info lm-s"
				@click.prevent="showInfo"
				aria-hidden="true"
			></i>

			<input
				v-if="props.slotAttrs.optional"
				class="absolute-right"
				type="checkbox"
				v-model="enabled"
				@change="optional_Change"
			>

			<!-- NOTE:: Valor apenas para straddles e atribuido em App.vue > ease/shortcuts -->
			<span
				ref="status"
				v-if="props.slotAttrs.status"
				class="status status-short-cut"
			></span>

			<component
				:is="props.slotAttrs.el"
				:attrs="{...props.slotAttrs, enabled}"
			></component>

		</label>

	</div>
</template>

<script>
import MiInput from './main-info-input.vue';
import MiSelect from './main-info-select.vue';
import SettingsStore from '@/store/simple/settings';

export default {
	props: ['props'],

	components: {
		'app-mi-input': MiInput,
		'app-mi-select': MiSelect,
	},

	data() {

		return {
			enabled: false,
			SettingsStoreData: SettingsStore.data,
		}
	},

	computed: {

		optionalTime: {
			// NOTE:: Precisa de uma prop (parent) no "data()" para ficar "reactive"
			get() {
				return SettingsStore.getters.optionalTime;
			},

			set(value) {
				SettingsStore.setters.optionalTime = value;
			}
		},
	},

	methods: {

		showInfo() {

			const { view } = this.$root.$data;

			this.choice({
				stakes: () => view.showStakesInfoPopup(),
				perspective: () => view.showPerspectiveInfoPopup()
			});
		},

		optional_Change() {

			const text = this.enabled ? '' : this.props.slotAttrs.text;

			// NOTE:: Nem todos os inputs tém "EventVue.$on"
			window.EventVue.$emit(`${this.props.slotAttrs.key}MainInfoText`, text);
		},

		choice(props) {

			const { key } = this.props.slotAttrs;

			const work = { ...props };

			key in work && work[key].call();
		}
	},

	watch: {

		enabled(value) {

			this.choice({ handTime: () => this.optionalTime = value });
		}
	},

	mounted() {

		this.choice({
			handTime: () => {
				this.enabled = this.optionalTime;
				this.optional_Change();
			}
		});

	}

}
</script>

<style scoped>
label {
	display: block;
	position: relative;
}

.input--main-info {
	height: 28px;
	/* width: 107px; */
	text-align: center;
	margin-bottom: 4px;
	width: 100%;
}
.absolute-right {
	position: absolute;
	right: 0px;
	top: 2px;
}
.status {
	margin-left: 4px;
	font-size: 12px;
	color: black;
}
.status-short-cut::after {
	content: "F4";
	font-size: 10px;
	color: #cccccc;
	margin-left: 4px;
	vertical-align: 4px;
	font-weight: normal;
}
</style>
