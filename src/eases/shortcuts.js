import biz from '../units/biz';

export default async function (event) {

    if (event.key === 'F2') {

        // NOTE:: `.Vue` chama `$children[0]`
        const localStorageDialog = this.$refs['dialog-local-storage'].Vue;

        if (!localStorageDialog.isSaveEnabled) return;

        const success = await localStorageDialog.save();

        if (!success) return;

        // NOTE:: Podia ser "sync"... é só para dar um tempinho
        setTimeout(this.$refs['dialog-new-hand'].Vue.nextHand, 100);
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

        // TODO:: Validaçoes de seat (está disponivel) e amount (ser number? 2 decimal places)

        const loser = Number(prompt('Enter the losing player seat'));
        const amount = Number(prompt('Amount per player'));

        const players = this.$refs['players-grid'].$children;

        Array.from(players).forEach(({ intel }) => {

            const seat = Number(intel.input.seat);
            const oldStack = Number(intel.input.stack);

            const stack = seat === loser
                ? oldStack - amount * (players.length - 1)
                : oldStack + amount;

            intel.input.stack = stack;
        });
    }

    if (event.key === 'F9') {

        if (!this.$refs['start-action'].$data.isEnabled) return;

        const { controller } = this.$root.$data;
        controller.handleStartAction(event);
    }

}