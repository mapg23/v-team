import { parentPort } from "worker_threads";

import Device from './Devices.mjs';

class Simulator {
    bikes = [];
    total_bikes = 100;
    start() {
        for(let i = 0; i < this.total_bikes; i++) {
            this.bikes.push(new Device(i, {x: 0, y:0}))
        }
        return { event: `Bikes: ${this.bikes.length}`, data: this.bikes}
    }

    end() {
        return { event: 'stopping worker'};
    }
    list() {
        return { event: 'Listing all bikes', data : this.bikes};
    }
};


const simm = new Simulator();

parentPort?.on("message", (msg) => {
    const { id, cmd, payload } = msg;
    let res;
    switch(msg.cmd) {
        case 'start-job':
            res = simm.start();
            parentPort.postMessage({ id, ...res})
        break;
        case 'end-job':
            res = simm.end()
            parentPort.postMessage({ id, ...res})
        break;
        case 'list':
            res = simm.list();
            parentPort.postMessage({ id, ...res});
        break;
    }
});