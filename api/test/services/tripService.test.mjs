import {TripService} from "../../src/services/tripService.mjs";

describe("tripService", () => {
    let tripModel;
    let bikeModel;
    let parkings;
    let tripService;

    beforeEach(() => {
        tripModel = {
            createTrip: jest.fn(),
            getTripById: jest.fn(),
            updateTrip: jest.fn(),
        };

        bikeModel = {
            getBikeById: jest.fn(),
            updateBike: jest.fn(),
        };

        parkings = {
            getParkings: jest.fn(),
        };

        tripService = new TripService(tripModel, bikeModel, parkings);

        // Standard date to use
        jest.spyOn(tripService, "getDbDate").mockReturnValue("2025-12-24 10:00:00");
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("getDbDate check that date is created", async () => {
        const date = await tripService.getDbDate();

        expect(date).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
    });

    // getParkingZones
    test("getParkingZones loads zones and not re fetches", async () => {
        parkings.getParkings.mockResolvedValue([
            { min_lat: 10, max_lat: 20, min_long: 30, max_long: 40 }
        ]);

        const zones1 = await tripService.getParkingZones();
        const zones2 = await tripService.getParkingZones();

        expect(zones1).toEqual(zones2);
        expect(parkings.getParkings).toHaveBeenCalledTimes(1);
    });

    test("getParkingZones throws if empty", async () => {
        parkings.getParkings.mockResolvedValue([]);

        await expect(tripService.getParkingZones())
            .rejects
            .toThrow("Could not get parking zones");
    });

    // startTrip
    test("startTrip creates trip and updates bike status", async () => {
        bikeModel.getBikeById.mockResolvedValue([
            { id: 7, latitude: 59.1, longitude: 18.1 }
        ]);

        tripModel.createTrip.mockResolvedValue({
            affectedRows: 1,
            insertId: 99
        });

        bikeModel.updateBike.mockResolvedValue({ affectedRows: 1 });

        tripModel.getTripById.mockResolvedValue([
            { id: 99, scooter_id: 7 }
        ]);

        const result = await tripService.startTrip({
            userId: 1,
            bikeId: 7
        });

        expect(tripModel.createTrip).toHaveBeenCalled();
        expect(bikeModel.updateBike).toHaveBeenCalledWith(7, { status: 40 });
        expect(result[0].id).toBe(99);
    });

    test("startTrip throws if bike not found", async () => {
        bikeModel.getBikeById.mockResolvedValue([]);

        await expect(
            tripService.startTrip({ userId: 1, bikeId: 666 })
        ).rejects.toThrow("Bike with id: 666 was not found");
    });

    // isInZone / isInParking
    test("isInZone returns true when inside", () => {
        const zone = {
            min_lat: 10,
            max_lat: 20,
            min_long: 30,
            max_long: 40
        };

        expect(tripService.isInZone(zone, 15, 35)).toBe(true);
    });

    test("isInParking returns true if any zone matches", async () => {
        parkings.getParkings.mockResolvedValue([
            { min_lat: 10, max_lat: 20, min_long: 30, max_long: 40 }
        ]);

        const result = await tripService.isInParking(15, 35);

        expect(result).toBe(true);
    });


    // calculateCost
    test("calculateCost add parking fee when not parked in parking", async () => {
        const bike = { latitude: 1, longitude: 1 };
        const trip = { start_time: "2025-12-24 08:00:00" };
        // endTime: "2025-12-24 10:00:00"
        const cost = await tripService.calculateCost(bike, trip, false);
        // const calculatedCost = 120 * 2.5 + 35 + 80; = 415
        // 2h @ 2.50 / minut + startavgift + felparkering.

        expect(cost).toBe("415.00");
    });

    test("calculateCost gives discount when taken into parking", async () => {
        jest.spyOn(tripService, "isInParking").mockResolvedValue(false);

        const bike = {};
        const trip = {
            start_time: "2025-12-24 08:00:00",
            start_latitude: 1,
            start_longitude: 1
        };

        const cost = await tripService.calculateCost(bike, trip, true);

        expect(cost).toBe("328.00");
    });

    // endTrip
    test("endTrip updates trip, bike and returns uppdated trip", async () => {
        tripModel.getTripById
            .mockResolvedValueOnce([{ id: 1, scooter_id: 7 }])
            .mockResolvedValueOnce([{ id: 1, cost: "100.00" }]);

        bikeModel.getBikeById.mockResolvedValue([
            { id: 7, latitude: 10, longitude: 20, battery: 50 }
        ]);

        parkings.getParkings.mockResolvedValue([
            { min_lat: 0, max_lat: 20, min_long: 0, max_long: 30 }
        ]);

        tripModel.updateTrip.mockResolvedValue({ affectedRows: 1 });
        bikeModel.updateBike.mockResolvedValue({ affectedRows: 1 });

        const result = await tripService.endTrip(1);

        expect(tripModel.updateTrip).toHaveBeenCalled();
        expect(bikeModel.updateBike).toHaveBeenCalled();
        expect(result.id).toBe(1);
    });

    test("throws if no trip found", async () => {
        tripModel.getTripById.mockResolvedValue([]);

        await expect(tripService.endTrip(123))
            .rejects
            .toThrow("Could not find trip with id 123");
    });
});

// REFACTOR dependency injection.
// import tripModel from "../../../src/models/trips.mjs";
// import zonesModel from "../../../src/models/zones.mjs";
// import bikeStarter from "../../../src/models/bikes.mjs";
// const bikeModel = bikeStarter();

// jest.mock("../../src/models/bikes.mjs", () => {
//     return jest.fn(() => ({
//         getBikeById: jest.fn(),
//         updateBike: jest.fn(),
//     }));
// });
// jest.mock("../../src/models/zones.mjs");
// jest.mock("../../src/models/trips.mjs");

// describe('isInZone', () => {
//     const zone = {
//         min_lat: 57.86,
//         max_lat: 57.87,
//         min_long: 14.12,
//         max_long: 14.13,
//     };

//     test('returns true when inside zone', () => {
//         const result = tripService.isInZone(zone, 57.865, 14.125);

//         expect(result).toBe(true);
//     });

//     test('returns false when outside zone', () => {
//         const result = tripService.isInZone(zone, 57.9, 14.125);

//         expect(result).toBe(false);
//     });
// });

// describe('calculateRent', () => {
//     test('calculates cost correctly', () => {
//         const start = '2025-01-01 10:00:00';
//         const end = '2025-01-01 10:10:00';

//         const cost = tripService.calculateRent(start, end);

//         expect(cost).toBe(50);
//     });
// });
