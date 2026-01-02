import db from "../database.mjs";

const bikesInUse = {
    /**
     * Get all bikes.
     * @returns {Promise<Array>} List of bikes in use.
     */
    getBikesInUse: async function getBikes() {
        return await db.select('scooter_in_use');
    },

    /**
     * Create a new bike.
     * @param {Object} body - Bike data.
     * @returns {Promise<Array>} Insert result.
     */
    createBikeInUse: async function createBikeInUse(body) {
        return await db.insert('scooter_in_use', body);
    },

    /**
     * Get a bikeInUse by bike ID.
     *
     * @param {number} bikeId - Bike ID.
     * @returns {Promise<Array>} BikeInUse record.
     */
    getBikeInUseByBikeId: async function getBikeInUseByBikeId(bikeId) {
        return await db.select('scooter_in_use', "*", 'scooter_id = ?', [bikeId]);
    },

    /**
     * Get a bikeInUse by user ID.
     *
     * @param {number} userId - User ID.
     * @returns {Promise<Array>} BikeInUse record.
     */
    getBikeInUseByUserId: async function getBikeInUseByUserId(userId) {
        return await db.select('scooter_in_use', "*", 'user_id = ?', [userId]);
    },

    /**
     * Get a bikeInUse by user ID.
     *
     * @param {number} userId - User ID.
     * @returns {Promise<Array>} BikeInUse record.
     */
    getBikeInUseById: async function getBikeInUseById(id) {
        return await db.select('scooter_in_use', "*", 'id = ?', [id]);
    },

    /**
     * Update a bikeInUse.
     *
     * @param {number} id - BikeInUse ID.
     * @param {Object} data - Fields to update.
     * @returns {Promise<Array>} Update result.
     */
    updateBikeInUse: async function updateBikeInUse(id, data) {
        return await db.update('scooter_in_use', data, 'id = ?', [id]);
    },

    /**
     * Delete a bike.
     *
     * @param {number} id - BikeInUse ID.
     * @returns {Promise<Array>} Delete result.
     */
    deleteBikeInUse: async function deleteBikeInUse(id) {
        return await db.remove('scooter_in_use', 'id = ?', [id]);
    },

};

export default bikesInUse;
