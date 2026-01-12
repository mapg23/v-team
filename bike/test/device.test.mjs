"use strict";
process.env.NODE_ENV = "test";

import Device from "../src/Devices.mjs";


describe('Test device', () => {
    const creeateMockDevice = (options = {}) => {
        if (Object.keys(options).length === 0) {
            return new Device({
                id: 0,
                cords: { x: 0, y: 0 },
                battery: 100,
                status: 10,
                occupied: false,
                speed: 0,
                city_id: 0
            });
        }
        return new Device(options);
    };

    test('Device initialization', () => {
        const device = new Device({
            id: 0,
            cords: { x: 0, y: 0 },
            battery: 100,
            status: 10,
            occupied: false,
            speed: 0
        });

        expect(device).toBeInstanceOf(Device);
    });

    test('Move method', () => {
        const device = new Device(0, { x: 0, y: 0 }, 100, 10, false, 0);

        device.move({ x: 100, y: 100 });

        expect(device.cords).toEqual({ x: 100, y: 100 });
    });

    test('Move method, bad status', () => {
        const device = new Device({
            id: 0,
            cords: { x: 0, y: 0 },
            battery: 100,
            status: 10,
            occupied: false,
            speed: 0
        });

        device.setStatus(60);

        let res = device.move({ x: 100, y: 100 });

        expect(res).toEqual({ event: 'bike is unable to move', data: 60 });
    });

    test('getId method', () => {
        const device = creeateMockDevice();

        expect(device.id).toBe(0);

        expect(device.getId()).toBe(0);
    });

    test('getCityId && setCityId', () => {
        const device = creeateMockDevice();

        device.setCityId(123);

        expect(device.getCityId()).toBe(123);
    });

    test('getStatus && setStatus', () => {
        const device = creeateMockDevice();

        expect(device.getStatus()).toBe(10);

        device.setStatus(20);
        expect(device.getStatus()).toBe(20);
    });
});
