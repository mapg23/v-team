"use strict";
import { parentPort } from "worker_threads";

import Device from './Devices.mjs';

/**
 * Simulator class that holds all bike objects.
 * Also this class that holds the hearbeat.
 */
class Simulator {
    bikes = [];
    totalBikes = 1;
    cordinates = {};

    heartbeat_timer = 3000;
    movementInterval = null;

    /**
     * Constructor for bikes.
     * @param {Number} totalBikes - N of bikes
     * @param {Array} bikes - Bikes
     * @param {Array} cordinates - Pre defined cordinates
     */
    constructor(totalBikes = 1, bikes = [], cordinates = {}) {
        this.totalBikes = totalBikes;
        this.bikes = bikes;
        this.cordinates = cordinates;
    }

    /**
     * Method that sets pre defined cordinates.
     * @param {Array} coords
     */
    setCordinates(coords) {
        this.cordinates = coords;
    }

    /**
     * Method that starts the heartbeat.
     * @returns Void
     */
    startMovement() {
        if (this.movementInterval) { return; }

        this.movementInterval = setInterval(() => {
            this.heartbeat();
            this.sendUpdates();
        }, this.heartbeat_timer);
        console.log("Movement started");
    }

    /**
     * Mehtod that stops the hearbeat
     */
    stopMovement() {
        if (this.movementInterval) {
            clearInterval(this.movementInterval);
            this.movementInterval = null;
            console.log("Movement has stopped");
        }
    }

    /**
     * Method that holds the heartbeat
     * @returns {Array} - Array of event
     */
    heartbeat() {
        for (let key in this.cordinates) {
            if (!this.bikes[key]) {
                continue;
            }
            // Updated
            if (this.cordinates[key].length !== 0) {
                this.bikes[key].status = 10;
                const nextCordinate = this.cordinates[key].shift();

                this.bikes[key].move(nextCordinate);

                console.log(`Bike ${key} has updated it's cords`);
            } else {
                console.log(`Bike: ${key} has no cordinates left ${this.cordinates[key].length}`);
                this.bikes[key].status = 40;
                this.cordinates[key] = [];
            }
        }
        return { event: 'Heartbeat updated' };
    }

    /**
     * Method that updates the bikes, works like a socket that emits the bikes
     */
    sendUpdates() {
        const data = this.bikes.map((b) => ({
            id: b.id,
            cords: b.cords,
            status: b.status,
            occupied: b.occupied,
            city_id: b.city_id,
            speed: b.speed
        }));

        parentPort?.postMessage({
            type: "telemetry",
            data,
        });
    }

    /**
     * Mehtod that starts heartbeat with pre-defined bikes.
     * Used when loading bikes from database.
     * @param {Array} payload - bikes
     * @returns {Array} - Array with event and data
     */
    startFromMemory(payload) {
        // Retrives all bikes from db
        // Start bike movement
        this.bikes = [];
        for (let bike of payload) {
            this.bikes.push(new Device(
                bike.id,
                bike.location,
                bike.city_id,
                bike.battery,
                bike.status,
                bike.occupied,
            ));
        }
        this.startMovement();
        return { event: `Bikes: ${this.bikes.length}`, data: this.bikes };
    }

    /**
     * Method for start of simulation.
     * @returns {Array} - Event with data.
     */
    start() {
        if (this.bikes.length >= this.totalBikes) {
            return {
                event: `Bikes already at max capacity: ${this.bikes.length}/${this.totalBikes}`
            };
        }

        for (let i = 0; i < this.totalBikes; i++) {
            this.bikes.push(new Device(i, { x: 0, y: 0 }, i.city_id));
        }
        this.startMovement();
        return { event: `Bikes: ${this.bikes.length}`, data: this.bikes };
    }

    /**
     * Method that sets bikes to an empty array.
     * @returns {Array} - Event
     */
    end() {
        this.stopMovement();
        // Save all bike positions to database
        this.bikes = [];
        return { event: 'stopping worker' };
    }

    /**
     * Method that returns an array containing a list of all bikes.
     * @returns {Array} - Event with data
     */
    list() {
        return { event: 'Listing all bikes', data: this.bikes };
    }

    /**
     * Getter method for device based on id.
     * @param {Array} payload
     * @returns {Array} - Device
     */
    getBike(payload) {
        return { event: 'Retriving bike', data: this.bikes[payload.id] };
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
            return { event: 'Succesfully added routes', data: payload };
        } catch (error) {
            console.error('Invalid JSON structure', error.message);
            return { event: 'Invalid JSON format' };
        }
    }

    /**
     * Method used to move individual bikes.
     * @param {Array} bike
     * @returns {Array} - Array of event.
     */
    moveSpecific(bike) {
        if (this.bikes.length == 0) {
            this.start();
        }

        this.bikes[bike.id].move({
            x: Number(bike.x),
            y: Number(bike.y)
        });

        return { event: `Bike #${bike.id} changed position to {x: ${bike.x}, y: ${bike.y}}` };
    }
};

/**
 * Function that creates an instance of simulator class.
 * @param {any} options - total bikes
 * @returns {Simulator} - Returns instance of class.
 */
export function createSimulator(options) {
    return new Simulator(options?.totalBikes ?? 1);
}


// Instance of Simulator, this is active while the main thread is.
const simm = createSimulator({ totalBikes: 1000 });

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
        return { id, error: `Unknown call ${cmd}` };
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
