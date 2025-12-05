"use strict";
import { parentPort } from "worker_threads";

import Device from './Devices.mjs';

class Simulator {
    bikes = [];
    total_bikes = 1;
    cordinates = {};

    heartbeat_count = 0;
    movementInterval = null;

    constructor(total_bikes=1, bikes = [], cordinates = {}) {
        this.total_bikes = total_bikes;
        this.bikes = bikes;
        this.cordinates = cordinates;
    }

    setCordinates(coords) {
        this.cordinates = coords;
    }

    startMovement() {
        if (this.movementInterval) return;

        this.movementInterval = setInterval(() => {
            this.heartbeat()
            this.sendUpdates();
        }, 3000);
        console.log("Movement started");
    }

    stopMovement() {
        if (this.movementInterval) {
            clearInterval(this.movementInterval);
            this.movementInterval = null;
            console.log("Movement has stopped");
        }
    }

    heartbeat() {
        for(let key in this.cordinates) {
            if (!this.bikes[key]) {
                continue;
            }
            // Updated
            if (this.cordinates[key].length !== 0) {
                this.bikes[key].status = 10;
                const nextCordinate = this.cordinates[key].shift();

                this.bikes[key].move(nextCordinate);
                console.log(`Bike ${key} has updated it's cords`)
            } else {
                console.log(`Bike: ${key} has no cordinates left ${this.cordinates[key].length}`)
                this.bikes[key].status = 40;
                this.cordinates[key] = [];
            }
        }
        return { event: 'Heartbeat updated' };
    }

    sendUpdates() {
        const data = this.bikes.map((b) => ({
            id: b.id,
            cords: b.cords,
            status: b.status
        }));

        parentPort?.postMessage({
            type: "telemetry",
            data,
        });
    }

    startFromMemory(payload) {
        // Retrives all bikes from db
        // Start bike movement
        this.bikes = payload
    }

    /**
     * Method for start of simulation.
     * @returns {Array} - Event with data.
     */
    start() {
        if (this.bikes.length >= this.total_bikes) {
            return { event: `Bikes already at max capacity: ${this.bikes.length}/${this.total_bikes}`};
        }

        for(let i = 0; i < this.total_bikes; i++) {
            this.bikes.push(new Device(i, {x: 0, y:0}))
        }
        this.startMovement();
        return { event: `Bikes: ${this.bikes.length}`, data: this.bikes}
    }

    /**
     * Method that sets bikes to an empty array.
     * @returns {Array} - Event
     */
    end() {
        // Save all bike positions to database

        
        this.bikes = [];
        this.stopMovement();
        return { event: 'stopping worker'};

    }

    /**
     * Method that returns an array containing a list of all bikes.
     * @returns {Array} - Event with data
     */
    list() {
        return { event: 'Listing all bikes', data : this.bikes};
    }

    /**
     * Getter method for device based on id.
     * @param {Array} payload 
     * @returns {Array} - Device
     */
    getBike(payload) {
        return { event: 'Retriving bike', data : this.bikes[payload.id]}
    }

    /**
     * Method that alters a specific bikes cordinates based on bike id.
     * @param {Array} payload 
     * @returns {Array} - Array of result.
     */
    setRoute(payload) {
        try {
            for (let key in payload) {
                this.cordinates[Number(key)] = payload[key];
            }
            return { event: 'Succesfully added routes', data: payload};
        } catch (error) {
            console.error('Invalid JSON structure', error.message);
            return { event: 'Invalid JSON format'};
        }
    }

    moveSpecific(bike) {
        if (this.bikes.length == 0) {
            this.start();
        }
        const prevX = this.bikes[bike.id].cords.x;
        const prevY = this.bikes[bike.id].cords.y;

        const returnMsg = { event: `Changed bike: ${bike.id} from {x:${prevX}, y:${prevY}} to: {x: ${bike.x}, y: ${bike.y}} `}
        
        this.bikes[bike.id].move({
            x: Number(bike.x),
            y: Number(bike.y)
        });

        return returnMsg;
    }
};

export function createSimulator(options) {
    return new Simulator(options?.total_bikes ?? 1);
}


// Instance of Simulator, this is active while the main thread is.
const simm = createSimulator({ total_bikes: 1000});

/**
 * Routing from the main application into the simulator class.
 */
export async function handleWorkerMessage(msg, simm) {
    // parentPort?.on("message", async (msg) => {
    const { id, cmd, payload } = msg;

    const routers = {
        'start-job': () => simm.start(),
        'start-job-memory': () => simm.startFromMemory(payload),
        'end-job': () => simm.end(),
        'list': () => simm.list(),

        'setRoute': () => simm.setRoute(payload),
        'move-specific': () => simm.moveSpecific(payload),

        'get-bike': () => simm.getBike(payload),
        'heartbeat': () => simm.heartbeat(),
    };

    const callFunction = routers[cmd];

    if (!callFunction) {
        return {id, error: `Unknown call ${cmd}`};
        // return parentPort.postMessage({id, error: `Unknown call ${cmd}`});
    }

    try {
        const res = await callFunction();
        // parentPort.postMessage({ id, ...res});
        return { id, ...res };
    } catch (error) {
        // parentPort.postMessage({id, error: error.message});
        return { id, error: error.message };
    }
};

parentPort?.on("message", async (msg) => {
    const response = await handleWorkerMessage(msg, simm);
    parentPort.postMessage(response);
});


export default Simulator;
