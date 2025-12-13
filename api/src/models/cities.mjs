import dbDefault from "../database.mjs";

export default function createCities(db = dbDefault) {
    const cities = {
        /**
         * Get all cities.
         * @returns {Promise<Array>} List of cities.
         */
        getCities: async function getCities() {
            const cities = await db.select('cities',
                ['id', 'name', 'latitude', 'longitude']);

            return cities;
        },

        /**
         * Create a new city.
         * @param {Object} body - City data.
         * @returns {Promise<Array>} Insert result.
         */
        createCity: async function createCity(body) {
            return await db.insert('cities', body);
        },

        /**
         * Get a city by ID.
         * @param {number} id - The ID of the city.
         * @returns {Promise<Array>} City record.
         */
        getCityById: async function getCityById(id) {
            return await db.select(
                'cities',
                ['id', 'name', 'latitude', 'longitude'],
                'id = ?',
                [id]
            );
        },

        /**
         * Get a single city by name.
         *
         * @param {string} name - The name of the city.
         * @returns {Promise<Array>} City record.
         */
        getCityByName: async function getCityByName(name) {
            return await db.select(
                'cities',
                ['id', 'name', 'latitude', 'longitude'],
                'name = ?',
                [name]
            );
        },

        /**
         * Update a city in the database.
         *
         * @param {number} id - The ID of the city to update.
         * @param {Object} data - An object containing the fields to update.
         * @returns {Promise<Array>} The result of the database update operation.
         */
        updateCity: async function updateCity(id, data) {
            return await db.update('cities', data, 'id = ?', [id]);
        },

        /**
         * Delete a city from the database by ID.
         *
         * @param {number} id - The ID of the city to delete.
         * @returns {Promise<Array>} The result of the database delete operation.
         */
        deleteCity: async function deleteCity(id) {
            return await db.remove('cities', 'id = ?', [id]);
        },

        /**
 * Get the number of rows in a specific table for a city.
 *
 * @async
 * @function getCount
 * @param {number} cityId - The ID of the city to count for.
 * @param {string} table - Table name (e.g. 'scooters', 'charging_zones').
 * @param {string} alias - Alias for the count (e.g. 'bike_count').
 * @returns {Promise<number>} The total count in the city.
 */
        getCount: async function getCount(cityId, table, alias) {
            const sql = `COUNT(*) AS ${alias}`;
            const result = await db.select(
                table,
                [sql],
                'city_id = ?',
                [cityId]
            );

            return result[0]?.[alias] || 0;
        },
        /**
 * Fetches detailed information for a city, including counts
 * of bikes, stations, and parking zones.
 *
 * @async
 * @function getCityDetails
 * @param {number} cityId - The ID of the city to fetch details for.
 * @returns {Promise<Object|null>} Returns a city object with additional fields:
 *   - bikeCount {number} Number of bikes in the city.
 *   - stationCount {number} Number of charging stations in the city.
 *   - parkingCount {number} Number of parking zones in the city.
 *   Returns null if the city does not exist.
 */

        getCityDetails: async function getCityDetails(cityId) {
            const cityArray = await cities.getCityById(cityId);

            if (!cityArray[0]) {
                return null;
            }

            const city = cityArray[0];

            const bikeCount = await cities.getCount(cityId, 'scooters', 'bike_count');
            const stationCount = await cities.getCount(cityId, 'charging_zones', 'station_count');
            const parkingCount = await cities.getCount(cityId, 'parking_zones', 'parking_count');

            return {
                ...city,
                bikeCount,
                stationCount,
                parkingCount
            };
        }

    };

    return cities;
}
