// NOTE:: Alternativa simplificada a "vuex".

// Para ficar "reactive" no data() > xxx.vue, tenho que "connectar" uma prop 
// desse `data()` (xxxStore) á prop `data`, tem a ajuda do computed `stats` para 
// simplificar no template.
// Se passasse um "nivel" acima, lá no `data()` logo "stats" com o "stats" daqui 
// não ficava reactive porque `usersCount`, e resto são primitivos, lia a primeira 
// vez se não tiver async await no `created()`, que até servia para este uso caso...

// NOTE:: Nota baseada no evspot, "stats" é object no `data` 

// Baseado em: https://youtu.be/mS9-fTrgjrA

const settingStore = {

    data: {
        optionalTime: false,
    },

    setters: {

        /**
         * @param {boolean} value
         */
        set optionalTime(value) {
            settingStore.data.optionalTime = value;
            settingStore.methods.saveSettings();
        },
    },

    getters: {

        get optionalTime() {
            return settingStore.data.optionalTime;
        },
    },

    methods: {

        tryCreateSettings() {

            const settings = localStorage.getItem('live-squeezer-settings');

            if (settings) {

                const settingsParsed = { ...JSON.parse(settings) };
                const keys = Object.keys(settingStore.getters);
                const every = keys.every(key => key in settingsParsed);

                // NOTE:: Têm que verificar todas, porque posso querer
                // adicionar mais no futuro
                if (every) return;
            }

            const stringifyed = JSON.stringify(settingStore.data);
            localStorage.setItem('live-squeezer-settings', stringifyed);
        },

        loadSettings() {

            const settings = localStorage.getItem('live-squeezer-settings');

            try {

                // NOTE:: Destruction para evitar hack de editar o item da localstorage
                // e `settingStore.data` ficar não sendo um objecto "{}" dando erro 
                // posteriormento no setting
                settingStore.data = { ...JSON.parse(settings) };

            } catch (error) {

                console.error(error);
                localStorage.removeItem('live-squeezer-settings');
                this.tryCreateSettings();
            }
        },

        saveSettings() {

            const stringifyed = JSON.stringify(settingStore.data);

            localStorage.setItem('live-squeezer-settings', stringifyed);
        }
    }
};

export default settingStore;