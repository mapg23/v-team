"use strict"
process.env.NODE_ENV = "test";

import Simulator, { handleWorkerMessage, createSimulator } from "../Simulator.mjs";
import Device from "../Devices.mjs";
import { randomInt } from "node:crypto";

function BikeListHelper(count){
    return Array.from({ length: count }, (_, index) => 
        new Device(index, {x: 0, y: 0})
    );
}

describe('Performance testing', () => {

    const generateCords = async (count) => {
        const cords = {};
        for(let i = 0; i < count; i++) {
            let randomX = randomInt(1000);
            let randomY = randomInt(1000);
            cords[i] = [{ x: randomX, y: randomY}];
        }
        return cords;
    };

    const simulateHeartbeat = async (count) => {
        const simm = createSimulator({ total_bikes: count });
        
        const start = performance.now();
        simm.start();
        const startTime = performance.now() - start;
        
        const cords = generateCords(count);
        simm.setCordinates(cords);

        const heartbeatStart = performance.now();
        simm.heartbeat();
        const heartbeat = performance.now() - heartbeatStart;

        return { startTime, heartbeat };
    }

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
    test('start unknown jobb', async () => {
        const msg = {id: "123", cmd: "invalid-work-call" };
        const result = await handleWorkerMessage(msg, createSimulator());
    
        expect(result).toHaveProperty('error', `Unknown call invalid-work-call`);
    });
    
    test('start job call', async () => {
        const simm = new Simulator(5);
    
        const msg = {id: "1", cmd: "start-job"};
        const result = await handleWorkerMessage(msg, simm);
    
        expect(result).toHaveProperty(
            'event', `Bikes: ${simm.bikes.length}`
        );
    
        expect(result.data.length).toBe(5);
        expect(result.data[0]).toBeInstanceOf(Device);
    });

});

describe('Testing Simulator', () => { 
    test('Creation of Simulator class', () => {
        const bikeCount = 123;
        const bikes = BikeListHelper(bikeCount);
        const simm = new Simulator(bikeCount, bikes, {});
        
        expect(simm.bikes).toEqual(bikes);
        expect(simm.total_bikes).toEqual(bikeCount);
        expect(simm.cordinates).toEqual({});
    });
    
    test('Start method', () => {
        const bikes = BikeListHelper(100);
        const simm = new Simulator(100);
        
        expect(simm.bikes).toEqual([]);
        simm.start();
        expect(simm.bikes).toEqual(bikes);
        let res = simm.start();
        expect(res).toHaveProperty('event', `Bikes already at max capacity: ${simm.bikes.length}/${simm.total_bikes}`);
    });
    
    test('End method', () => {
        
    });
    
    test('List method', () => {
        const simm = new Simulator(1, [], {});
        const bikes = [new Device(0, {x:0,y:0})];
        simm.start();
        
        let result = simm.list();
        
        expect(result).toHaveProperty('event', 'Listing all bikes');
        expect(result).toHaveProperty('data', bikes);
        expect(result.data).toEqual(bikes);
    });
});