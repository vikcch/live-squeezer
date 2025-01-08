import History from "../../src/classes/history";

describe('history.js', () => {

    describe('static isInputCardsTaken', () => {

        it('1.', () => {

            const histories = [
                {
                    players: [{ holeCards: '__ __' }, { holeCards: 'Ad Kd' }],
                    streetCards: '3c7d9h'
                }
            ];

            const actual = History.isInputCardsTaken('Ah', histories);
            const expected = false;

            expect(actual).toStrictEqual(expected);
        });

        it('2.', () => {

            const histories = [
                {
                    players: [{ holeCards: '__ __' }, { holeCards: 'Ad Kd' }],
                    streetCards: null
                }
            ];

            const actual = History.isInputCardsTaken('3c7d9h', histories);
            const expected = false;

            expect(actual).toStrictEqual(expected);
        });

        it('3.', () => {

            const histories = [
                {
                    players: [{ holeCards: '__ __' }, { holeCards: 'Ad Kd' }],
                    streetCards: null
                }
            ];

            const actual = History.isInputCardsTaken('3cAd9h', histories);
            const expected = true;

            expect(actual).toStrictEqual(expected);
        });

        it('4.', () => {

            const histories = [
                {
                    players: [{ holeCards: '__ __' }, { holeCards: 'Ac Kd' }],
                    streetCards: null
                }
            ];

            const actual = History.isInputCardsTaken('3cAdAd', histories);
            const expected = true;

            expect(actual).toStrictEqual(expected);
        });

        it('5.', () => {

            const histories = [
                {
                    players: [{ holeCards: '7s 7h' }, { holeCards: 'Ac Kd' }],
                    streetCards: null
                }
            ];

            const actual = History.isInputCardsTaken('3cAdAh', histories);
            const expected = false;

            expect(actual).toStrictEqual(expected);
        });

        it('6.', () => {

            const histories = [
                {
                    players: [{ holeCards: '7s 7h' }, { holeCards: 'Ac Kd' }],
                    streetCards: null
                }
            ];

            const actual = History.isInputCardsTaken('3cAcAh', histories);
            const expected = true;

            expect(actual).toStrictEqual(expected);
        });

    });

});