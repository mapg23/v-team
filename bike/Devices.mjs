"use strict";
import WebSocket from 'ws'

class Device {
    constructor(id, startCords, battery = 100, status = 'active', occupied = false) {
        this.id = id;
        this.startCords = startCords;
        this.battery = battery;
        this.status = status;
        this.occupied = occupied;
    }

    startDevice() {
        console.log(`Device id: ${this.id} has started and has status: ${this.status}`);
    }
}

export default Device;