<template>

	<div class="wrapper bm-m">
		<div ref="output-main-info"></div>
		<div ref="output-players-info"></div>
		<div ref="output-posts"></div>
		<div ref="output-hero-hole-cards"></div>
		<div ref="output-vilans-hole-cards"></div>
		<div ref="output-activity"></div>
		<div ref="output-collects"></div>
		<div ref="output-summary"></div>
	</div>

</template>

<script>
import { lineBreaker } from '../../units/absx.js';
import biz from '../../units/biz.js';
import state from '../../units/state';
import vikFunctions, { displayAmount, sum_rdc } from '../../units/vikFunctions';

export default {

	methods: {

		clear() {

			[...this.$el.children].forEach(c => {

				state.removeChildElements(c);
			});
		},

		getHandHistory() {

			const cb = (acc, cur) => acc.concat(cur.children.length
				? hhs(cur)
				: cur.textContent);

			const hhs = object => [...object.children].reduce(cb, []);

			return hhs(this.$el).filter(hl => hl);
		},

		makeHandHistoryElement(parent) {

			const div = document.createElement('div');
			div.classList.add('hand-history-line');
			parent.append(div);

			return div;
		},

		printMainInfo(mainInfo) {

			// PokerStars Hand #204026755901:  Hold'em No Limit (€0.01/€0.02 EUR) - 2019/09/07 17:07:11 WET [2019/09/07 12:07:11 ET]
			// Table 'Montezuma IV' 6-max Seat #4 is the button

			const mainInfoEl = this.$refs['output-main-info'];
			mainInfoEl.innerHTML = '';

			const handId = `PokerStars Hand #${mainInfo.handId}:`;
			const smallBlind = displayAmount(mainInfo.stakes.smallBlind);
			const bigBlind = displayAmount(mainInfo.stakes.bigBlind);
			const game = `Hold'em No Limit (${smallBlind}/${bigBlind})`;
			const date = mainInfo.handDate.replace(/-/g, '/') + ` ${mainInfo.handTime} WET`;

			const elTop = this.makeHandHistoryElement(mainInfoEl);
			const elTopText = `${handId}  ${game} - ${date}`;
			elTop.textContent = lineBreaker(elTopText);

			const tableName = `Table '${mainInfo.tableName}'`;
			const tableMax = mainInfo.tableMax;
			const button = `Seat #${mainInfo.dealer} is the button`;

			const elBottom = this.makeHandHistoryElement(mainInfoEl);
			const elBottomText = `${tableName} ${tableMax} ${button}`;
			elBottom.textContent = lineBreaker(elBottomText);
		},

		printPlayersInfo(mainInfo) {

			const playersInfoEl = this.$refs['output-players-info'];
			playersInfoEl.innerHTML = '';

			mainInfo.players.forEach(p => {

				const el = this.makeHandHistoryElement(playersInfoEl);
				const text = `Seat ${p.seat}: ${p.name} (${displayAmount(p.stack)} in chips) `;
				el.textContent = lineBreaker(text);
			});
		},

		printPosts(mainInfo) {

			// tonyrastas: posts the ante 60

			const postsEl = this.$refs['output-posts'];
			postsEl.innerHTML = '';

			const postsLabel = ['posts small blind', 'posts big blind', 'posts a straddle'];

			const { ante, bbAnte, smallBlind, bigBlind, straddles } = mainInfo.stakes;

			if (ante) {
				mainInfo.players.forEach(p => {
					const el = this.makeHandHistoryElement(postsEl);
					const amount = displayAmount(ante);
					const text = `${p.name}: posts the ante ${amount}`;
					el.textContent = lineBreaker(text);
				});
			}

			if (bbAnte) {
				const bbName = mainInfo.players[1].name;
				const el = this.makeHandHistoryElement(postsEl);
				const amount = displayAmount(bbAnte);
				const text = `${bbName}: posts the ante ${amount}`;
				el.textContent = lineBreaker(text);
			}

			const posts = [smallBlind, bigBlind, ...straddles];

			posts.forEach((post, i) => {
				const postLabel = i > 1 ? postsLabel[2] : postsLabel[i];

				const el = this.makeHandHistoryElement(postsEl);
				const amount = displayAmount(post);
				const text = `${mainInfo.players[i].name}: ${postLabel} ${amount}`;
				el.textContent = lineBreaker(text);

			});

		},

		printHoleCards(hero, vilansAlong, perspective) {

			// *** HOLE CARDS ***
			// Dealt to vikcch [6s 2s]
			// Dealted to vikcch [6s 2s]

			const print = (players, kind) => {

				//document.getElementById(`output-${kind}-hole-cards`).innerHTML = '';
				this.$refs[`output-${kind}-hole-cards`].innerHTML = '';

				players.forEach(p => {

					if (p.holeCards === '__ __') return;

					//const pEl = document.getElementById(`output-${kind}-hole-cards`);
					const pEl = this.$refs[`output-${kind}-hole-cards`];

					if (kind === 'hero') {

						const headingText = this.makeHandHistoryElement(pEl);
						headingText.textContent = lineBreaker('*** HOLE CARDS ***');
					}

					const dealt = ['Dealt', 'Dealted'][kind !== 'hero' | 0];
					const holeCardsText = this.makeHandHistoryElement(pEl);
					holeCardsText.textContent = lineBreaker(`${dealt} to ${p.name} [${p.holeCards}]`);

				});
			}

			print([hero], 'hero');

			if (perspective === 'tv') {
				print(vilansAlong, 'vilans');
			}
		},

		printActivity(histories) {

			const activityEl = this.$refs['output-activity'];
			activityEl.innerHTML = '';

			histories.forEach((h, index) => {

				if (index === 0) return;

				const el = this.makeHandHistoryElement(activityEl);
				el.textContent = lineBreaker(h.log);

			});
		},

		printCollects(conclusion, mainInfo) {

			const collectsEl = this.$refs['output-collects'];
			collectsEl.innerHTML = '';

			// Uncalled bet (90) returned to light_rk

			/* 2 ou mais side pots */
			//"E:\OKVikSoft\Hand History\Tournaments\"
			// HH20120915 T610987291 No Limit Hold'em $2 + $0.20 (com 2 side pots)
			// xxxx collected 2014 from side pot-2         
			// xxxx collected 2508 from side pot-1         
			// xxxx collected 3836 from main pot

			/* 1 side pot */
			// xxxx collected 276 from side pot
			// xxxx collected 11736 from main pot

			/* sem side pot */
			// xxxx collected 11750 from pot

			if (conclusion.uncalledBet) {

				const el = this.makeHandHistoryElement(collectsEl);

				const { uncalledBet, uncalledPlayer: { name } } = conclusion;
				const amount = displayAmount(uncalledBet);
				const text = `Uncalled bet (${amount}) returned to ${name}`;
				el.textContent = lineBreaker(text);
			}

			if (conclusion.hasShowDown) {

				// O ranking é dispensavel no replayer

				// *** SHOW DOWN ***
				// vikcch: shows [Jh 9h] (a straight, Nine to King)
				// Kaksososs: shows [Qh Th] (two pair, Kings and Queens)
				// jlmgyou: mucks hand 
				// vikcch collected 4630 from pot

				const el = this.makeHandHistoryElement(collectsEl);

				const text = '*** SHOW DOWN ***';
				el.textContent = lineBreaker(text);

				if (mainInfo.perspective === 'hero') {

					const sameSeat = seat => player => player.seat === seat;

					const getHoleCards = seat => mainInfo.players
						.find(sameSeat(seat)).holeCards;

					conclusion.showdownPlayersOrdered.forEach(p => {

						const holeCards = getHoleCards(p.seat);

						const mucked = holeCards === '__ __';

						const ending = mucked ? 'mucks hand' : `shows [${holeCards}]`;

						const hcElText = `${p.name}: ${ending}`;

						const hcEl = this.makeHandHistoryElement(collectsEl);
						hcEl.textContent = lineBreaker(hcElText);
					});
				}
			}

			const potsText = [];

			conclusion.winners.forEach((potWinner, index) => {

				const factor = conclusion.decimalSplitsPots ? 100 : 1;
				const pot = conclusion.pots[index];
				let modAvailable = pot * factor % potWinner.length;

				potWinner.forEach(w => {

					let splitPot = Math.floor(pot * factor / potWinner.length) / factor;
					splitPot += (modAvailable-- > 0 ? 1 / factor : 0);

					const amount = displayAmount(splitPot);

					const potType = biz.potType(index, conclusion.winners.length);
					const text = `${w.name} collected ${amount} from ${potType}`;
					potsText.unshift(text);
				});
			});

			// NOTE:: Funcão acima escrevia main pot primeiro que side pot... 
			// Adicionado array com unshift para não mexer na logica da function...
			potsText.forEach(text => {

				const el = this.makeHandHistoryElement(collectsEl);
				el.textContent = lineBreaker(text);
			});
		},

		printSummary(conclusion, histories) {

			// Total pot 8358 Main pot 3836. Side pot-1 2508. Side pot-2 2014. | Rake 0 
			// Board [2c Qh 4h]

			const summaryEl = this.$refs['output-summary'];
			const el = this.makeHandHistoryElement(summaryEl);
			el.textContent = lineBreaker('*** SUMMARY ***');

			const extra = conclusion.pots.reduce((acc, cur, index) => {

				const potType = biz.potType(index, conclusion.winners.length);
				const potTypeCapitalized = vikFunctions.capitalize(potType);
				const amount = displayAmount(cur);

				return acc.concat(` ${potTypeCapitalized} ${amount}.`);

			}, '');

			const hasSidePot = conclusion.pots.length > 1;
			const totalPot = displayAmount(conclusion.pots.reduce(sum_rdc));
			const text = `Total pot ${totalPot}${hasSidePot ? extra : ''}`;

			const totalPotEl = this.makeHandHistoryElement(summaryEl);
			totalPotEl.textContent = lineBreaker(text + ' | Rake 0');

			const crampedCards = histories
				.map(h => h.streetCards)
				.filter(c => c)
				.join('');

			if (crampedCards) {

				const boardEl = this.makeHandHistoryElement(summaryEl);
				const text = `Board [${biz.formatCards(crampedCards)}]`;
				boardEl.textContent = lineBreaker(text);
			}
		},


		tryFixUncalledBet() {

			// NOTE:: Quando vão all-in, "uncalled bet" tem que ficar logo depois de
			// a ultima acçao/activity e antes das streets

			const collects = Array.from(this.$refs['output-collects'].childNodes);

			const uncalledBetEl = collects.find(v => /^Uncalled bet \(/.test(v.textContent));

			if (!uncalledBetEl) return;

			this.$refs['output-collects'].childNodes.forEach(el => {

				if (el === uncalledBetEl) el.parentNode.removeChild(el);
			});

			const activities = [...this.$refs['output-activity'].childNodes];

			// NOTE:: Em "hero perspective", quando se adicionada cartas no fim de já
			// haver "summary", faz rewrite de "view.printCollects" para mostrar showdown
			// Evita repetir "Uncalled bet"
			const done = activities.some(v => /^Uncalled bet \(/.test(v.textContent));
			if (done) return;

			const lastNonStreet = activities.findLast(v => !(/^\*\*\* /.test(v.textContent)));

			lastNonStreet.parentNode.insertBefore(uncalledBetEl, lastNonStreet.nextSibling);
		}
	}

}
</script>

<style scoped>
.wrapper {
	border: 1px #d6d9dc solid;
	font-family: "Lucida Console", Monaco, monospace;
	line-height: 1.4;
	font-size: 12px;

	min-height: 388px;
	padding-bottom: 8px;
}

.hand-history-line {
	border-bottom: 1px #fafafb solid;
	padding-left: 8px;
}
</style>

