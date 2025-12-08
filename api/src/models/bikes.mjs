import dbDefault from "../database.mjs";

export default function createBikes(db = dbDefault) {
    const bikes = {
        /**
         * Get all bikes.
         * @returns {Promise<Array>} List of bikes.
         */
        getBikes: async function getBikes() {
            return await db.select(
                'scooters',
                ['id', 'status', 'battery', 'location', 'occupied', 'city_id']
            );
        },

        /**
         * Create a new bike.
         * @param {Object} body - Bike data.
         * @returns {Promise<Array>} Insert result.
         */
        createBike: async function createBike(body) {
            return await db.insert('scooters', body);
        },

        /**
         * Get a bike by ID.
         *
         * @param {number} id - Bike ID.
         * @returns {Promise<Array>} Bike record.
         */
        getBikeById: async function getBikeById(id) {
            return await db.select(
                'scooters',
                ['id', 'status', 'battery', 'location', 'occupied', 'city_id'],
                'id = ?',
                [id]
            );
        },

        /**
         * Get all bikes in a specific city.
         *
         * @param {number} cityId - The city's ID.
         * @returns {Promise<Array>} List of bikes.
         */
        getBikesByCityId: async function getBikesByCityId(cityId) {
            return await db.select(
                'scooters',
                ['id', 'status', 'battery', 'location', 'occupied', 'city_id'],
                'city_id = ?',
                [cityId]
            );
        },

        /**
         * Update a bike.
         *
         * @param {number} id - Bike ID.
         * @param {Object} data - Fields to update.
         * @returns {Promise<Array>} Update result.
         */
        updateBike: async function updateBike(id, data) {
            return await db.update('scooters', data, 'id = ?', [id]);
        },

        /**
         * Delete a bike.
         *
         * @param {number} id - Bike ID.
         * @returns {Promise<Array>} Delete result.
         */
        deleteBike: async function deleteBike(id) {
            return await db.remove('scooters', 'id = ?', [id]);
        }
    };

    return bikes;
}
