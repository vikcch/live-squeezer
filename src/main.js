import Controller from './controller.js';
import Model from './model.js';
import View from './view.js';
import SettingsStore from './store/simple/settings';

import Vue from 'vue';

Vue.config.productionTip = false;

if (process.env.NODE_ENV === "development") {
    // https://012.vuejs.org/api/global-api.html
    Vue.config.devtools = true;
}

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
Vue.use(VueSweetalert2);

import VModal from 'vue-js-modal';
Vue.use(VModal);

window.EventVue = new Vue;

SettingsStore.methods.tryCreateSettings();
SettingsStore.methods.loadSettings();

new Controller(new Model, new View);

import './assets/global.css';
import './assets/button.css';
import './assets/button-icon.css';
import './assets/popup.css';
import './assets/small-cards.css';

/* eslint-disable-next-line */
console.log(`%c
██╗     ██╗██╗   ██╗███████╗ ███████╗ ██████╗ ██╗   ██╗███████╗███████╗███████╗███████╗██████╗ 
██║     ██║██║   ██║██╔════╝ ██╔════╝██╔═══██╗██║   ██║██╔════╝██╔════╝╚══███╔╝██╔════╝██╔══██╗
██║     ██║██║   ██║█████╗   ███████╗██║   ██║██║   ██║█████╗  █████╗    ███╔╝ █████╗  ██████╔╝
██║     ██║╚██╗ ██╔╝██╔══╝   ╚════██║██║▄▄ ██║██║   ██║██╔══╝  ██╔══╝   ███╔╝  ██╔══╝  ██╔══██╗
███████╗██║ ╚████╔╝ ███████╗ ███████║╚██████╔╝╚██████╔╝███████╗███████╗███████╗███████╗██║  ██║
╚══════╝╚═╝  ╚═══╝  ╚══════╝ ╚══════╝ ╚══▀▀═╝  ╚═════╝ ╚══════╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝

%cLive Squeezer is open source! https://github.com/vikcch/live-squeezer`,
    'color:Chocolate; background-color:MistyRose', 'font-weight:bold');

console.log(`v${process.env.VUE_APP_VERSION}`);