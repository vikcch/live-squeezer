const hasSeat = (seat, players) => players.some(v => v.intel.input.seat == seat);

const nitGame = players => {

    const loser = Number(prompt('Enter the losing player seat:'));
    if (!hasSeat(loser, players)) return;

    const amount = Number(prompt('Amount per player:'));
    if (!Number.isInteger(amount)) return;


    Array.from(players).forEach(({ intel }) => {

        const seat = Number(intel.input.seat);
        const oldStack = Number(intel.input.stack);

        const stack = seat === loser
            ? oldStack - amount * (players.length - 1)
            : oldStack + amount;

        intel.input.stack = stack;
    });
};


const sevenDeuceGame = players => {

    const winner = Number(prompt('Enter the winner player seat:'));
    if (!hasSeat(winner, players)) return;

    const amount = Number(prompt('Amount per player:'));
    if (!Number.isInteger(amount)) return;


    Array.from(players).forEach(({ intel }) => {

        const seat = Number(intel.input.seat);
        const oldStack = Number(intel.input.stack);

        const stack = seat === winner
            ? oldStack + amount * (players.length - 1)
            : oldStack - amount;

        intel.input.stack = stack;
    });
};


export default function () {

    const oneToAll = '1. Nit Game - One Player pays to all';
    const allToOne = '2. 7-2 Game - All Players pays to one';
    const game = Number(prompt(`\nSelect the Game:\n\n${oneToAll}\n${allToOne}`));

    const workMap = {

        '1': () => nitGame(players),
        '2': () => sevenDeuceGame(players)
    };

    const players = this.$refs['players-grid'].$children;

    game in workMap && workMap[game].call(null, players);
}