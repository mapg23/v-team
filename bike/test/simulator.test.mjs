"use strict"

import Simulator from "../Simulator.mjs";
import Device from "../Devices.mjs";

test('Creation of Simulator class', () => {
    const bikeCount = 123;
    const bikes = Array.from({ length: bikeCount }, (_, index) => 
        new Device(index, {x: 0, y: 0})
    );
    const simm = new Simulator(bikeCount, bikes, {});
    
    expect(simm.bikes).toEqual(bikes);
    expect(simm.total_bikes).toEqual(bikeCount);
    expect(simm.cordinates).toEqual({});
});

test('List method', () => {
    const simm = new Simulator(1, [], {});
    const bikes = [new Device(0, {x:0,y:0})]
    simm.start();

    let result = simm.list();

    expect(result).toHaveProperty('event', 'Listing all bikes');
    expect(result).toHaveProperty('data', bikes);
    expect(result.data).toEqual(bikes);
});