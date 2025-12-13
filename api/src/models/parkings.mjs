import dbDefault from "../database.mjs";

export default function createParkings(db = dbDefault) {
    const parkings = {
        /**
         * Get all parking zones.
         * @returns {Promise<Array>} List of parking zones.
         */
        getParkings: async function getParkings() {
            return await db.select(
                'parking_zones',
                ['id', 'city_id', 'max_lat', 'max_long', 'min_lat', 'min_long']
            );
        },

        /**
         * Create a new parking zone.
         * @param {Object} body - Parking zone data.
         * @returns {Promise<Array>} Insert result.
         */
        createParking: async function createParking(body) {
            return await db.insert('parking_zones', body);
        },

        /**
         * Get a parking zone by ID.
         * @param {number} id - Parking zone ID.
         * @returns {Promise<Array>} Parking zone record.
         */
        getParkingById: async function getParkingById(id) {
            return await db.select(
                'parking_zones',
                ['id', 'city_id', 'max_lat', 'max_long', 'min_lat', 'min_long'],
                'id = ?',
                [id]
            );
        },

        /**
         * Get all parking zones for a specific city.
         * @param {number} cityId - City ID.
         * @returns {Promise<Array>} List of parking zones.
         */
        getParkingsByCityId: async function getParkingsByCityId(cityId) {
            return await db.select(
                'parking_zones',
                ['id', 'city_id', 'max_lat', 'max_long', 'min_lat', 'min_long'],
                'city_id = ?',
                [cityId]
            );
        },

        /**
         * Update a parking zone.
         * @param {number} id - Parking zone ID.
         * @param {Object} data - Fields to update.
         * @returns {Promise<Array>} Update result.
         */
        updateParking: async function updateParking(id, data) {
            return await db.update('parking_zones', data, 'id = ?', [id]);
        },

        /**
         * Delete a parking zone by ID.
         * @param {number} id - Parking zone ID.
         * @returns {Promise<Array>} Delete result.
         */
        deleteParking: async function deleteParking(id) {
            return await db.remove('parking_zones', 'id = ?', [id]);
        }
    };

    return parkings;
}
