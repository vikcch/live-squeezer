import Street from './eases/street.js';
import Action from './eases/action.js';
import { tail, head } from './units/absx.js';
import Player from './classes/player.js';
import History from './classes/history.js';
import MainInfo from './classes/main-info.js';
import Conclusion from './classes/conclusion.js';

class Model {

    constructor() {

        this.mainInfo = null;

        this.histories = null;

        this.conclusion = null;

        this.actionStarted = null;

        this.hasSummary = null;

        this.reset();
    }

    reset() {

        this.mainInfo = new MainInfo();

        this.histories = [new History()];

        this.conclusion = new Conclusion();

        this.actionStarted = false;

        this.hasSummary = false;
    }

    get lastHistory() {

        return tail(this.histories);
    }

    get hero() {

        return this.mainInfo.players.find(p => p.seat === this.mainInfo.heroSeat);
    }

    get vilansAlong() {

        const vilansWithCards = p => p.holeCards !== '__ __' && !p.isHero;

        return this.mainInfo.players.filter(vilansWithCards);
    }

    trySetMainInfo(values) {

        const result = this.mainInfo.tryInit(values);

        this.actionStarted = result;

        return result;
    }

    orderPlayers() {

        this.mainInfo.orderPlayers();
    }

    ensureDealer() {

        this.mainInfo.ensureDealer();
    }

    setTablePositions() {

        Player.setTablePositions(this.mainInfo.players);
    }

    tryMakePosts() {

        this.mainInfo.rotateForPosts();

        return this.mainInfo.makePosts();
    }

    initHistory() {

        this.mainInfo.rotateToPreflop();

        History.initHistory(this.histories, this.mainInfo);
    }

    getPlayerToAct() {

        const tempPlayers = this.lastHistory.players;
        Player.rotatePlayers(tempPlayers);

        return head(tempPlayers);
    }

    getNextStreet() {

        return Street.getNextStreet(this.histories);
    }

    isStreetActionClosed() {

        const stillPlaying = Player.getStillPlayingOnLastIndex(this.histories);

        // [].every() retorna 'true' em array vazio
        const streetClosed = stillPlaying.every(p => p.acted);

        const playersTotal = head(this.histories).players.length;
        const psAllInsTotal = Player.getPreviousStreetsAllIns(this.histories).length || 0;
        const foldsTotal = this.histories.filter(h => h.action === 'folds').length;
        const isWalk = foldsTotal + psAllInsTotal === playersTotal - 1;

        return streetClosed || isWalk;
    }

    isHandActionClosed() {

        const stillPlaying = Player.getStillPlayingOnLastIndex(this.histories);
        const streetIndex = History.getStreetIndexOnLastIndex(this.histories);

        return (stillPlaying.length <= 1) || streetIndex === 3;
    }

    isHandOver() {

        const stillPlaying = Player.getStillPlayingOnLastIndex(this.histories);
        const streetClosed = stillPlaying.every(p => p.acted) || stillPlaying.length === 1;

        const areAllIns = Player.getAllInsOnLastIndex(this.histories).length !== 0;

        const lastIndex = this.histories.length - 1;

        return (streetClosed && this.histories[lastIndex].street === 3) ||
            (stillPlaying.length <= 1 && !areAllIns) ||
            stillPlaying.length === 0 && this.histories[lastIndex].street === 3;
    }

    isHandAllIn() {

        const stillPlaying = Player.getStillPlayingOnLastIndex(this.histories);

        return stillPlaying.length <= 1;
    }

    processUncalledBet() {

        this.conclusion.setUncalledBet(this.histories);
    }

    processCollects() {

        this.conclusion.setPots(this.histories, this.mainInfo);

        this.conclusion.setAutoWinners(this.histories);

        this.conclusion.setHasShowDown(this.histories);

        this.conclusion.setShowHandsOrder(this.histories);
    }

    demandManualWinners() {

        return this.conclusion.winners.length === 0;
    }

    setManualWinners(winners) {

        this.conclusion.winners = winners;
    }

    demandManualSplitInCents(winners) {

        // winners = [ [p2], [p1, p3] ]
        //                   ^^^^^^^^ split pot  

        const hasSplitPots = winners.some(x => x.length > 1);

        if (!hasSplitPots) return false;

        const decimalBets = x => !Number.isInteger(x.currentBet);

        const hasHistoryDecimals = this.histories.some(decimalBets);

        const hasDecimalStakes = this.mainInfo.stakes.hasDecimal();

        return !hasHistoryDecimals && !hasDecimalStakes;
    }

    setDecimalSplits(value) {

        this.conclusion.decimalSplitsPots = value;
    }

    processSummary() {

        this.conclusion.createFinalHistory(this.histories);

        this.conclusion.addUncalledBetToStack(this.histories);

        this.conclusion.addPotsToStacks(this.histories);
    }

    submitAction(input) {

        const history = History.createFromLast(this.histories);

        Player.rotatePlayers(history.players);

        const action = new Action(input, history);

        if (!action.getIsValid) this.histories.pop();

        return action.getIsValid;
    }

    submitStreet(input) {

        History.createFromLast(this.histories);

        const street = new Street(input, this.histories, this.mainInfo);

        if (!street.getIsValid) this.histories.pop();

        return street.getIsValid;
    }

    undo() {

        const isStreet = this.lastHistory.streetCards !== null;

        this.histories.pop();

        return {
            isStreet: isStreet,
            nextStreet: this.getNextStreet()
        };
    }

    trySetHoleCards(input, seat) {

        const value = input.replace(/\s+/g, '').trim();

        if (value.length !== 4 || !this.mainInfo.players) return;

        const player = this.mainInfo.players.find(p => p.seat === Number(seat));

        if (player) {

            player.setHoleCards = value;

            if (input === '__ __') player.holeCards = '__ __';

            return !player.holeCards.includes('_') || input === '__ __';
        }

        return false;
    }

    async postActionStartedDB() {

        const { href } = window.location;

        const isDev = href.includes('localhost') || href.includes('127.0.0.1');

        const prefixDev = 'http://localhost/dev/live-squeezer';
        const prefixProd = 'https://livesqueezer.winningpokerhud.com';

        const prefix = isDev ? prefixDev : prefixProd;

        const endPoint = `${prefix}/php/action-started.php`;

        const { tableName, perspective, stakes: stakesLevel } = this.mainInfo;

        const stakes = `${stakesLevel.smallBlind}/${stakesLevel.bigBlind}`;

        try {

            const rawResponse = await fetch(endPoint, {
                method: 'POST',
                body: JSON.stringify({ tableName, perspective, stakes })
            });

            const response = await rawResponse.json();

            window.EventVue.$emit('updateFetched', response.success);

        } catch (error) {

            console.error(error);

            window.EventVue.$emit('updateFetched', null);
        }
    }

    async postHandHistoryDB(view) {

        const { href } = window.location;

        const isDev = href.includes('localhost') || href.includes('127.0.0.1');

        const prefixDev = 'http://localhost/dev/live-squeezer';
        const prefixProd = 'https://livesqueezer.winningpokerhud.com';

        const prefix = isDev ? prefixDev : prefixProd;

        const endPoint = `${prefix}/php/hand-history.php`;

        // NOTE:: Não faz o post caso, não haja holecards
        const result = view.tryGetHandHistory({ alert: false });

        if (!result.success) return;

        try {

            const rawResponse = await fetch(endPoint, {
                method: 'POST',
                body: JSON.stringify({ hand: result.hh })
            });

            const response = await rawResponse.json();

            // window.EventVue.$emit('updateFetched', response.success);

        } catch (error) {

            console.error(error);

            // window.EventVue.$emit('updateFetched', null);
        }
    }
}


export default Model;