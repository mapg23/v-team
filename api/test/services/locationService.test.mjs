import { LocationService } from "../../src/services/locationService.mjs";
// import createParkings from "../../src/models/parkings.mjs";
// import createStations from "../../src/models/stations.mjs";

jest.mock("../../src/models/parkings.mjs");
jest.mock("../../src/models/stations.mjs");

describe("locationService", () => {
    let locationService;
    let parkingsModel;
    let stationsModel;

    beforeEach(() => {
        parkingsModel = {
            getParkings: jest.fn()
        };
        stationsModel = {
            getStations: jest.fn()
        };

        locationService = new LocationService(parkingsModel, stationsModel);

        // Standard date to use
        // jest.spyOn(tripService, "_getDbDate").mockReturnValue("2025-12-24 10:00:00");
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("fetchAllParkings loads zones", async () => {
        const zones = { min_lat: 10, max_lat: 20, min_long: 30, max_long: 40 };

        parkingsModel.getParkings.mockResolvedValue([zones]);

        const zonesRes = await locationService.fetchAllParkings();


        expect(zonesRes).toEqual([zones]);
        expect(parkingsModel.getParkings).toHaveBeenCalledTimes(1);
    });

    test("fetchAllStations loads stations", async () => {
        const stations = [{ id: 1, latitude: 10, longitude: 20 }];

        stationsModel.getStations.mockResolvedValue(stations);

        const stationsRes = await locationService.fetchAllStations();


        expect(stationsRes).toEqual(stations);
        expect(stationsModel.getStations).toHaveBeenCalledTimes(1);
    });

    // // isInZone / isInParking
    test("isInZone returns true when inside", () => {
        const zone = {
            min_lat: 10,
            max_lat: 20,
            min_long: 30,
            max_long: 40
        };

        expect(locationService.isInZone(zone, 15, 35)).toBe(true);
    });

    test("isInParking returns true if any zone matches", async () => {
        parkingsModel.getParkings.mockResolvedValue([
            { id: 13, min_lat: 10, max_lat: 20, min_long: 30, max_long: 40 }
        ]);

        const result = await locationService.isInParking(15, 35);

        expect(result).toBe(13);
    });
    test("isInParking returns null if no zone matches", async () => {
        parkingsModel.getParkings.mockResolvedValue([
            { id: 13, min_lat: 10, max_lat: 20, min_long: 30, max_long: 40 }
        ]);

        const result = await locationService.isInParking(21, 35);

        expect(result).toBe(null);
    });
    test("determineZone returns charging and id if zone matches", async () => {
        parkingsModel.getParkings.mockResolvedValue([
            { id: 13, min_lat: 10, max_lat: 20, min_long: 30, max_long: 40 }
        ]);
        stationsModel.getStations.mockResolvedValue([
            { id: 21, latitude: 21, longitude: 35 }

        ]);
        const result = await locationService.determineZone(21, 35);

        expect(result).toStrictEqual({type: "charging", id: 21});
    });

    test("isIncharging returns false if no zone matches", async () => {
        stationsModel.getStations.mockResolvedValue([
            { id: 21, latitude: 21, longitude: 35 }
        ]);

        const result = await locationService.isInCharging(22, 35);

        expect(result).toBe(false);
    });
});
