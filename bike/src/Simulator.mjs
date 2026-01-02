"use strict";
import { parentPort } from "worker_threads";

import Device from './Devices.mjs';

/**
 * Simulator class
 */
class Simulator {
    bikes = [];
    totalBikes = 1;
    cordinates = {};

    heartbeat_count = 0;
    movementInterval = null;

    /**
     * Constructor for simulator
     * @param {Number} totalBikes
     * @param {Array} bikes
     * @param {Array} cordinates
     */
    constructor(totalBikes = 1, bikes = [], cordinates = {}) {
        this.totalBikes = totalBikes;
        this.bikes = bikes;
        this.cordinates = cordinates;
    }

    /**
     * Method to set pre-defined cordinates.
     * @param {Array} coords
     */
    setCordinates(coords) {
        this.cordinates = coords;
    }

    /**
     * Method to start heartbeat
     * @returns Void
     */
    startMovement() {
        if (this.movementInterval) {return;}

        this.movementInterval = setInterval(() => {
            this.heartbeat();
            this.sendUpdates();
        }, 3000);
        console.log("Movement started");
    }

    /**
     * Mrthod to stop heartbeat
     */
    stopMovement() {
        if (this.movementInterval) {
            clearInterval(this.movementInterval);
            this.movementInterval = null;
            console.log("Movement has stopped");
        }
    }

    /**
     * Method for heartbeat
     * @returns {Array|void} - Event array
     */
    heartbeat() {
        for (let key in this.cordinates) {
            let index = this.bikes.findIndex(function (device) {
                return device.getId() === Number(key);
            });

            if (index === -1) {
                continue;
            }

            // if (this.cordinates[key].length === 0) {
            //     console.log(`Bike: ${key} has no cordinates left ${this.cordinates[key].length}`)
            //     this.bikes[index].status = 40;
            //     this.cordinates[key] = [];
            //     continue;
            // }

            /////// J
            // Jag la till '!this.cordinates[key]' eftersom den annars kraschade
            // när jag testade i Postman.
            // Gamla versionen är den utkommenterade koden ovan.
            if (!this.cordinates[key] || this.cordinates[key].length === 0) {
                console.log(`Bike: ${key} has no coordinates left`);
                this.bikes[index].status = 40;
                this.cordinates[key] = [];
                continue;
            }

            this.bikes[index].status = 10;
            const nextCordinate = this.cordinates[key].shift();

            this.bikes[index].move(nextCordinate);
        }
        return { event: 'Heartbeat updated' };
    }

    /**
     * Method that sends bike positions like a soocket to api
     */
    sendUpdates() {
        const data = this.bikes.map((b) => ({
            id: b.id,
            cords: b.cords,
            status: b.status,
            occupied: b.occupied,
            city_id: b.city_id,
            speed: b.speed,
            current_zone_type: b.current_zone_type,
            current_zone_id: b.current_zone_id,
        }));

        parentPort?.postMessage({
            type: "telemetry",
            data,
        });
    }

    /**
     * Method that starts simulator with pre-defined bikes from database.
     * @param {Array} payload
     * @returns {Array|void}
     */
    startFromMemory(payload) {
        // Retrives all bikes from db
        // Start bike movement
        this.bikes = [];
        for (let bike of payload) {
            let parsedCords = { x: Number(bike.longitude), y: Number(bike.latitude) };

            this.bikes.push(new Device({
                id: bike.id,
                cords: parsedCords,
                battery: bike.battery,
                status: bike.status,
                occupied: bike.occupied,
                speed: 0,
                city_id: bike.city_id,
                current_zone_type: bike.current_zone_type,
                current_zone_id: bike.current_zone_id
            }));
            // this.bikes.push(new Device(
            //     bike.id,
            //     parsedCords,
            //     bike.battery,
            //     bike.status,
            //     bike.occupied,
            //     0,
            //     bike.city_id,
            //     bike
            // ));
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

    getBikeStatus(payload) {
        return {
            event: 'retriving bike status',
            data: this.bikes[Number(payload.id)].getStatus()
        };
    }

    setBikeStatus(payload) {
        this.bikes[Number(payload.id).setStatus(payload.status)]
        return { event: `id for bike ${payload.id} set to status ${payload.status}` };
    }


    /**
     *
     * @param {*} payload
     * @returns
     */
    moveSpecific(payload) {
        try {
            this.cordinates[Number(payload.id)] = payload.cords;
            return { event: 'succesfully Moved a bike', data: payload };
        } catch (error) {
            console.error('Invalid Payload');
            return { event: 'Invalid Payload' };
        }
    }
    /**
     * Method to update a bike's properties and position in the simulator.
     * @param {*} payload - Object containing bikeId, status, battery,
     * occupied, zoneType, zoneId, longitude, latitude
     * @returns {Object} - Event with result and updated bike data if
     * successful, or error message if not
     */
    updateBike(payload) { ///// J
        try {
            const bike = this.bikes.find(b => b.id === Number(payload.bikeId));

            if (!bike) {
                console.error('Bike not found');
                return { event: 'Bike not found' };
            }

            bike.status = Number(payload.status);
            bike.battery = Number(payload.battery);
            bike.occupied = payload.occupied;
            bike.current_zone_type = payload.zoneType;
            bike.current_zone_id = Number(payload.zoneId);

            bike.move({ x: payload.longitude, y: payload.latitude });
            this.sendUpdates();

            return { event: 'Bike updated', data: bike };
        } catch (error) {
            console.error('Invalid Payload', error.message);
            return { event: 'Invalid Payload' };
        }
    }
};

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
        'update-bike': () => simm.updateBike(payload), ///// J
        'get-bike-status': () => simm.getBikeStatus(payload),
        'set-bike-status': () => simm.setBikeStatus(payload),
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
