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
        pricingService = PricingService,
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
    async findTripById(tripId) {
        const tripResult = await this.tripsModel.getTripById(tripId);
        const trip = tripResult[0];

        if (!trip) {
            throw new Error(`Trip with id: ${tripId} was not found`);
        }
        return trip;
    }

    /**
     * Start a rent of a bike by:
     * asserting the user has money, setting bikes status (occupied),
     * and creating a scooter in use row in db.
     * @param {Object} data An object containing customers user id and bikes id.
     * @returns {object} The inserted bike in use object.
     */
    async startTrip(data) {
        const userId = data.userId;
        const bikeId = data.bikeId;
        const now = this._getDbDate();

        const bike = await this.bikeService.findBikeById(bikeId);
        const wallet = await this.walletsService.findWalletByUserId(userId);

        if (wallet.balance <= 0) {
            throw new Error(`Users wallet ${wallet.id} has insufficiant funds`);
        }
        await this.bikeService.updateBikeZones(bikeId, bike);

        const bikeData = {
            user_id: userId,
            scooter_id: bike.id,
            start_time: now,
            start_latitude: bike.latitude,
	        start_longitude: bike.longitude,
            start_zone_type: bike.current_zone_type,
        };

        await this.bikeService.startBike(bikeData);

        return await this.bikeService.findBikeInUseByBikeId(bike.id);
    }

    /**
     * Creates and returns current date and time in SQL datetime format.
     * @returns {string} Current date and time.
     */
    _getDbDate() {
        const now = new Date();
        const isoFormatDate = now.toISOString();
        const datetimeFormat = isoFormatDate.replace("T", " ").split(".")[0];

        return datetimeFormat;
    }

    /**
     * End a scooter rental trip by:
     * updating bike status, removing it from scooters in use table,
     * getting the cost, creating a trip row in the table and charging the user.
     *
     * @param {Object} bikeId Bike id
     * @returns {Array} Result from db update.
     */
    async endTrip(bikeId) {
        const bikeInUse = await this.bikeService.findBikeInUseByBikeId(bikeId);
        const bike = await this.bikeService.findBikeById(bikeInUse.scooter_id);

        await this.bikeService.updateBikeZones(bikeId, bike);

        const parkedOk =
            bike.current_zone_type === "parking" ||
            bike.current_zone_type === "charging";
        const endTime = this._getDbDate();

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
        await this.bikeService.stopBike(bike, bikeInUse.id, parkedOk);

        const newTrip = await this.findTripById(result.insertId);

        return newTrip;
    }
}
export { TripService };
export default new TripService();
