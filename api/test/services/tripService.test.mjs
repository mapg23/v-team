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
        ).rejects.toThrow(`Users wallet with id 2 has insufficiant funds`);
    });
});
