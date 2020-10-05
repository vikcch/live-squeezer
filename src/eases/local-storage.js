import { head, tail } from '../units/absx';

const capacity = 4 * 1024 * 1024;

const spaceStats = function () {

    const spaceUsed = getUsedSpace();

    const used = {
        percentage: spaceUsed / capacity * 100,
        value: spaceUsed
    };

    const spaceFree = capacity - spaceUsed;

    const free = {
        percentage: spaceFree / capacity * 100,
        value: spaceFree
    };

    return { capacity, used, free };
}

const getUsedSpace = function () {

    if (Object.entries(localStorage).length === 0) return 0;

    const currentLenght = cur => head(cur).length + tail(cur).length;

    return Object.entries(localStorage)
        .reduce((acc, cur) => acc + currentLenght(cur), 0);

};

const update = function (items) {

    const handsSerialized = JSON.stringify(items);

    localStorage.setItem('hands', handsSerialized);

    const localStorageItems = localStorage.getItem('hands');

    return {
        success: handsSerialized === localStorageItems,
        spaceStats: spaceStats()
    };

}

const insertItem = function (item) {

    const items = JSON.parse(localStorage.getItem('hands')) || [];

    items.push(item);

    return update(items);
};

const getItems = function () {

    return JSON.parse(localStorage.getItem('hands')) || [];
};

export default { insertItem, update, getItems, capacity, spaceStats };