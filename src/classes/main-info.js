import Player from './player.js';
import validations from '../units/validations.js';
import biz from '../units/biz.js';
import { head } from '../units/absx.js'
import { fixValue, neat } from '../units/vikFunctions.js';

export default class MainInfo {

    constructor() {

        this.handId = null;
        this.handDate = null;
        this.dealer = null;
        this.tableName = null;
        this.stakes = null;
        this.tableMax = null;
        this.perspective = null;
        this.heroSeat = null;
        this.handTime = null;

        this.players = null;
        this.invalidPlayer = false;
    }

    /**
     * @param {Number} value
     */
    set setHandId(value) {

        if (validations.business.mainInfo.isHandId(value)) {
            this.handId = Number(value);
        }
    }

    /**
     * @param {Date} value
     */
    set setDate(value) {

        if (validations.business.mainInfo.isDate(value)) {
            this.handDate = value;
        }
    }

    /**
     * @param {Number} value
     */
    set setDealer(value) {

        if (validations.business.mainInfo.isDealer(value)) {
            this.dealer = Number(value);
        }
    }

    /**
     * @param {any} value     
     */
    set setTableName(value) {

        if (validations.business.mainInfo.isTableName(value)) {
            this.tableName = value;
        }
    }

    /**
     * @param {any} value
     */
    set setStakes(value) {

        if (validations.business.mainInfo.isStakes(value)) {
            this.stakes = biz.stringToStakes(value);
        }
    }

    /**
     * @param {any} value
     */
    set setTableMax(value) {

        if (validations.business.mainInfo.isTableMax(value)) {
            this.tableMax = value;
        }
    }

    /**
     * @param {any} value
     */
    set setPerspective(value) {

        if (validations.business.mainInfo.isPerspective(value)) {

            this.perspective = value;
        }
    }

    /**
     * @param {any} value
     */
    set setHeroSeat(value) {

        if (validations.business.mainInfo.isHeroSeat(value)) {

            this.heroSeat = Number(value);
        }
    }

    /**
     * @param {any} value
     */
    set setHandTime(value) {

        if (validations.business.mainInfo.isHandTime(value)) {

            this.handTime = value.padStart(8, '0');
        }
    }

    /**
     * @param {any} value
     */
    set setPlayers(value) {

        const playersInfo = value;

        this.players = [];

        const seatLimit = biz.playersLimitTableMax(this.tableMax);

        playersInfo.forEach((p, index) => {

            const { seat, name, stack, holeCards } = p;

            if (validations.business.player.isValid(seat, name, stack, seatLimit)) {

                const isButton = this.dealer === Number(seat);

                const isHero = this.heroSeat === Number(seat);

                const player = new Player(seat, name, stack, isButton, isHero);

                player.setHoleCards = holeCards;

                this.players.push(player);

            } else {

                this.invalidPlayer = {

                    index: index,
                    field: validations.business.player.getInvalidField(seat, name, stack, seatLimit)
                };
            }

        });

    }

    /**
     * @param {any} seats
     */
    set setInvalidPlayer(seats) {

        const obj = seats.reduce((acc, cur) => (acc[cur] = (acc[cur] || 0) + 1, acc), {});

        const arr = Object.entries(obj).map(([seat, times]) => ({ seat, times }));

        this.invalidPlayer = {
            index: null,
            field: 'Seat',
            duplicates: arr.find(o => o.times !== 1),
        };

    }

    get nextButton() {

        //if (this.players.length < 2) return null;

        const seats = this.players.map(p => p.seat);

        while (head(seats) !== this.dealer) {
            seats.push(seats.shift());
        }

        return seats[1];
    }


    tryInit(values) {

        this.setHandId = values.handId;
        this.setDate = values.handDate;
        this.setDealer = values.dealer;
        this.setTableName = values.tableName;
        this.setStakes = values.stakes;
        this.setTableMax = values.tableMax;
        this.setPerspective = values.perspective;
        this.setHeroSeat = values.heroSeat;
        this.setHandTime = values.handTime;

        this.trySetNewHandId();
        this.forceUniqueNames(values);
        this.setPlayers = values.playersInfo;

        const seats = values.playersInfo.map(pi => Number(pi.seat));
        const allDistinctSeat = new Set(seats).size === seats.length;

        const heroIsPlayer = seats.includes(this.heroSeat);
        if (!heroIsPlayer) this.heroSeat = null;

        if (!allDistinctSeat && !this.invalidPlayer) {

            this.setInvalidPlayer = seats;
        }
        const manyStraddles = () => {

            if (!this.stakes) return;

            const lenStraddles = this.stakes.straddles.length;
            const nonBlindsPlayers = values.playersInfo.length - 2;

            return lenStraddles > nonBlindsPlayers;
        };

        if (manyStraddles()) this.stakes = null;

        const isValid = Object.entries(this).every(prop => prop[1] !== null) && !this.invalidPlayer;


        return isValid && allDistinctSeat && heroIsPlayer;
    }

    forceUniqueNames(values) {

        // NOTE:: Tem em conta mais de dois repetidos

        values.playersInfo.forEach(v => v.name = neat(v.name));

        (function checkNames() {

            const names = values.playersInfo.map(pi => pi.name);
            const allDistinctNames = new Set(names).size === names.length;

            if (allDistinctNames) return;

            values.playersInfo.forEach(player => {

                const count = values.playersInfo.filter(v => v.name === player.name).length;
                if (count > 1) player.name = `${player.name}1`;
            });

            checkNames();

        })();
    }

    reset() {

        this.handId = null;
        this.handDate = null;
        this.dealer = null;
        this.tableName = null;
        this.stakes = null;
        this.tableMax = null;
        this.perspective = null;
        this.heroSeat = null;
        this.handTime = null;

        this.players = null;
        this.invalidPlayer = false;
    }

    orderPlayers() {

        const isOrdered = !!this.players
            .map(p => p.seat)
            .reduce((acc, cur) => acc !== false && cur > acc && cur);

        if (!isOrdered) this.players.sort((a, b) => a.seat - b.seat);

        return isOrdered;
    }

    ensureDealer() {

        let buttonPlayer = this.players.find(p => p.isButton);

        if (!buttonPlayer) {

            buttonPlayer = this.players.map(p => p)
                .reverse()
                .find(p => p.seat < this.dealer) || this.players[this.players.length - 1];

            buttonPlayer.isButton = true;

            this.dealer = buttonPlayer.seat;
        }
    }


    rotateForPosts() {

        if (this.players.length === 2) {

            while (!this.players[0].isButton) {
                this.players.unshift(this.players.pop());
            }

        } else this.rotateToSmallBlind();

    }


    makePosts() {

        const { ante, smallBlind, bigBlind, straddles } = this.stakes;
        const posts = [smallBlind, bigBlind, ...straddles];

        if (ante) {
            this.players.forEach(p => {
                p.currentStack -= ante;
            });
        }

        posts.forEach((post, i) => {
            this.players[i].post = true;
            this.players[i].moneyOnStreet = post;
            this.players[i].currentStack -= post;
            this.players[i].currentStack = fixValue(this.players[i].currentStack);
        });

    }


    rotateToSmallBlind() {

        while (!this.players[this.players.length - 1].isButton) {
            this.players.unshift(this.players.pop());
        }

    }

    rotateToPreflop() {

        this.rotateToSmallBlind();

        if (!this.players.every(p => p.post)) {

            while (this.players[0].post) {
                this.players.push(this.players.shift());
            }

        } else {

            const lowerPost = Math.min(...this.players.map(p => p.moneyOnStreet));

            while (this.players[0].moneyOnStreet !== lowerPost) {
                this.players.push(this.players.shift());
            }
        }

    }

    trySetNewHandId() {

        // NOTE:: Inclui "time" no `handId` caso seja defenido (ultimos 6 chars)

        const abrvTime = this.handTime?.replace(/:/g, '');

        if (!Number(abrvTime)) return;

        this.handId = Number(`${this.handId.toString().slice(0, -6)}${abrvTime}`);
    }

}
