import tripsModel from "../models/trips.mjs";
import BikeService from "../services/bikeService.mjs";
import WalletsService from "../services/walletService.mjs";
import PricingService from "./pricingService.mjs";

//potential refactor: controller gets bike & wallet.

class TripService {
    constructor(
        tripModel = tripsModel,
        bikeService = BikeService,
        walletsService = WalletsService,
        pricingService = PricingService
    ) {
        /**
         * Inject the models class is depending on.
         */
        this.tripsModel = tripModel;
        this.bikeService = bikeService;
        this.walletsService = walletsService;
        this.pricingService = pricingService;
    }

    /**
     * Checks that a trip with the corresponding id exists and returns it.
     *
     * @param {string} tripId A numeric value in string format.
     * @returns {Object} trip The trip with the argumented id.
     */
    async getTripById(tripId) {
        const tripResult = await this.tripsModel.getTripById(tripId);
        const trip = tripResult[0];

        if (!trip) {
            throw new Error(`Trip with id: ${tripId} was not found`);
        }
        return trip;
    }

    /**
     * Start a rent of a bike, and set bikes status to 40 (occupied).
     * @param {Object} data An object containing customers user id and bikes id.
     * @returns {object} The inserted transaction object.
     */
    async startTrip(data) {
        const userId = data.userId;
        const bikeId = data.bikeId;
        const now = this.getDbDate();

        const bike = await this.bikeService.getBikeById(bikeId);
        const wallet = await this.walletsService.getWalletByUserId(userId);

        if (wallet.balance <= 0) {
            throw new Error(`Users wallet ${wallet.id} has insufficiant funds`);
        }

        const bikeData = {
            user_id: userId,
            scooter_id: bike.id,
            start_time: now,
            start_latitude: bike.latitude,
	        start_longitude: bike.longitude,
            start_zone_type: bike.current_zone_type,
        };

        await this.bikeService.createBikeInUse(bikeData);
        await this.bikeService.updateBikeStatus(bike.id, 40);

        return await this.bikeService.getBikeInUse(bike.id);
    }

    /**
     * Creates and returns current date and time in SQL datetime format.
     * @returns {string} Current date and time.
     */
    getDbDate() {
        const now = new Date();
        const isoFormatDate = now.toISOString();
        const datetimeFormat = isoFormatDate.replace("T", " ").split(".")[0];

        return datetimeFormat;
    }

    async setBikeStatus(bike, parkedOK) {
        let bikeStatus = parkedOK ? 10 : 20;

        bikeStatus = bike.battery > 20 ? bikeStatus : 50;

        await this.bikeService.updateBikeStatus(bike.id, bikeStatus);
    }

    /**
     * End a scooter rental trip and calculating final cost.
     *
     * @param {Object} data Trip data
     *
     * @returns {Array} Result from db update.
     */
    async endTrip(bikeId) {
        const bikeInUse = await this.bikeService.getBikeInUse(bikeId);
        const bike = await this.bikeService.getBikeById(bikeInUse.scooter_id);
        const parkedOk =
            bike.current_zone_type === "parking" ||
            bike.current_zone_type === "charging";
        const endTime = this.getDbDate();

        const totalCost = await this.pricingService.calculateTripCost(
            bike,
            bikeInUse,
            parkedOk,
            endTime
        );

        const result = await this.tripsModel.createTrip({
            user_id: bikeInUse.user_id,
            scooter_id: bikeInUse.scooter_id,
            cost: totalCost,
            start_latitude: bikeInUse.start_latitude,
            start_longitude: bikeInUse.start_longitude,
            start_zone_type: bikeInUse.start_zone_type,
            end_longitude: bike.longitude,
            end_latitude: bike.latitude,
            end_zone_type: bike.current_zone_type,
            start_time: bikeInUse.start_time,
            end_time: endTime,
        });

        if (!result?.affectedRows) {
            throw new Error("Could not end trip");
        }

        await this.walletsService.debit(bikeInUse.user_id, totalCost);
        await this.bikeService.deleteBikeInUse(bikeInUse.id);

        await this.setBikeStatus(bike, parkedOk);

        const newTrip = await this.getTripById(result.insertId);

        return newTrip;
    }
}
export { TripService };
export default new TripService();
