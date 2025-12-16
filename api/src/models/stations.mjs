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
        },

        /**
         * Retrieves all bikes currently in charging mode at a specific station.
         *
         * @param {number} stationId - The ID of the station.
         * @returns {Promise<Object>} An object containing the station ID,
         * the number of bikes, and a list of bike objects.
         */
        getBikesByStationId: async function getBikesByStationId(stationId) {
        // Hämtar alla cyklar som står i stationen
            const bikes = await db.select(
                'scooters',
                [
                    'id',
                    'status',
                    'battery',
                    'latitude',
                    'longitude',
                    'occupied',
                    'city_id',
                    'current_zone_type',
                    'current_zone_id'
                ],
                'current_zone_type = ? AND current_zone_id = ?',
                ['charging', stationId]
            );

            return {
                stationId,
                // antal cyklar
                bikeCount: bikes.length,
                // lista med alla cyklar
                bikes
            };
        }

    };

    return stations;
}
