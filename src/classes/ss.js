
export default class ShiftedSeat {

    static instance = null;

    constructor() {

        if (ShiftedSeat.instance) {

            return ShiftedSeat.instance;
        }

        ShiftedSeat.instance = this;
    }


    getInstance() {

        return this;
    }

    trySetSeat(seat, element) {

        if (Date.now() > this.time + 100 || !this.time) {

            console.log(seat);

            this.time = Date.now();
            this.seat = seat;

            this.element = element;

            // console.log(seatP, time, seat);

            this.tryFocus();
        }



    }

    tryFocus() {

        setTimeout(() => {

            console.log(this.element, this.seat);

            this.element.focusSeatInput(this.seat);

            // element.focus();

        }, 150);

    }



}



