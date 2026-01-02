import createBikes from "../models/bikes.mjs";

class BikeService {
    constructor(bikesModel = createBikes()) {
        this.bikesModel = bikesModel;
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
     * Update a bike.
     *
     * @param {string} bikeId A numeric value in string format.
     * @param {object} data The data tu update.
     * @returns {Object} bike The bike with the argumented id.
     */
    async updateBike(bikeId, data) {
        await this.bikesModel.getBikeById(bikeId);
        const res = await this.bikesModel.updateBike(bikeId, data);

        if (res.warningStatus > 0) {
            throw new Error(`Bike with id: ${bikeId} Could not be updated`);
        }
        const bike = this.getBikeById(bikeId);

        return bike;
    }
}

const bikeService = new BikeService;

export default bikeService;
