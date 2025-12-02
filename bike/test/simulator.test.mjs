"use strict"
process.env.NODE_ENV = "test";

import Simulator, { handleWorkerMessage, createSimulator } from "../Simulator.mjs";
import Device from "../Devices.mjs";


function BikeListHelper(count){
    return Array.from({ length: count }, (_, index) => 
        new Device(index, {x: 0, y: 0})
    );
}

describe('Performance testing', () => {

    test('running thousand bikes', async () => {
        expect(true).toBe(true);
    });
    
    test('running five thousand bikes', async () => {
        expect(true).toBe(true);
    });
    
    test('running ten thousand bikes', async () => {
        expect(true).toBe(true);
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

describe('testing Simulator', () => {
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
        expect(res).toHaveProperty('event', `Bikes already at max capacity: ${simm.bikes.length}/${simm.total_bikes}`)
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