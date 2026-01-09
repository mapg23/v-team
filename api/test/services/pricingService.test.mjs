import { PricingService } from "../../src/services/pricingService.mjs";

jest.mock("../../src/models/prices.mjs");

describe("tripService", () => {
    let pricingService;
    let pricingModel;

    beforeEach(() => {
        pricingModel = {
            getPricesByCityId: jest.fn()
        };

        pricingService = new PricingService(pricingModel);

        // Standard date to use
        // jest.spyOn(tripService, "_getDbDate").mockReturnValue("2025-12-24 10:00:00");
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // // calculateCost
    test("calculateTripCost add parking fee when not parked in parking", async () => {
        pricingModel.getPricesByCityId.mockReturnValue([
            {start_fee: 10, minute_fee: 1, parking_fee: 20, discount_multiplier: 0.5}
        ]);
        const bike = { latitude: 1, longitude: 1, city_id: 1 };
        const bikeInUse = {start_time: "2025-12-24 08:00:00"};
        const endTime = "2025-12-24 08:10:00";

        const cost = await pricingService.calculateTripCost(bike, bikeInUse, false, endTime);

        expect(cost).toBe("40.00");
    });

    test("calculateTripCost gives discount when taken into parking", async () => {
        pricingModel.getPricesByCityId.mockReturnValue([
            {start_fee: 10, minute_fee: 1, parking_fee: 20, discount_multiplier: 0.5}
        ]);
        const bike = { latitude: 1, longitude: 1, city_id: 1 };
        const bikeInUse = {start_time: "2025-12-24 08:00:00", start_zone_type: null};
        const endTime = "2025-12-24 08:10:00";

        // No parking fee and half start fee
        const cost = await pricingService.calculateTripCost(bike, bikeInUse, true, endTime);

        expect(cost).toBe("15.00");
    });
});
