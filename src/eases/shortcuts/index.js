import SettingsStore from '../../store/simple/settings';
import biz from '../../units/biz';
import f8Ctrl from './f8-ctrl';

export default async function (event) {

    if (event.key === 'F2' && !event.ctrlKey) {

        // NOTE:: `.Vue` chama `$children[0]`
        const localStorageDialog = this.$refs['dialog-local-storage'].Vue;

        if (!localStorageDialog.isSaveEnabled) return;

        const success = await localStorageDialog.save();

        if (!success) return;

        // NOTE:: Podia ser "sync"... é só para dar um tempinho
        setTimeout(this.$refs['dialog-new-hand'].Vue.nextHand, 100);
    }

    if (event.key === 'F2' && event.ctrlKey) {

        const result = prompt('Alternative key cards: (on/off)', 'off');

        // `null` -> Cancel
        if (result === null) return;

        SettingsStore.setters.sideKeyCards = result.trim().toLowerCase() === 'on';
    }

    if (event.key === 'F4') {

        if (!this.$refs['start-action'].$data.isEnabled) return;

        const stakesEl = this.$refs['main-info'].getElementByKey('stakes');
        const [input] = stakesEl.$children;

        const stakes = biz.toggleStaddles(input.$data.text);

        input.$data.text = stakes;
        input.dispatch();

        const count = [...stakes].filter(v => v === '[').length;
        const text = count ? `STR: ${count}x` : '';
        stakesEl.$refs['status'].textContent = text;
    }

    if (event.key === 'F8' && !event.ctrlKey) {

        // NOTE:: Pode ter falhas com o inspector aberto na aba `sources`

        this.$refs['players-grid'].focusFirstPlayerInput();
    }

    if (event.key === 'F8' && event.ctrlKey) {

        if (!this.$refs['start-action'].$data.isEnabled) return;

        f8Ctrl.call(this);
    }

    if (event.key === 'F9' && !event.ctrlKey) {

        if (!this.$refs['start-action'].$data.isEnabled) return;

        const { controller } = this.$root.$data;
        controller.handleStartAction(event);
    }

    if (event.key === 'F9' && event.ctrlKey) {

        if (this.$refs['start-action'].$data.isEnabled) return;

        this.$refs['start-action'].restart_Click();

        this.$refs['players-grid'].focusFirstPlayerInput();
    }

}