import vikFunctions from './units/vikFunctions.js';
import validations from './units/validations.js';

import Model from './model.js';     // eslint-disable-line
import View from './view.js';       // eslint-disable-line

export default class Controller {

    /**
     * 
     * @param {Model} model 
     * @param {View} view 
     */
    constructor(model, view) {

        this.model = model;
        this.view = view;

        this.view.setVue(model, this);
        this.view.bindComponents();
        this.view.setProxies();
    }

    handleTableMax = () => (value) => {

        this.view.removeExtraPlayers(value);

        this.view.updateHeroSeatOptions(value);
        this.view.updateDealerOptions(value);
    }

    handleCardsPopup = () => (inputFieldCards, seat, seatLimit) => {

        if (seat !== null && !validations.business.player.isSeat(seat, seatLimit)) {
            this.view.showInputSeatError();
            return;
        }

        const isHoleCardsField = inputFieldCards.name === 'hole-cards';

        const street = isHoleCardsField ? null : this.model.getNextStreet();

        const name = `${isHoleCardsField ? `Seat ${seat}:` : `${street}:`}&nbsp`;

        const capacity = isHoleCardsField ? 2 : street === 'FLOP' ? 3 : 1;

        const fieldInfo = {
            name, capacity, value: inputFieldCards.value,
            isHoleCardsField, street
        };

        this.view.showCardsPopup(fieldInfo, this.model.histories, inputFieldCards);
    }


    handleStartAction = async () => {

        const { mainInfo } = this.model;

        const neatInputs = vikFunctions.scan(this.view.requiredValues, value => {
            return typeof value === "string" ? vikFunctions.neat(value) : value;
        });

        if (!this.model.trySetMainInfo(neatInputs)) {
            await this.view.showRequiredInputError(mainInfo);
            mainInfo.reset();
            return;
        }

        this.view.tryUpdateHandId(mainInfo);

        this.view.disableUI();

        this.model.orderPlayers();

        this.view.orderPlayers(mainInfo);

        this.model.ensureDealer();

        this.view.ensureDealerButton(mainInfo);

        this.model.setTablePositions();

        this.view.printMainInfo(mainInfo);

        this.view.printPlayersInfo(mainInfo);

        this.model.makePosts();

        this.view.printPosts(mainInfo);

        this.view.printHoleCards(this.model.hero, this.model.vilansAlong, mainInfo);

        this.model.initHistory();

        this.view.displayDialogAction(this.model);
    }

    handleRestartAction = () => {

        this.view.resetControls({ fromRestartHand: true });

        this.model.reset();
    }

    /**
     * Chamado em 'handleStreetSubmit()' ou 'handlePlayerActionSubmit()'
     */
    async wrapUpHand() {

        this.model.processCollects();

        if (this.model.demandManualWinners()) {

            const winners = await this.view.winnersInquiry(this.model);
            this.model.setManualWinners(winners);

            if (this.model.demandManualSplitInCents(winners)) {

                const splitInCents = await this.view.splitCentsInquiry();
                this.model.setDecimalSplits(splitInCents);
            }
        }

        this.view.printCollects(this.model.conclusion, this.model.mainInfo);
        this.model.processSummary();
        this.view.printSummary(this.model.conclusion, this.model.histories);
        this.completed();
    }


    handlePlayerActionSubmit = () => (actionText) => {

        const success = this.model.submitAction(actionText);

        if (!success) {
            this.view.showActionInputError();
            return;
        }

        this.view.printActivity(this.model.histories);

        if (this.model.isStreetActionClosed()) {

            if (this.model.isHandActionClosed()) {

                this.model.processUncalledBet();
            }

            if (this.model.isHandOver()) this.wrapUpHand();
            else this.view.displayDialogStreet(this.model.getNextStreet(), this.model);
        }
        else this.view.displayDialogAction(this.model);
    }


    handleStreetSubmit = () => async (streetText) => {

        const success = this.model.submitStreet(streetText);

        if (!success) {
            this.view.showStreetInputError();
            return;
        }

        this.view.printActivity(this.model.histories);

        if (this.model.isHandOver()) this.wrapUpHand();
        else {

            if (this.model.isHandAllIn()) this.view.displayDialogStreet(this.model.getNextStreet(), this.model);
            else this.view.displayDialogAction(this.model);
        }
    }

    handleNewHand = () => {

        this.view.unckeckRandomInfo();

        this.view.resetPlayers();

        this.view.resetControls();

        this.model.reset();
    }

    handleNextHand = () => {

        this.view.nextHand(this.model.lastHistory, this.model.mainInfo.nextButton);

        this.view.resetControls({ fromNextHand: true });

        this.model.reset();

        this.view.tryHighlightHandTime();
    }

    undo() {

        if (this.model.histories.length < 2) return;

        const result = this.model.undo();

        if (result.isStreet) this.view.displayDialogStreet(result.nextStreet, this.model);
        else this.view.displayDialogAction(this.model);

        this.view.printActivity(this.model.histories);
    }

    completed() {

        this.model.hasSummary = true;

        this.view.hideGameDialogs();

        this.view.enabledCompleteButtons();
    }

}
