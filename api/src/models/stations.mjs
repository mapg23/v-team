import dbDefault from "../database.mjs";

export default function createStations(db = dbDefault) {
    const stations = {
        /**
         * Get all charging stations.
         * @returns {Promise<Array>} List of stations.
         */
        getStations: async function getStations() {
            return await db.select(
                'charging_zones',
                ['id', 'city_id', 'name', 'latitude', 'longitude', 'capacity']
            );
        },

        /**
         * Create a new charging station.
         * @param {Object} body - Station data.
         * @returns {Promise<Array>} Insert result.
         */
        createStation: async function createStation(body) {
            return await db.insert('charging_zones', body);
        },

        /**
         * Get a charging station by ID.
         * @param {number} id - Station ID.
         * @returns {Promise<Array>} Station record.
         */
        getStationById: async function getStationById(id) {
            return await db.select(
                'charging_zones',
                ['id', 'city_id', 'name', 'latitude', 'longitude', 'capacity'],
                'id = ?',
                [id]
            );
        },

        /**
         * Get all charging stations for a specific city.
         * @param {number} cityId - City ID.
         * @returns {Promise<Array>} List of stations.
         */
        getStationsByCityId: async function getStationsByCityId(cityId) {
            return await db.select(
                'charging_zones',
                ['id', 'city_id', 'name', 'latitude', 'longitude', 'capacity'],
                'city_id = ?',
                [cityId]
            );
        },

        /**
         * Update a charging station.
         * @param {number} id - Station ID.
         * @param {Object} data - Fields to update.
         * @returns {Promise<Array>} Update result.
         */
        updateStation: async function updateStation(id, data) {
            return await db.update('charging_zones', data, 'id = ?', [id]);
        },

        /**
         * Delete a charging station by ID.
         * @param {number} id - Station ID.
         * @returns {Promise<Array>} Delete result.
         */
        deleteStation: async function deleteStation(id) {
            return await db.remove('charging_zones', 'id = ?', [id]);
        }
    };

    return stations;
}
