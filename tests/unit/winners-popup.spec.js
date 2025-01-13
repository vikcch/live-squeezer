import { testables } from '../../src/eases/winners-popup.js';

const { tryGetBestRankingPlayer } = testables;

describe('winners-popup.js', () => {


    describe('# tryGetBestRankingPlayer', () => {

        it('1.', () => {

            const histories = [{ streetCards: 'AsKcQdQs7d' }];

            const players = [
                { seat: 2, holeCards: 'AdAc' },
                { seat: 7, holeCards: 'KdKh' },
            ];

            const actual = tryGetBestRankingPlayer(histories, players);

            const expected = {
                player: players.at(0),
                ranking: 7,
                text: 'a full house, Aces full of Queens',
                kickers: [14, 14, 14, 12, 12]
            };

            expect(actual).toStrictEqual(expected);
        });

        it('2. a player without holecards', () => {

            const histories = [{ streetCards: 'AsKcQdQs7d' }];

            const players = [
                { seat: 2, holeCards: 'AdAc' },
                { seat: 7, holeCards: 'KdKh' },
                { seat: 2, holeCards: '__ __' },
            ];

            const actual = tryGetBestRankingPlayer(histories, players);

            const expected = null;

            expect(actual).toStrictEqual(expected);
        });

        it('3. same hand', () => {

            const histories = [{ streetCards: 'AsKcQdQs7d' }];

            const players = [
                { seat: 2, holeCards: 'JhTc' },
                { seat: 7, holeCards: 'JcTh' },
            ];

            const actual = tryGetBestRankingPlayer(histories, players);

            const expected = {
                player: players.at(0),
                ranking: 5,
                text: 'a straight, Ten to Ace',
                kickers: [14, 13, 12, 11, 10],
                multiple: true
            };

            expect(actual).toStrictEqual(expected);
        });

        it('4. a player without holecards and same hand', () => {

            const histories = [{ streetCards: 'AsKcQdQs7d' }];

            const players = [
                { seat: 2, holeCards: 'JhTc' },
                { seat: 7, holeCards: 'JcTh' },
                { seat: 2, holeCards: '__ __' },
            ];

            const actual = tryGetBestRankingPlayer(histories, players);

            const expected = null;

            expect(actual).toStrictEqual(expected);
        });

    });


});