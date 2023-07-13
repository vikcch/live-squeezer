//import Swal from 'sweetalert2';
import Vue from 'vue';

const failSeatToPopupCards = function () {

    Vue.swal.fire({
        icon: 'error',
        title: `The field Seat is wrong`,
        html: `
        <div>
            <p>Please enter a valid seat!</p>
            <p>Must be with in the Table Max</p>
        </div>`
    });
};

const getKeyOnNull = function (object) {

    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            const value = object[key];
            if (value === null) return key;
        }
    }
}

const requiredPreStartedAction = async function (mainInfoValues, view) {

    const nullKey = getKeyOnNull(mainInfoValues) || 'invalidPlayer';

    const affiliation = {

        handId: {
            label: 'Hand Id',
            message: () => 'Only numbers are allowed!',
        },
        handDate: {
            label: 'Date',
            message: () => 'Enter a real date!',
        },
        dealer: {
            label: 'Button',
            message: () => 'Only numbers are allowed!',
        },
        tableName: {
            label: 'Table Name',
            message: () => 'Only numbers and characters allowed!',
        },
        stakes: {
            label: 'Stakes',
            message: () => 'Eg: 10/20(2)[40][60]',
        },
        tableMax: {
            label: 'Table Max',
            message: () => 'Only numbers are allowed!',
        },
        perspective: {
            label: 'Perspective',
            message: () => 'TV or Hero',
        },
        heroSeat: {
            label: 'Hero seat',
            message: () => 'Type a valid player seat!',
        },
        handTime: {
            label: 'Time',
            message: () => 'Format: <em>00:00:00</em> or <em>0:00:00</em> ',
        },
        invalidPlayer: {
            label: mainInfoValues.invalidPlayer.field,

            message: () => {

                const { index, field, duplicates } = mainInfoValues.invalidPlayer;

                if (duplicates) {

                    return `Seat ${duplicates.seat} is duplicate!`;
                }

                const ordinals = ['st', 'nd', 'rd', 'th'];

                const ordinal = `${index + 1}${ordinals[index]}`

                let message = `<p>Field ${field} is wrong on the ${ordinal} player.</p>`;

                if (field === 'Seat') message += `<p>Must be with in the Table Max</p>`;

                return message;
            }
        }
    };

    // É resetado no fim, em 'onAfterClose' já chega resetado
    const { invalidPlayer } = mainInfoValues;

    await Vue.swal.fire({
        icon: 'error',
        title: `The field ${affiliation[nullKey].label} is wrong`,
        html: affiliation[nullKey].message(),

        onAfterClose: () => {

            if (nullKey === 'invalidPlayer') {
                
                view.playersGridVue.highlight(invalidPlayer);

            } else view.mainInfoVue.highlight(nullKey);
        }
    });
};

export default { requiredPreStartedAction, failSeatToPopupCards };