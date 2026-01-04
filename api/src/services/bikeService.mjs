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
    async setBikeStatus(bike, parkedOK, occupied) {
        console.log("Set status with booleans", bike.id, parkedOK, occupied);
        let bikeStatus = parkedOK ? 10 : 20;

        bikeStatus = bike.battery > 20 ? bikeStatus : 50;

        await this.updateBikeStatus(bike.id, bikeStatus, occupied);
    }

    /**
     * Update a bikes status in api and device.
     * Check that bike exists, and updates it.
     * @param {string} bikeId A numeric value in string format.
     * @param {object} data The data tu update ex: {status: 30}
     * @returns {Object} res The result of the update.
     */
    async updateBikeStatus(bikeId, status, occupied) {
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

        console.log(bikeRes);

        if (bikeRes.status != 200) {
            throw new Error("Could not set new status in bike brain");
        }

        return apiRes;
    }

    /**
     * Starts a bike.
     * It creates a scooter_in_use row with who, hwere, when info.
     * Sets bike to occupied, status to 40 in database and on bike.
     * @param {object} bikeData An object With info about the bike about to start.
     * @returns bikeInUse - An object with information of the started bike.
     */
    async startBike(bikeData) {
        await this.createBikeInUse(bikeData);
        const bikeInUse = await this.findBikeInUseByBikeId(bikeData.scooter_id);


        console.log(bikeInUse);
        await this.updateBikeStatus(bikeInUse.scooter_id, 40, 1);

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
        let bikeIsOccupied = true;

        await this.removeBikeInUse(bikeInUseId);

        bikeIsOccupied = false;

        await this.setBikeStatus(bike, parkedOk, bikeIsOccupied);
    }

    // Can be called from bikeRoute and start/end trip.
    async updateBike(bikeId, data) {
        const zone = await this.locationService.determineZone(data.latitude, data.longitude);

        console.log(data);
        data.current_zone_type = zone.type,
        data.current_zone_id = zone.id;
        console.log(data);
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
