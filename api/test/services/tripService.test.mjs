import {TripService} from "../../src/services/tripService.mjs";

describe("tripService", () => {
    let trips;
    let bikeService;
    let pricingService;
    let walletService;
    let tripService;

    beforeEach(() => {
        trips = {
            createTrip: jest.fn(),
            getTripById: jest.fn(),
            updateTrip: jest.fn(),
        };

        bikeService = {
            findBikeById: jest.fn(),
            updateBike: jest.fn(),
        };

        pricingService = {
            getParkings: jest.fn(),
        };

        walletService = {
            findWalletByUserId: jest.fn(),
            updateWallet: jest.fn(),
        };

        tripService = new TripService(trips, bikeService, walletService, pricingService);

        // Standard date to use
        jest.spyOn(tripService, "_getDbDate").mockReturnValue("2025-12-24 10:00:00");
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("getDbDate check that date is created", async () => {
        const date = await tripService._getDbDate();

        expect(date).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
    });

    // // getParkingZones
    // test("getParkingZones loads zones and not re fetches", async () => {
    //     parkings.getParkings.mockResolvedValue([
    //         { min_lat: 10, max_lat: 20, min_long: 30, max_long: 40 }
    //     ]);

    //     const zones1 = await tripService.getParkingZones();
    //     const zones2 = await tripService.getParkingZones();

    //     expect(zones1).toEqual(zones2);
    //     expect(parkings.getParkings).toHaveBeenCalledTimes(1);
    // });

    // test("getParkingZones throws if empty", async () => {
    //     parkings.getParkings.mockResolvedValue([]);

    //     await expect(tripService.getParkingZones())
    //         .rejects
    //         .toThrow("Could not get parking zones");
    // });

    // // startTrip
    // test("startTrip creates trip and updates bike status", async () => {
    //     bikes.getBikeById.mockResolvedValue([
    //         { id: 7, latitude: 59.1111, longitude: 18.1111 }
    //     ]);

    //     wallets.getWalletByUserId.mockResolvedValue([{
    //         id: 1,
    //         userId: 1,
    //         balance: 1
    //     }]);

    //     trips.createTrip.mockResolvedValue({
    //         affectedRows: 1,
    //         insertId: 99
    //     });

    //     bikes.updateBike.mockResolvedValue({ affectedRows: 1 });

    //     trips.getTripById.mockResolvedValue([
    //         { id: 99, scooter_id: 7 }
    //     ]);

    //     const result = await tripService.startTrip({
    //         userId: 1,
    //         bikeId: 7
    //     });

    //     expect(trips.createTrip).toHaveBeenCalled();
    //     expect(bikes.updateBike).toHaveBeenCalledWith(7, { status: 40 });
    //     expect(result[0].id).toBe(99);
    // });

    // test("startTrip throws if bike not found", async () => {
    //     bikeService.findBikeById.mockResolvedValue([]);
    //     walletService.findWalletByUserId.mockResolvedValue({
    //         id: 2,
    //         userId: 1,
    //         balance: 1
    //     });

    //     await expect(tripService.startTrip({ userId: 1, bikeId: 666 }))
    //         .rejects.toThrow("Bike with id: 666 was not found");
    // });

    test("startTrip throws if wallet is empty", async () => {
        bikeService.findBikeById.mockResolvedValue([
            { id: 7, latitude: 59.1111, longitude: 18.1111 }
        ]);

        walletService.findWalletByUserId.mockResolvedValue({
            id: 2,
            userId: 1,
            balance: 0
        });


        await expect(
            tripService.startTrip({ userId: 1, bikeId: 7 })
        ).rejects.toThrow(`Users wallet 2 has insufficiant funds`);
    });

    // // isInZone / isInParking
    // test("isInZone returns true when inside", () => {
    //     const zone = {
    //         min_lat: 10,
    //         max_lat: 20,
    //         min_long: 30,
    //         max_long: 40
    //     };

    //     expect(tripService.isInZone(zone, 15, 35)).toBe(true);
    // });

    // test("isInParking returns true if any zone matches", async () => {
    //     parkings.getParkings.mockResolvedValue([
    //         { min_lat: 10, max_lat: 20, min_long: 30, max_long: 40 }
    //     ]);

    //     const result = await tripService.isInParking(15, 35);

    //     expect(result).toBe(true);
    // });


    // // calculateCost
    // test("calculateCost add parking fee when not parked in parking", async () => {
    //     const bike = { latitude: 1, longitude: 1 };
    //     const trip = { start_time: "2025-12-24 08:00:00" };
    //     // endTime: "2025-12-24 10:00:00"
    //     const cost = await tripService.calculateCost(bike, trip, false);
    //     // const calculatedCost = 120 * 2.5 + 30 + 80; = 410
    //     // 2h @ 2.50 / minut + startavgift + felparkering.

    //     expect(cost).toBe("410.00");
    // });

    // test("calculateCost gives discount when taken into parking", async () => {
    //     jest.spyOn(tripService, "isInParking").mockResolvedValue(false);

    //     const bike = {};
    //     const trip = {
    //         start_time: "2025-12-24 08:00:00",
    //         start_latitude: 1,
    //         start_longitude: 1
    //     };

    //     const cost = await tripService.calculateCost(bike, trip, true);

    //     expect(cost).toBe("315.00");
    // });

    // // endTrip
    // test("endTrip updates trip, bike and returns uppdated trip", async () => {
    //     trips.getTripById
    //         .mockResolvedValueOnce([{ id: 1, scooter_id: 7 }])
    //         .mockResolvedValueOnce([{ id: 1, cost: "100.00" }]);

    //     bikes.getBikeById.mockResolvedValue([
    //         { id: 7, latitude: 10, longitude: 20, battery: 50 }
    //     ]);

    //     parkings.getParkings.mockResolvedValue([
    //         { min_lat: 0, max_lat: 20, min_long: 0, max_long: 30 }
    //     ]);
    //     wallets.getWalletByUserId.mockResolvedValue([{id: 1, user_id: 1, balance: 1 }]);

    //     trips.updateTrip.mockResolvedValue({ affectedRows: 1 });
    //     bikes.updateBike.mockResolvedValue({ affectedRows: 1 });
    //     wallets.updateBike.mockResolvedValue({ affectedRows: 1 });

    //     const result = await tripService.endTrip(1);

    //     expect(trips.updateTrip).toHaveBeenCalled();
    //     expect(bikes.updateBike).toHaveBeenCalled();
    //     expect(result.id).toBe(1);
    // });

    // test("throws if no trip found", async () => {
    //     trips.getTripById.mockResolvedValue([]);

    //     await expect(tripService.endTrip(123))
    //         .rejects
    //         .toThrow("Could not find trip with id 123");
    // });
});
