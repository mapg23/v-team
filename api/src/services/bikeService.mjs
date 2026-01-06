import createBikes from "../models/bikes.mjs";
import BikesInUse from "../models/bikesInUse.mjs";
import LocationService from "./locationService.mjs";
/**
 * Handles logic for bikes.
 * Start and stop bike, set status.
 * @method getBikeById
 */
class BikeService {
    constructor(
        bikesModel = createBikes(),
        bikesInUse = BikesInUse,
        locationService = LocationService
    ) {
        this.bikesModel = bikesModel;
        this.bikesInUseModel = bikesInUse;
        this.locationService = locationService;
    }

    /**
     * Checks that a bike with the corresponding id exists and returns it.
     *
     * @param {string} bikeId A numeric value in string format.
     * @returns {Object} bike The bike with the argumented id.
     */
    async findBikeById(bikeId) {
        const bikeResult = await this.bikesModel.getBikeById(bikeId);
        const bike = bikeResult[0];

        if (!bike) {
            throw new Error(`Bike with id: ${bikeId} was not found`);
        }
        return bike;
    }

    /**
     * Sets status in relation to battery and parking
     * @param {object} bike The bike object.
     * @param {boolean} parkedOK True or false.
     * @param {boolean} occupied True or false.
     */
    async calculateAndUpdateBikeStatus(bike, parkedOK, occupied) {
        let bikeStatus = parkedOK ? 10 : 20;

        bikeStatus = bike.battery > 20 ? bikeStatus : 50;

        await this._updateBikeStatus(bike.id, bikeStatus, occupied);
    }

    /**
     * Update a bikes status in api and device.
     * Check that bike exists, and updates it.
     * @param {string} bikeId A numeric value in string format.
     * @param {object} data The data tu update ex: {status: 30}
     * @returns {Object} res The result of the update.
     */
    async _updateBikeStatus(bikeId, status, occupied) {
        await this.findBikeById(bikeId);
        const apiRes = await this.bikesModel.updateBike(
            bikeId,
            {
                status,
                occupied
            }
        );

        if (apiRes.warningStatus > 0) {
            throw new Error(`Bike with id: ${bikeId} Could not be updated`);
        }

        const bikeRes = await fetch('http://bike:7071/bike/setStatus',
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: bikeId,
                    status: status,
                }),
            });

        if (bikeRes.status != 200) {
            throw new Error("Could not set new status in bike brain");
        }

        return apiRes;
    }

    /**
     * Starts a bike.
     * It creates a scooter_in_use row with who, hwere, when info.
     * Sets bike to occupied in db - and status to 40 in database and on bike.
     * @param {object} bikeData An object With info about the bike about to start.
     * @returns bikeInUse - An object with information of the started bike.
     */
    async startBike(bikeData) {
        await this.createBikeInUse(bikeData);
        const bikeInUse = await this.findBikeInUseByBikeId(bikeData.scooter_id);
        const status = 40;
        const occupied = true;

        await this._updateBikeStatus(bikeInUse.scooter_id, status, occupied);

        return bikeInUse;
    }
    /**
     * Stops the bike by removing it from scooter_in_use
     * and updating status and setting occupied to false.
     *
     * @param {object} bike A bike object.
     * @param {string} bikeInUseId Bike in use id.
     * @param {bool} parkedOk Parking status.
     */
    async stopBike(bike, bikeInUseId, parkedOk) {
        let occupied = true;

        await this.removeBikeInUse(bikeInUseId);

        occupied = false;

        await this.calculateAndUpdateBikeStatus(bike, parkedOk, occupied);
    }

    // Can be called from bikeRoute and start/end trip.
    async updateBikeZone(bikeId, data) {
        const zone = await this.locationService.determineZone(data.latitude, data.longitude);

        if (!zone) {throw new Error("Could not determine bikes zone.");};

        data.current_zone_type = zone.type,
        data.current_zone_id = zone.id;

        const res = await this.bikesModel.updateBike(bikeId, data);

        return res;
    }


    async createBikeInUse(data) {
        const res = await this.bikesInUseModel.createBikeInUse(data);

        if (!res.affectedRows) {
            throw new Error("Ride could not be created");
        }
        return "OK";
    }

    async findBikeInUseByBikeId(bikeId) {
        const res = await this.bikesInUseModel.getBikeInUseByBikeId(bikeId);
        const bikeInUse = res[0];

        if (!bikeInUse) {
            throw new Error(`Bike in use with id: ${bikeId} was not found`);
        }

        return bikeInUse;
    }

    async removeBikeInUse(id) {
        const res = await this.bikesInUseModel.deleteBikeInUse(id);

        if (res.affectedRows < 1) {
            throw new Error(`Bike in use with id: ${id} was not stopped`);
        }

        return res;
    }
}

const bikeService = new BikeService;

export { BikeService };
export default bikeService;
