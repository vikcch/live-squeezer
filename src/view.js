import Vue from 'vue';
import App from './App.vue';
import Player from './classes/player';
import CardsPopup from './eases/cards-popup.js';
import Deck from './eases/deck.js';
import alerts from './eases/error-alert.js';
import winnersPopup from './eases/winners-popup.js';
import { head, tail } from './units/absx';
import biz from './units/biz.js';
import { makeTextTag } from './units/fxnl.js';
import validation from './units/validations';
import Street from './eases/street';
import { getLocalStorageMaxSize } from './extra/fns';
import { bytes } from './units/vikFunctions';


export default class View {

    constructor() {

        this.vm = null;

        this.mainInfoVue = null;
        this.playersGridVue = null;
        this.startActionVue = null;
        this.dialogActionVue = null;
        this.dialogStreetVue = null;
        this.dialogSaveVue = null;
        this.dialogLocalStorageVue = null;
        this.dialogExportVue = null;
        this.handHistoryVue = null;
        this.switcherVue = null;
        this.dialogNextHandVue = null;
        this.forumFormatVue = null;
    }

    setVue(model, controller) {

        this.vm = new Vue({
            el: '#app',
            data: { view: this, model, controller },
            render: h => h(App)
        });
    }

    bindComponents() {

        this.mainInfoVue = this.vm.$children[0].$refs['main-info'];
        this.playersGridVue = this.vm.$children[0].$refs['players-grid'];
        this.startActionVue = this.vm.$children[0].$refs['start-action'];
        this.dialogActionVue = this.vm.$children[0].$refs['dialog-action'].Vue;
        this.dialogStreetVue = this.vm.$children[0].$refs['dialog-street'].Vue;
        this.dialogSaveVue = this.vm.$children[0].$refs['dialog-save'].Vue;
        this.dialogLocalStorageVue = this.vm.$children[0].$refs['dialog-local-storage'].Vue;
        this.dialogExportVue = this.vm.$children[0].$refs['dialog-export'].Vue;
        this.handHistoryVue = this.vm.$children[0].$refs['hand-history'];
        this.switcherVue = this.vm.$children[0].$refs['switcher'];
        this.dialogNextHandVue = this.vm.$children[0].$refs['dialog-new-hand'].Vue;
        this.forumFormatVue = this.vm.$children[0].$refs['forum-format'];
    }

    setProxies() {

        Vue.swal.fire = new Proxy(Vue.swal.fire, {

            apply: function (target, thisArg, argumentsList) {

                argumentsList[0].showClass = {
                    backdrop: 'swal2-noanimation', // disable backdrop animation
                    popup: '',                     // disable popup animation
                    icon: ''                       // disable icon animation
                };
                argumentsList[0].hideClass = {
                    popup: '',                     // disable popup fade-out animation
                };

                return target.apply(thisArg, argumentsList);
            }
        });
    }

    get requiredValues() {

        const miValues = this.mainInfoVue.values;
        const pgValues = this.playersGridVue.$data.inputs;

        return { ...miValues, playersInfo: pgValues };
    }

    orderPlayers(mainInfo) {

        this.playersGridVue.$data.inputs = mainInfo.players.map(p => {
            return {
                seat: p.seat,
                name: p.name,
                stack: p.stack,
                holeCards: p.holeCards
            }
        });

        setTimeout(this.playersGridVue.orderCardsDisplay, 0);
    }


    /**
     * Para quando o dealer era um 'seat' que não existia
     * 
     * @param {*} mainInfo 
     */
    ensureDealerButton(mainInfo) {

        const buttonPlayer = mainInfo.players.find(p => p.isButton);

        const dealerSeat = Number(this.mainInfoVue.values.dealer);

        if (dealerSeat !== buttonPlayer.seat) {

            // o watch do input actualiza logo na grid
            this.mainInfoVue.updateDealer(buttonPlayer.seat);
        }
    }

    removeExtraPlayers(tableMax) {

        const limit = biz.playersLimitTableMax(tableMax);

        this.playersGridVue.$data.inputs.splice(limit);
    }

    updateOptionsOneToX(fieldKey, tableMax) {

        const limit = biz.playersLimitTableMax(tableMax);

        const isFieldKey = x => x.key === fieldKey;

        const field = this.mainInfoVue.attributes.find(isFieldKey);

        const option = (v, k) => ({ value: `${k + 1}`, text: `${k + 1}` });

        field.options = Array.from(Array(limit), option);

        const el = this.mainInfoVue.getElementByKey(fieldKey);
        head(el.$children).$forceUpdate();
    }

    updateHeroSeatOptions(tableMax) {

        this.updateOptionsOneToX('heroSeat', tableMax)
    }

    updateDealerOptions(tableMax) {

        this.updateOptionsOneToX('dealer', tableMax)
    }

    updatePlayersGridActivity({ isStreet }, model) {

        const { seat } = model.getPlayerToAct();

        const actionSeat = isStreet ? null : seat;

        this.playersGridVue.setActionSeat(actionSeat);
    }

    displayDialogAction(model) {

        this.dialogStreetVue.isVisible = false;

        this.updatePlayersGridActivity({ isStreet: false }, model);

        const { seat, name, position, post, holeCards } = model.getPlayerToAct();

        const markItalic = makeTextTag('mark', 'em');

        const seatTagged = markItalic(`#${seat}`);

        const street = Street.STREETS[tail(model.histories).street];

        const isPreFlop = street === 'PRE-FLOP';

        const isStraddle = post && position !== 'BB' && position !== 'SB';

        const positionText = isStraddle && isPreFlop ? `${position} | S` : position;

        const positionTagged = markItalic(positionText);

        const isPair = holeCards.charAt(0) === holeCards.charAt(3);
        const cards = `${holeCards.charAt(0)}${holeCards.charAt(3)}`;
        const suited = holeCards.charAt(1) === holeCards.charAt(4) ? 's' : 'o';
        const simpleHand = holeCards.charAt(0) === '_' ? '' : `${cards}${isPair ? '' : suited}`;
        const hcFormated = `<span style="font-family:'Consolas'">${simpleHand}</span>`;

        const nameStyle = `style="max-width:130px; display: inline-block; vertical-align: bottom;"`;
        const nameFormated = /* html */ `<span class="hide-overflow" ${nameStyle}>${name}</span>`
        const title = `Action on ${seatTagged} ${nameFormated} ${positionTagged} ${hcFormated} - ${street}`;

        this.dialogActionVue.title = title;
        this.dialogActionVue.isVisible = true;

        this.dialogActionVue.wrapUp();
    }

    displayDialogStreet(street, model) {

        this.dialogActionVue.isVisible = false;

        this.updatePlayersGridActivity({ isStreet: true }, model);

        const isFlop = street === 'FLOP';

        const maxlength = isFlop ? 8 : 2;

        const text = isFlop ? '__ __ __' : '__';

        const lastPlayers = model.histories.at(-1).players;

        const pot = lastPlayers
            .map(v => v.stack - v.currentStack)
            .reduce((acc, cur) => acc + cur)
            .toLocaleString('en-US');

        const stillPlaying = lastPlayers.filter(v => v.stillPlaying).length;
        const playersAllIn = lastPlayers.filter(v => v.isAllIn || v.wasAllIn).length;
        const playersCount = stillPlaying + playersAllIn;

        const playersCountEl = makeTextTag('em')(`${playersCount} Players`);
        const playersAllInEl = makeTextTag('em')(` (All-in: ${playersAllIn})`);
        const playersEl = `${playersCountEl}${playersAllIn ? playersAllInEl : ''}`;
        const extraInfoEl = makeTextTag('div')(`Pot: ${pot} - ${playersEl}`);
        const streetEl = makeTextTag('div')(street);

        const title = `${streetEl} ${extraInfoEl}`;

        this.dialogStreetVue.title = title;
        this.dialogStreetVue.isVisible = true;
        this.dialogStreetVue.text = text;
        this.dialogStreetVue.maxlength = maxlength;

        this.dialogStreetVue.wrapUp();
    }

    //#region handHistoryVue PRINTS
    printMainInfo(mainInfo) {

        this.handHistoryVue.printMainInfo(mainInfo);
    }

    printPlayersInfo(mainInfo) {

        this.handHistoryVue.printPlayersInfo(mainInfo);
    }

    printPosts(mainInfo) {

        this.handHistoryVue.printPosts(mainInfo);
    }

    printHoleCards(hero, vilansAlong, { perspective }) {

        this.handHistoryVue.printHoleCards(hero, vilansAlong, perspective);
    }

    printActivity(histories) {

        this.handHistoryVue.printActivity(histories);
    }

    printCollects(conclusion, mainInfo) {

        this.handHistoryVue.printCollects(conclusion, mainInfo);

        this.handHistoryVue.tryFixUncalledBet();
    }

    printSummary(conclusion, histories) {

        this.handHistoryVue.printSummary(conclusion, histories);
    }
    //#endregion

    //#region INFOS Popups
    showStakesInfoPopup() {

        const textSpell = 'small blind / big blind (ante) [straddle] [straddle]';
        const topDiv = makeTextTag('div')(textSpell);

        const textStakes = '10/20(2)[40][80][160]';
        const stakesTagged = makeTextTag('span', 'mark')(textStakes);

        const divStyle = 'style="margin-top:10px"';
        const middleDiv = `<div ${divStyle}>E.g. ${stakesTagged}</div>`;

        const bbAnteTagged = makeTextTag('span', 'mark')('{20}');
        const bbAnteDiv = `<div ${divStyle}>For big blind ante use: ${bbAnteTagged} </div>`;

        const mandatory = 'Mandatory: small blind / big blind';
        const bottomDiv = `<div ${divStyle}>${mandatory}</div>`;

        const text = topDiv + middleDiv + bbAnteDiv + bottomDiv;

        Vue.swal.fire({
            icon: 'info',
            title: 'Input Stakes info!',
            showCloseButton: true,
            html: text
        });
    }

    showPerspectiveInfoPopup() {

        const bolder = makeTextTag('strong');

        const tvBold = bolder('TV');
        const heroBold = bolder('Hero');

        const tvText = `${tvBold}: All known cards shows up in beginning`;
        const heroText = `${heroBold}: Only Hero cards shows up in beginning`

        const pStyle = 'style="margin-top:10px"';

        Vue.swal.fire({
            icon: 'info',
            title: 'Input Perspective info!',
            showCloseButton: true,
            html: `<p ${pStyle}>${tvText}</p><p ${pStyle}>${heroText}</p>`
        });
    }

    showNextHandInfoPopup() {

        const pStyle = `style="line-height: 2"`;

        const kbdStyle = `style="width:36px; height:24px; background-color: #eee;
            border-radius: 3px; border: 1px solid #b4b4b4; line-height: 1; padding: 4px 4px;
            box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 2px 0 0 rgba(255, 255, 255, 0.7) inset;
            color: #333; display: inline-block; font-size: 0.85em; font-weight: 700;"`;

        Vue.swal.fire({
            icon: 'info',
            title: 'Next Hand info!',
            showCloseButton: true,
            html: `The button will advance to the next player and the 
            player stacks will adjust accordingly to the action of this hand!
            <p ${pStyle}>The <kbd ${kbdStyle}>F2</kbd> key saves the hand on Local Storage!</p>`
        });
    }

    showAppendToInfoPopup() {

        Vue.swal.fire({
            icon: 'info',
            title: 'Append file info!',
            showCloseButton: true,
            html: `The hand will be appended and save to the selected file 
            when <mark>+&nbsp;Append&nbsp;to:</mark> button is clicked, 
            considere using 'Local Storage save' when converting a full session!`
        });
    }

    showLocalStorageSpaceInfoPopup() {

        Vue.swal.fire({
            icon: 'info',
            title: 'Space monitor info!',
            showCloseButton: true,
            html: `The capacity and free space are just a estimative!
            <p id="ls-free-space">Calculating&nbsp;real&nbsp;free&nbsp;space</p>`,
            onOpen: saEl => {

                const pTag = saEl.querySelector('#ls-free-space');

                setTimeout(async () => {

                    try {

                        const freeSpace = await getLocalStorageMaxSize(.1);
                        pTag.innerHTML = `Real free space: ${bytes(freeSpace)}`;

                    } catch (error) {

                        pTag.innerHTML = error;
                    }

                }, 500);
            }
        });
    }

    showActionInfoPopup() {

        const pStyle = `style="line-height: 2"`;

        const kbdStyle = `style="width:24px; height:24px; background-color: #eee;
            border-radius: 3px; border: 1px solid #b4b4b4; line-height: 1; padding: 2px 4px;
            box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 2px 0 0 rgba(255, 255, 255, 0.7) inset;
            color: #333; display: inline-block; font-size: 0.85em; font-weight: 700;"`;

        const amount = `To <i>raise to</i> or <i>bet</i>: Type the amount`;
        const passive = `To <i>check</i> or <i>call</i>: Type <mark>c</mark> or <kbd ${kbdStyle}>→</kbd> key`;
        const fold = `To <i>fold</i>: Type <mark>f</mark> or <kbd ${kbdStyle}>←</kbd> key`;
        const thousands = `Press <mark>=</mark> to make thousands, will add <i>000</i>`;

        Vue.swal.fire({
            icon: 'info',
            title: 'Action input!',
            showCloseButton: true,
            html: `<p ${pStyle}>${amount}</p><p ${pStyle}>${passive}</p><p ${pStyle}>${fold}</p><p ${pStyle}>${thousands}</p>`
        });
    }

    showRestartActionInfoPopup() {

        Vue.swal.fire({
            icon: 'info',
            title: 'Restart Action!',
            showCloseButton: true,
            html: `The <i>Start Action</i> event is nullified, allowing the fields to be edited!`
        });
    }

    //#endregion

    //#region ERROS Popups
    async showRequiredInputError(mainInfo) {

        await alerts.requiredPreStartedAction(mainInfo, this);
    }

    showInputSeatError() {

        alerts.failSeatToPopupCards();
    }

    showActionInputError() {

        const markItalic = makeTextTag('mark', 'em');

        const actionsFormated = ['folds', 'checks', 'calls']
            .map(a => markItalic(a))
            .join(', ');

        const amountFormated = markItalic('amount');

        const htmlText = `Type ${actionsFormated} or the bet / raise to ${amountFormated}`;

        this.showGenericError(htmlText);
    }

    showStreetInputError() {

        const markItalic = makeTextTag('mark', 'em');

        const oneCardTagged = markItalic('Tc');

        const threeCardsTagged = markItalic('As 7c Ts');

        const divStyle = 'style="margin-bottom:10px"';

        const topLine = `<div ${divStyle}>Type the cards correctly, ex: the 10 of clubs is ${oneCardTagged}</div>`;

        const middleLine = `<div ${divStyle}>Do not repeat cards</div>`;

        const bottomLine = `FLOP: ${threeCardsTagged} TURN / RIVER: ${oneCardTagged}`;

        const htmlText = topLine + middleLine + bottomLine;

        this.showGenericError(htmlText);
    }

    async showGenericError(htmlText, title) {

        await Vue.swal.fire({
            icon: 'error',
            title: title || 'Oops... Something went wrong!',
            html: htmlText
            // allowOutsideClick: false,
            //footer: '<a href>Why do I have this issue?</a>'
        });
    }
    //#endregion


    showSmallTopRightSuccessfully() {

        const Toast = Vue.swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            // para nao animar => animation: false // is deprecated 
            showClass: { popup: '', icon: '' },
            hideClass: { popup: '' }
        });

        Toast.fire({
            icon: 'success',
            title: 'Action successfully completed'
        });
    }

    showDeleteConfirmation() {

        return Vue.swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });
    }

    async splitCentsInquiry() {

        const reponse = await Vue.swal.fire({
            title: 'Split in Cents?',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            cancelButtonText: 'No',
            confirmButtonText: 'Yes, every penny!',
            confirmButtonColor: '#3085d6'
        });

        return !!reponse.value;
    }

    showCardsPopup(fieldInfo, histories, relatedInput) {

        const deck = new Deck();

        const remainingPlayersInput = this.playersGridVue
            .getAllHoleCardsEl()
            .filter(el => el !== relatedInput);

        deck.setpickedPlayersCards = remainingPlayersInput;
        deck.setFieldCards = fieldInfo;
        deck.setPickedStreetsCards = histories;

        new CardsPopup(deck, fieldInfo, relatedInput, remainingPlayersInput);
    }

    disableUI() {

        this.mainInfoVue.$el.setAttribute('disabled', 'true');
        this.playersGridVue.disable();
        this.startActionVue.disable();
    }

    winnersInquiry({ histories, conclusion }) {

        return winnersPopup(histories, conclusion);
    }

    hideGameDialogs() {

        this.dialogActionVue.isVisible = false;
        this.dialogStreetVue.isVisible = false;
    }

    enabledCompleteButtons() {

        this.dialogSaveVue.isAppendToEnabled = true;
        this.dialogSaveVue.isSaveAsNewEnabled = true;
        this.dialogLocalStorageVue.isSaveEnabled = true;
        this.dialogNextHandVue.isNextHandEnabled = true;
        this.dialogExportVue.isReplayerEnabled = true;
        this.dialogExportVue.isForumEnabled = true;
        this.forumFormatVue.isEnabled = true;
    }

    unckeckRandomInfo() {

        this.playersGridVue.randomPlayerInfo = false;
    }

    resetPlayers() {

        const row = () => Player.model();

        this.playersGridVue.inputs = Array.from(Array(2), row);
    }

    /**
     * 
     * @param { object } param0 
     * @param { boolean } [param0.fromNextHand] 
     * @param { boolean } [param0.fromRestartHand] Nullifying `Start Action`
     */
    resetControls({ fromNextHand, fromRestartHand } = {}) {

        this.hideGameDialogs();

        if (!fromNextHand && !fromRestartHand) this.mainInfoVue.reset();

        if (fromNextHand) {
            this.mainInfoVue.resetCell('handId');
            this.mainInfoVue.resetCell('handTime');
        }

        this.mainInfoVue.$el.removeAttribute('disabled');

        this.playersGridVue.enable();

        if (!fromRestartHand) {
            this.playersGridVue.removeImageCards();
            this.playersGridVue.removeHoleCards();
        }

        this.startActionVue.enable();

        this.dialogSaveVue.isAppendToEnabled = false;
        // this.dialogSaveVue.$refs['file-upload'].value = null;
        this.dialogSaveVue.abateAppendedFile();

        this.dialogSaveVue.isSaveAsNewEnabled = false;
        this.dialogLocalStorageVue.isSaveEnabled = false;
        this.dialogExportVue.isReplayerEnabled = false;
        this.dialogExportVue.isForumEnabled = false;
        this.dialogNextHandVue.isNextHandEnabled = false;
        this.forumFormatVue.isEnabled = false;

        this.handHistoryVue.clear();
    }

    nextHand(lastHistory, nextButton) {

        this.mainInfoVue.updateDealer(nextButton);

        const orderedPlayers = lastHistory.players
            .sort((a, b) => a.seat - b.seat);

        this.playersGridVue.inputs = orderedPlayers
            .map(p => Player.model(
                p.seat,
                p.name,
                p.currentStack,
                p.holeCards
            ));
    }

    tryGetHandHistory(option = { alert: true }) {

        const hh = this.handHistoryVue.getHandHistory().join('');

        if (!validation.business.handHistory.hasSummary(hh)) {

            const htmlText = 'The hand is <strong>not</strong> over yet!';
            if (option.alert) this.showGenericError(htmlText);

            return { success: false };
        }

        const isTvPerspective = this.mainInfoVue.values.perspective === 'tv';

        if (!isTvPerspective && !validation.business.handHistory.hasHeroHoleCards(hh)) {

            const htmlText = 'The <strong>hero</strong> must have hole cards';
            if (option.alert) this.showGenericError(htmlText);

            return { success: false };
        }

        if (isTvPerspective && !validation.business.handHistory.hasHoleCards(hh)) {

            const htmlText = 'At least one player must have hole cards';
            if (option.alert) this.showGenericError(htmlText);

            return { success: false };
        }

        return { success: true, hh };
    }

    tryEnableLocalStorageSaveButton() {

        this.dialogLocalStorageVue.tryEnableSaveButton();
    }

    tryHighlightHandTime() {

        this.mainInfoVue.highlight('handTime');
    }

    tryUpdateHandId(mainInfo) {

        const [{ text }] = this.mainInfoVue.getElementByKey('handId').$children;

        if (text === mainInfo.handId) return;

        this.mainInfoVue.updateInput({ key: 'handId', value: mainInfo.handId });
    }

    async postsError(restartAction) {

        const title = 'Can\'t handle all-ins on posts!';
        await this.showGenericError('', title);

        restartAction();
    }

}