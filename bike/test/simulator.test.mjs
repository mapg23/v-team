"use strict";
process.env.NODE_ENV = "test";

import Simulator, { handleWorkerMessage, createSimulator } from "../src/Simulator.mjs";
import Device from "../src/Devices.mjs";
import { randomInt } from "node:crypto";

function BikeListHelper(count) {
    return Array.from({ length: count }, (_, index) =>
        new Device(index, { x: 0, y: 0 })
    );
}

async function generateCords(count) {
    const cords = {};

    for (let i = 0; i < count; i++) {
        let randomX = randomInt(1000);
        let randomY = randomInt(1000);

        cords[i] = [{ x: randomX, y: randomY }];
    }
    return cords;
}

describe('Performance testing', () => {
    afterEach(() => {
        jest.clearAllTimers();
    });

    const simulateHeartbeat = async (count) => {
        const simm = createSimulator({ totalBikes: count });

        const start = performance.now();

        simm.start();
        const startTime = performance.now() - start;

        const cords = generateCords(count);

        simm.setCordinates(cords);

        const heartbeatStart = performance.now();

        simm.heartbeat();
        const heartbeat = performance.now() - heartbeatStart;

        simm.end();

        return { startTime, heartbeat };
    };

    test('running thousand bikes', async () => {
        let res = await simulateHeartbeat(1000);

        expect(res.startTime).toBeLessThan(50);
        expect(res.heartbeat).toBeLessThan(50);
    });

    test('running five thousand bikes', async () => {
        let res = await simulateHeartbeat(5000);

        expect(res.startTime).toBeLessThan(100);
        expect(res.heartbeat).toBeLessThan(100);
    });

    test('running ten thousand bikes', async () => {
        let res = await simulateHeartbeat(10000);

        expect(res.startTime).toBeLessThan(200);
        expect(res.heartbeat).toBeLessThan(200);
    });
});

describe('testing the worker calls', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    test('start unknown jobb', async () => {
        const msg = { id: "123", cmd: "invalid-work-call" };
        const result = await handleWorkerMessage(msg, createSimulator());

        expect(result).toHaveProperty('error', `Unknown call invalid-work-call`);
    });

    test('start job call', async () => {
        const simm = new Simulator(5);

        const msg = { id: "1", cmd: "start-job" };
        const result = await handleWorkerMessage(msg, simm);

        expect(result).toHaveProperty(
            'event', `Bikes: ${simm.bikes.length}`
        );

        expect(result.data.length).toBe(5);
        expect(result.data[0]).toBeInstanceOf(Device);
    });
});

describe('Testing Simulator', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
    });


    test('Creation of Simulator class', () => {
        const bikeCount = 123;
        const bikes = BikeListHelper(bikeCount);
        const simm = new Simulator(bikeCount, bikes, {});

        expect(simm.bikes).toEqual(bikes);
        expect(simm.totalBikes).toEqual(bikeCount);
        expect(simm.cordinates).toEqual({});
    });

    test('Start method', () => {
        const bikes = BikeListHelper(100);

        const simm = new Simulator(100);

        expect(simm.bikes).toEqual([]);
        simm.start();
        jest.runOnlyPendingTimers();
        expect(simm.bikes).toEqual(bikes);
        let res = simm.start();

        jest.runOnlyPendingTimers();
        // eslint-disable-next-line
        expect(res).toHaveProperty('event', `Bikes already at max capacity: ${simm.bikes.length}/${simm.totalBikes}`);
        simm.end();
    });

    test('End method', () => {
        const bikes = BikeListHelper(100);
        const simm = new Simulator(100);

        expect(simm.bikes).toEqual([]);
        simm.start();
        jest.runOnlyPendingTimers();

        expect(simm.bikes).toEqual(bikes);
        simm.end();
        expect(simm.bikes).toEqual([]);
    });

    test('Heartbeat method, correct return', () => {
        const simm = new Simulator();
        let res = simm.heartbeat();

        jest.runOnlyPendingTimers();

        expect(res).toEqual({ event: 'Heartbeat updated' });
        simm.end();
    });

    test('Heartbeat method, updated bikes', async () => {
        const simm = new Simulator(11);
        const cords = await generateCords(11);

        simm.start();
        jest.runOnlyPendingTimers();
        simm.setCordinates(cords);
        const originalCords = { ...simm.bikes[10].cords };

        simm.heartbeat();
        expect(simm.bikes[10].cords).not.toEqual(originalCords);
        simm.end();
    });

    test('Heartbeat method, no cords left', async () => {
        const simm = new Simulator(10);

        const cords = {};

        for (let i = 0; i < 10; i++) {
            cords[i] = [];
        }

        simm.start();
        jest.runOnlyPendingTimers();

        simm.setCordinates(cords);

        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

        simm.heartbeat();

        for (let i = 0; i < 10; i++) {
            expect(simm.cordinates[i]).toEqual([]);
            expect(logSpy).toHaveBeenCalledWith(`Bike: ${i} has no cordinates left 0`);
        }
        simm.end();
        logSpy.mockRestore();
    });

    test('Heartbeat method, skipping bike (4)', () => {
        const simm = new Simulator(3);

        simm.start();
        jest.runOnlyPendingTimers();


        simm.setCordinates({
            0: [{ x: 1, y: 1 }],
            1: [{ x: 1, y: 1 }],
            2: [{ x: 1, y: 1 }],
            3: [{ x: 1, y: 1 }],
            4: [{ x: 1, y: 1 }],
            5: [{ x: 1, y: 1 }],
        });

        let res = simm.heartbeat();

        expect(simm.bikes[0].cords).toEqual({ x: 1, y: 1 });
        expect(simm.bikes[3]).toBeUndefined();
        expect(simm.bikes[4]).toBeUndefined();
        expect(simm.bikes[5]).toBeUndefined();

        expect(res).toEqual({ event: 'Heartbeat updated' });

        simm.end();
    });

    test('List method', () => {
        const simm = new Simulator(1, [], {});
        const bikes = [new Device(0, { x: 0, y: 0 })];

        simm.start();
        jest.runOnlyPendingTimers();


        let result = simm.list();

        expect(result).toHaveProperty('event', 'Listing all bikes');
        expect(result).toHaveProperty('data', bikes);
        expect(result.data).toEqual(bikes);
        simm.end();
    });

    test('getBike method', () => {
        const bikes = [
            new Device(0, { x: 123, y: 321 }, 99, 'new_status', false, 999),
            new Device(1, { x: 321, y: 123 }, 33, 'other_status', true, 33)
        ];

        const simm = new Simulator(2, bikes);

        simm.start();
        jest.runOnlyPendingTimers();


        let res = simm.getBike({ id: 1 });

        expect(res.data.id).toEqual(bikes[1].id);
        expect(res.data.battery).toEqual(bikes[1].battery);
        expect(res.data.cords).toEqual(bikes[1].cords);
        expect(res.data.occupied).toEqual(bikes[1].occupied);

        expect(res.data.speed).not.toEqual(bikes[0].speed);
        simm.end();
    });
});
