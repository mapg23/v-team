"use strict"
process.env.NODE_ENV = "test";

import Device from "../Devices.mjs";


describe('Test device', () => {

    test('Device initialization', () => {
        const device = new Device(0, { x: 0, y:0}, 100, 10, false, 0);

        expect(device).toBeInstanceOf(Device);
    });

    test('Move method', () => {
        const device = new Device(0, { x: 0, y:0}, 100, 10, false, 0);

        device.move({ x: 100, y: 100});

        expect(device.cords).toEqual({ x: 100, y:100 });
    });

    test('Move method, bad status', () => {
        const device = new Device(0, { x: 0, y:0}, 100, 10, false, 0);
        device.status = 60;

        let res = device.move({ x: 100, y: 100});
        expect(res).toEqual({ event: 'bike is unable to move, reason:', data: 60});
    });

    // test('Self diagnostics method, high battery', () => {
    //     const device = new Device(0, { x: 0, y:0}, 100, 10, false, 0);
    //     device.status = 10;
    //     device.battery = 21;
    //     device.selfDiagnostics();

    //     expect(device.status).toEqual(50);
    // });

    // test('Self diagnostics method, low battery', () => {
    //     const device = new Device(0, { x: 0, y:0}, 100, 10, false, 0);
    //     device.status = 50;
    //     device.battery = 10
    //     device.selfDiagnostics();
        
    //     expect(device.status).toEqual(10);
    // });
});