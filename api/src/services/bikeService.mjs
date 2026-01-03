import createBikes from "../models/bikes.mjs";
import BikesInUse from "../models/bikesInUse.mjs";
/**
 * @method getBikeById
 */
class BikeService {
    constructor(bikesModel = createBikes(), bikesInUse = BikesInUse) {
        this.bikesModel = bikesModel;
        this.bikesInUseModel = bikesInUse;
    }

    /**
     * Checks that a bike with the corresponding id exists and returns it.
     *
     * @param {string} bikeId A numeric value in string format.
     * @returns {Object} bike The bike with the argumented id.
     */
    async getBikeById(bikeId) {
        const bikeResult = await this.bikesModel.getBikeById(bikeId);
        const bike = bikeResult[0];

        if (!bike) {
            throw new Error(`Bike with id: ${bikeId} was not found`);
        }
        return bike;
    }

    /**
     * Update a bikes status in api and device.
     * Check that bike exists, and updates it.
     * @param {string} bikeId A numeric value in string format.
     * @param {object} data The data tu update ex: {status: 30}
     * @returns {Object} res The result of the update.
     */
    async updateBikeStatus(bikeId, status, occupied) {
        await this.getBikeById(bikeId);
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
     * A user starts a trip.
     * @param {object} bikeData An object With info about the bike about to start.
     * @returns bikeInUse - An object with information of the started bike.
     */
    async startBike(bikeData) {
        await this.createBikeInUse(bikeData);
        const bikeInUse = await this.getBikeInUse(bikeData.scooter_id);


        console.log(bikeInUse);
        await this.updateBikeStatus(bikeInUse.scooter_id, 40, 1);

        return bikeInUse;
    }

    stopBike() {
        return "";
    }

    async createBikeInUse(data) {
        const res = await this.bikesInUseModel.createBikeInUse(data);

        if (!res.affectedRows) {
            throw new Error("Ride could not be created");
        }
        return "OK";
    }

    async getBikeInUse(bikeId) {
        const res = await this.bikesInUseModel.getBikeInUseByBikeId(bikeId);
        const bikeInUse = res[0];

        if (!bikeInUse) {
            throw new Error(`Bike in use with id: ${bikeId} was not found`);
        }

        return bikeInUse;
    }

    async deleteBikeInUse(id) {
        const res = await this.bikesInUseModel.deleteBikeInUse(id);

        if (res.affectedRows < 1) {
            throw new Error(`Bike in use with id: ${id} was not stopped`);
        }

        return res;
    }
}

const bikeService = new BikeService;

export default bikeService;
