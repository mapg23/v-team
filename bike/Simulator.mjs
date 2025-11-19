import { parentPort } from "worker_threads";

import Device from './Devices.mjs';

class Simulator {
    bikes = [];
    total_bikes = 100;
    start() {
        if (this.bikes.length >= this.total_bikes) {
            return { event: `Bikes already at max capacity: ${this.bikes.length}/${this.total_bikes}`};
        }

        for(let i = 0; i < this.total_bikes; i++) {
            this.bikes.push(new Device(i, {x: 0, y:0}))
        }
        return { event: `Bikes: ${this.bikes.length}`, data: this.bikes}
    }

    end() {
        this.bikes = [];
        return { event: 'stopping worker'};
    }
    list() {
        return { event: 'Listing all bikes', data : this.bikes};
    }

    getBike(payload) {
        let id = payload['data'].id;
        return this.bikes[id];
    }

    /**
     * Method that alters a specific bikes cordinates based on bike id.
     * @param {Array} payload 
     * @returns {Array} - Array of result.
     */
    move(bike) {
        if (this.bikes.length == 0) {
            this.start();
        }

        const returnMsg = { event: `Changed bike: ${bike.id} from pos: ${this.bikes[bike.id].cords} to: {x: ${bike.x}, y: ${bike.y}} `}
        
        this.bikes[bike.id].cords = {
            x: Number(bike.x),
            y: Number(bike.y)
        };

        return returnMsg;
    }
};

// Instance of Simulator, this is active while the main thread is.
const simm = new Simulator();

/**
 * Routing from the main application into the simulator class.
 */
parentPort?.on("message", async (msg) => {
    const { id, cmd, payload } = msg;

    const routers = {
        'start-job': () => simm.start(),
        'end-job': () => simm.end(),
        'list': () => simm.list(),
        'move': () => simm.move(payload),
        'get-bike': () => simm.getBike(payload),
    };

    const callFunction = routers[cmd];

    if (!callFunction) {
        return parentPort.postMessage({id, error: `Unknown call ${cmd}`});
    }

    try {
        const res = await callFunction();
        parentPort.postMessage({ id, ...res});
    } catch (error) {
        parentPort.postMessage({id, error: error.message});
    }
});