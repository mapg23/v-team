"use strict";

/**
 * Device Class, used to simulate a bike.
 */
class Device {
    constructor(id, cords, battery = 100, status = 'active', occupied = false) {
        this.id = id;
        this.cords = cords;
        this.battery = battery;
        this.status = status;
        this.occupied = occupied;
    }
}

export default Device;