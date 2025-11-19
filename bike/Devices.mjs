"use strict";

class Device {
    constructor(id, cords, battery = 100, status = 'active', occupied = false) {
        this.id = id;
        this.cords = cords;
        this.battery = battery;
        this.status = status;
        this.occupied = occupied;
    }

    startDevice() {
        console.log(`Device id: ${this.id} has started and has status: ${this.status}`);
    }
}

export default Device;