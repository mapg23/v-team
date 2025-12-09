"use strict";

/**
 * Device Class, used to simulate a bike.
 */
class Device {
    constructor(id, cords, battery = 100, status = 10, occupied = false, speed = 0) {
        this.id = id;
        this.cords = cords;
        this.battery = battery;
        this.status = status;
        this.occupied = occupied;
        this.speed = speed;
    }

    move(cords) {
        if (this.status > 50) {
            return { event: 'bike is unable to move, reason:', data: this.status};
        }

        this.cords = cords;
    }

    setStatus(status) {
        this.status = status;
    }

    selfDiagnose() {
        if (this.battery <= 20) {
            this.setStatus(50) // low battery
        }
    }

}

export default Device;