import { head, tail, lineBreaker } from "../units/absx";
import fxnl, { pipe, or } from "../units/fxnl";
import biz from "../units/biz";
import vikFunctions, { sum_rdc } from "../units/vikFunctions";

const forumSuits = {
    d: ':diamond:',
    h: ':heart:',
    s: ':spade:',
    c: ':club:'
};

const makeBold = pipe(fxnl.makePrefixer('[B]'), fxnl.makeSufixer('[/B]'));

const makeItalic = pipe(fxnl.makePrefixer('[I]'), fxnl.makeSufixer('[/I]'));

const makeLink = link => {

    const startTag = `[URL=${link}]`;
    return pipe(fxnl.makePrefixer(startTag), fxnl.makeSufixer('[/URL]'));
};

const mutateSuit_rdc = (acc, cur) => acc.concat(forumSuits[cur] || cur);

const makeColored = color => {

    const startTag = `[COLOR=${color}]`;
    return pipe(fxnl.makePrefixer(startTag), fxnl.makeSufixer('[/COLOR]'));
};

const colors = {
    misc: {
        hero: 'orangered', playersCount: 'darkblue', won: 'green'
    },
    actions: {
        calls: 'green', raises: 'red', bets: 'red', checks: 'black', folds: 'sienna'
    }
};

const getHeroText = player => !player.isHero ? ''
    : pipe(makeColored(colors.misc.hero), makeItalic)(' (hero)');



const getTitle = function (mainInfo) {

    const game = 'Holdem No Limit';

    const { tableMax } = mainInfo;

    const playersCount = mainInfo.players.length;

    const title = makeBold(`${game} (${tableMax}) - ${playersCount} Players`);

    const siteName = pipe(makeColored(colors.misc.hero), makeBold)('Live Squeezer');

    const link = 'http://livesqueezer.winningpokerhud.com';

    const converted = pipe(makeLink(link), makeItalic)(`Hand converted by ${siteName}`);

    return [title, converted];
};


const rotateToLast_BB = function (mainInfo) {

    const { players } = mainInfo;

    while (tail(players).position !== 'BB') {
        players.unshift(players.pop());
    }
};

const isInvolve = (player, histories) => {

    const history = histories
        .find(h => h.player && h.player.seat === player.seat);

    if (history) return history.action !== 'folds';
    else return true; // Walk
};

const getPlayersInfo = function (mainInfo, histories) {

    return mainInfo.players.reduce((acc, cur) => {

        const bb = mainInfo.stakes.bigBlind;

        const bbs = Math.round((cur.stack / bb + Number.EPSILON) * 10) / 10;

        const line = `${cur.position}${getHeroText(cur)}: ${cur.stack} (${bbs} bb)`;

        const boldedLine = isInvolve(cur, histories) ? `[B]${line}[/B]` : line;

        return acc.concat(boldedLine);

    }, []);
};

const getBlinds = function (mainInfo) {

    return [`Blinds: ${biz.stakesToString(mainInfo.stakes)}`];
};

const removeCapAndUncalledBet = function (streetPots, conclusion) {

    // input format:
    //      [  [{ pot: x, cap: x }, { pot: x, cap: x }], [...]  ]

    // output format:    
    //      [  [x, x], [...]  ]

    const cb = x => x.pot;

    const capLess = streetPots.map(p => p.filter(cb).map(cb));

    capLess.forEach(s => tail(s) === conclusion.uncalledBet && s.pop());

    streetPots.length = 0;
    streetPots.push(...capLess);
};

const getStreetPots = function (histories) {

    const streetHistories = histories.filter(h => h.streetCards);

    streetHistories.unshift(head(histories));

    const streetPots = streetHistories

        .map(h => h.players

            .sort((a, b) => a.stack - b.stack)

            .reduce((acc, cur) => {

                let invested = cur.stack - cur.currentStack;

                acc.forEach(e => {

                    const isHigher = e.cap !== 0 && invested >= e.cap;

                    e.pot += isHigher ? e.cap : invested;

                    invested -= isHigher ? e.cap : invested;
                });

                if (cur.currentStack === 0) {

                    const sumCap = acc.map(x => x.cap).reduce(sum_rdc);

                    tail(acc).cap = cur.stack - sumCap;

                    acc.push({ pot: 0, cap: 0 });
                }

                return acc;

            }, [{ pot: 0, cap: 0 }])
        );

    return streetPots;

};

const getPlayersCountsText = function (streetHistory) {

    const playersPlaying = streetHistory.players
        .filter(p => p.stillPlaying || p.isAllIn || p.wasAllin);

    const playersAllIn = streetHistory.players.filter(p => p.isAllIn);

    const playersPlayingText = `${playersPlaying.length} Players`;

    const work = {
        '0': '',
        '1': ', 1 Player is All-in',
        default: `, ${playersAllIn.length} Players are All-in`
    };

    const key = playersAllIn.length in work ? playersAllIn.length : 'default';

    const playersAllInText = work[key];

    const merged = ` (${playersPlayingText}${playersAllInText})`;

    return merged;
};

const getStreetLine = function (streetHistory, streetPots, street, mainInfo) {

    if (!streetHistory) return null;

    const boldedStreet = makeBold(street);

    const isPreFlop = street === 'PreFlop';

    const heroHasText = isPreFlop ? 'Hero has ' : '';

    const cardsFormated = isPreFlop
        ? mainInfo.players.find(p => p.isHero).holeCards
        : biz.formatCards(streetHistory.streetCards);

    const cardsText = [...cardsFormated].reduce(mutateSuit_rdc, '');

    const playersCountText = !isPreFlop ? getPlayersCountsText(streetHistory) : '';

    return `${boldedStreet}: (${streetPots.join(', ')}) ${heroHasText}${cardsText}${playersCountText}`;
};


const getMovesLine = function (streetHistory) {

    const isAggressive = action => or('bets', 'raises')(action);

    return streetHistory.reduce((acc, cur) => {

        if (!cur.player) return acc;

        const amount = isAggressive(cur.action) ? tail(cur.log.match(/\d+/g)) : '';

        const isRaises = cur.action === 'raises';

        const amountText = isRaises ? ` to ${amount}` : ` ${amount}`;

        const positionOrHero = cur.player.isHero ? makeBold('Hero') : cur.player.position;

        const move = `${positionOrHero} ${cur.action}${amountText}`.trim();

        const italicMove = cur.action === 'folds' ? makeItalic(move) : move;

        const coloredMove = makeColored(colors.actions[cur.action])(italicMove);

        return acc.concat(coloredMove);

    }, []);

};


const getActivities = function (streetPots, histories, mainInfo) {

    const streets = ['PreFlop', 'Flop', 'Turn', 'River'];

    const streetHistories = histories.filter(h => h.streetCards);
    streetHistories.unshift(head(histories));

    const movesLine = streetIndex => getMovesLine(histories
        .filter(h => h.street === streetIndex)).join(', ');

    const activities = streets.map((s, index) => ({
        streetLine: getStreetLine(streetHistories[index], streetPots[index], s, mainInfo),
        movesLine: movesLine(index)
    }));

    return activities;
};

const getTotalpot = function (conclusion) {

    const extra = conclusion.pots.reduce((acc, cur, index) => {

        const potType = biz.potType(index, conclusion.winners.length);
        const potTypeCapitalized = vikFunctions.capitalize(potType);

        return acc.concat(` ${potTypeCapitalized} ${cur}.`);

    }, '');

    const hasSidePot = conclusion.pots.length > 1;
    const totalPot = conclusion.pots.reduce(sum_rdc);

    return [`Total pot ${totalPot}${hasSidePot ? extra : ''}`];
};

const setCollectsWinners = function (conclusion, linesAndPlayers, getShowed) {


    conclusion.winners.forEach((potWinner, index) => {

        const pot = conclusion.pots[index];
        let modAvailable = pot % potWinner.length;

        potWinner.forEach(w => {

            let splitPot = Math.floor(pot / potWinner.length);
            splitPot += (modAvailable-- > 0 ? 1 : 0);

            const wonText = makeColored(colors.misc.won)('won');

            const showedCardsText = getShowed(w, true);

            const text = `${makeBold(w.position)}${getHeroText(w)} ${showedCardsText}${wonText} (${splitPot})`;

            const alreadyWonLP = linesAndPlayers.find(lp => lp.player === w);

            if (alreadyWonLP) {

                const { line } = alreadyWonLP;
                alreadyWonLP.line = `${line.slice(0, -1)}, ${splitPot})`;

            } else {

                linesAndPlayers.push({ line: text, player: w });
            }

        });
    });
};

const setCollectsShowdown = function (conclusion, linesAndPlayers, getShowed) {

    conclusion.showdownPlayersOrdered.forEach(p => {

        if (linesAndPlayers.find(lp => lp.player === p)) return;
     
        const showedCardsText = getShowed(p, false);

        const muckOrShow = showedCardsText ? showedCardsText : 'mucked';

        const text = `${p.position}${getHeroText(p)} ${muckOrShow}`;

        linesAndPlayers.push({ line: text, player: p });
    });

};

const getCollects = function (conclusion, mainInfo) {

    const getShowed = (player, isWinner) => {

        const sameSeat = p => p.seat === player.seat;

        const { holeCards } = mainInfo.players.find(sameSeat);

        if (holeCards.includes('_') || !conclusion.hasShowDown) return '';

        const cardsText = [...holeCards].reduce(mutateSuit_rdc, '');

        const extra = isWinner ? ' and ' : '';

        return `showed ${cardsText}${extra}`;
    };


    const linesAndPlayers = [];

    setCollectsWinners(conclusion, linesAndPlayers, getShowed);

    if (conclusion.hasShowDown) {

        setCollectsShowdown(conclusion, linesAndPlayers, getShowed);
    }

    return linesAndPlayers.map(lp => lp.line);
};

const convertToText = function (array) {

    const tryBreak = value => value && lineBreaker(value);

    const cb = (acc, cur) => {

        if (typeof cur === 'string') return acc.concat(tryBreak(cur));

        if (Array.isArray(cur)) return acc.concat(tryBreak(rec(cur)));

        return acc.concat(tryBreak(rec(Object.values(cur || ''))));
    };

    const rec = object => object.reduce(cb, '');

    // Os que são objects (as streets), deixavam 2 linhas de intervalo
    return rec(array).replace('\r\n\r\n\r\n', '\r\n\r\n');
};


const run = function (model) {

    const { mainInfo, histories, conclusion } = model;

    const title = getTitle(mainInfo);

    rotateToLast_BB(mainInfo);

    const playersInfo = getPlayersInfo(mainInfo, histories);

    const blinds = getBlinds(mainInfo);

    const streetPots = getStreetPots(histories);

    removeCapAndUncalledBet(streetPots, conclusion);

    const activities = getActivities(streetPots, histories, mainInfo);

    const totalPot = getTotalpot(conclusion);

    const collects = getCollects(conclusion, mainInfo);

    const arr = [title, playersInfo, blinds, activities, totalPot, collects];

    const text = convertToText(arr);

    return text;
};

export default run;

