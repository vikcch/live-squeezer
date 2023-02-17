import MainInfo from "../../src/classes/main-info";

describe('main-info.js', () => {

	describe('# forceUniqueNames', () => {

		it('1.', () => {

			const mainInfo = new MainInfo();

			const actual = {
				playersInfo: [
					{ name: 'rita' }, { name: 'vik' }, { name: 'maria' }
				]
			};

			mainInfo.forceUniqueNames(actual);

			const expected = {
				playersInfo: [
					{ name: 'rita' }, { name: 'vik' }, { name: 'maria' }
				]
			};

			expect(actual).toStrictEqual(expected);

		});

		it('2.', () => {

			const mainInfo = new MainInfo();

			const actual = {
				playersInfo: [
					{ name: 'rita' }, { name: 'vik' }, { name: 'vik' }
				]
			};

			mainInfo.forceUniqueNames(actual);

			const expected = {
				playersInfo: [
					{ name: 'rita' }, { name: 'vik1' }, { name: 'vik' }
				]
			};

			expect(actual).toStrictEqual(expected);

		});

		it('3.', () => {

			const mainInfo = new MainInfo();

			const actual = {
				playersInfo: [
					{ name: 'vik' }, { name: 'vik' }, { name: 'vik' }
				]
			};

			mainInfo.forceUniqueNames(actual);

			const expected = {
				playersInfo: [
					{ name: 'vik11' }, { name: 'vik1' }, { name: 'vik' }
				]
			};

			expect(actual).toStrictEqual(expected);

		});

		it('4.', () => {

			const mainInfo = new MainInfo();

			const actual = {
				playersInfo: [
					{ name: 'vik man' }, { name: 'vik  man' }, { name: 'vik man ' }
				]
			};

			mainInfo.forceUniqueNames(actual);

			const expected = {
				playersInfo: [
					{ name: 'vik man11' }, { name: 'vik man1' }, { name: 'vik man' }
				]
			};

			expect(actual).toStrictEqual(expected);

		});

		it('5.', () => {

			const mainInfo = new MainInfo();

			const actual = {
				playersInfo: [
					{ name: 'vik  man' }, { name: 'vik  man' }, { name: 'vik man ' }
				]
			};

			mainInfo.forceUniqueNames(actual);

			const expected = {
				playersInfo: [
					{ name: 'vik man11' }, { name: 'vik man1' }, { name: 'vik man' }
				]
			};

			expect(actual).toStrictEqual(expected);

		});

	});

});