import tripService from "../../../src/services/tripService.mjs";
// import tripModel from "../../../src/models/trips.mjs";
// import zonesModel from "../../../src/models/zones.mjs";
// import bikeStarter from "../../../src/models/bikes.mjs";
// const bikeModel = bikeStarter();

jest.mock("../../../src/models/bikes.mjs", () => {
    return jest.fn(() => ({
        getBikeById: jest.fn(),
        updateBike: jest.fn(),
    }));
});
jest.mock("../../../src/models/zones.mjs");
jest.mock("../../../src/models/trips.mjs");

describe('isInZone', () => {
    const zone = {
        min_lat: 57.86,
        max_lat: 57.87,
        min_long: 14.12,
        max_long: 14.13,
    };

    test('returns true when inside zone', () => {
        const result = tripService.isInZone(zone, 57.865, 14.125);

        expect(result).toBe(true);
    });

    test('returns false when outside zone', () => {
        const result = tripService.isInZone(zone, 57.9, 14.125);

        expect(result).toBe(false);
    });
});

describe('calculateRent', () => {
    test('calculates cost correctly', () => {
        const start = '2025-01-01 10:00:00';
        const end = '2025-01-01 10:10:00';

        const cost = tripService.calculateRent(start, end);

        expect(cost).toBe(50);
    });
});

// describe('endTrip', () => {
//     beforeEach(() => {
//         tripModel.getTripById.mockResolvedValue([{
//             id: 4,
//             user_id: 1,
//             scooter_id: 2,
//             cost: 0,
//             start_latitude: 57.8629,
//             start_longitude: 15.1271,
//             end_latitude: null,
//             end_longitude: null,
//             start_time: "2025-12-13T23:34:12.000Z",
//             end_time: null

//         }]);
//         bikeModel.getBikeById.mockResolvedValue([{
//             id: 2,
//             status: 40,
//             battery: 76,
//             longitude: 15.1271,
//             latitude: 57.8629,
//             occupied: 0,
//             city_id: 1
//         }]);
//         tripModel.updateTrip.mockResolvedValue({affectedRows: 1, great_success: true});
//         bikeModel.updateBike.mockResolvedValue({affectedRows: 1, great_success: true});
//     });
//     afterEach(() => {
//         jest.restoreAllMocks();
//     });
//     test('ends trip and returns updated trip', async () => {
//         const result = await tripService.endTrip(4);
//         // expect(result).toEqual({
//         //     id: 4,
//         //     user_id: 1,
//         //     scooter_id: 2,
//         //     cost: 0,
//         //     start_latitude: 57.8629,
//         //     start_longitude: 15.1271,
//         //     end_latitude: 57.8629,
//         //     end_longitude: 15.1271,
//         //     start_time: "2025-12-13T23:34:12.000Z",
//         //     end_time: null
//         // });

//         // expect(result.cost).toBeGreaterThan(0);
//         expect(result).rejects.toThrow("Could not find trip with id 2");
//     });
// });
