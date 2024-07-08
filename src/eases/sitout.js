
import Vue from 'vue';
import biz from '../units/biz';
import validation from '../units/validations';
import { makeTextTag } from '../units/fxnl.js';
import Player from '../classes/player.js';

const sitouttersHandler = function () {

    this.value = validation.force.onlyNumbers(this.value);
};

const askForSeating = async (sitouts) => {

    const markTag = makeTextTag('mark');

    const sitoutsTagged = sitouts.map(v => v.seat).map(markTag).join(' ');

    const coloredSeats = /* html */ `<span class="colored-seat"> ${sitoutsTagged} </span>`;

    const players = sitouts.map(v => `${markTag(v.seat)} ${v.name}`).join(' • ');

    const playersStyled = /* html */ `<div class="colored-seat tm-m"> ${players} </div>`;

    const topText = `Players on Sitout: ${coloredSeats}`;

    const htmlText = `${topText}${playersStyled}`;

    const result = await Vue.swal.fire({
        html: htmlText,
        input: 'text',
        onBeforeOpen: (saEl) => {
            const input = saEl.querySelector('.swal2-input');
            input.setAttribute('inputmode', 'numeric');
            input.addEventListener('input', sitouttersHandler);
        },
        onClose: (saEl) => {
            const input = saEl.querySelector('.swal2-input');
            input.removeEventListener('input', sitouttersHandler);
        }
    });

    const foundSitoutter = sitouts.find(v => Number(v.seat) === Number(result.value));

    if (result.value && !foundSitoutter) return await askForSeating(sitouts);

    return foundSitoutter;
};

const fullTable = function () {

    const { view } = this.$root.$data;
    const tableMax = view.mainInfoVue.$data.values.tableMax;

    const limit = biz.playersLimitTableMax(tableMax);

    if (this.inputs.length >= limit) return this.$swal.fire({ title: 'Table is full' });
};

const checkDuplicateSeats = function () {

    const uniquesSeats = new Set(this.inputs.map(v => v.seat)).size;

    if (uniquesSeats !== this.inputs.length) {

        this.$swal.fire({ title: 'Duplicate Seats!' });
    }
};

export default async function () {

    if (fullTable.call(this)) return;

    const { sitouts } = this.$data;

    const sitoutter = sitouts.length > 1
        ? await askForSeating(sitouts)
        : sitouts[0];

    if (!sitoutter) return;

    const { seat, name, stack } = sitoutter;
    this.inputs.push(Player.model(seat, name, stack));
    this.inputs.sort((a, b) => a.seat - b.seat);
    this.$data.sitouts = sitouts.filter(v => v !== sitoutter);

    checkDuplicateSeats.call(this);
}