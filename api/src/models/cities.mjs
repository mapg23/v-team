import dbDefault from "../database.mjs";

export default function createCities(db = dbDefault) {
    const cities = {
        /**
         * Create a new city in the database.
         *
         * @param {Object} body - An object containing the city data to insert.
         * @returns {Promise} The result from the database insert operation.
         */
        getCities: async function getCities() {
            const cities = await db.select('cities', ['id', 'name', 'location']);

            return cities;
        },
        /**
         * Create a new city in the database.
         *
         * @param {Object} body - City data to insert.
         * @returns {Promise} Result of the insert operation.
         */
        createCity: async function createCity(body) {
            return await db.insert('cities', body);
        },

        /**
         * Fetch a single city by ID.
         *
         * @param {number} id - ID of the city.
         * @returns {Promise} City record if found.
         */
        getCityById: async function getCityById(id) {
            return await db.select(
                'cities',
                ['id', 'name', 'location'],
                'id = ?',
                [id]
            );
        },

        /**
         * Fetch a single city by location.
         *
         * @param {string} location - The location of the city.
         * @returns {Promise} City location if found.
         */
        getCityByLocation: async function getCityByLocation(location) {
            return await db.select(
                'cities',
                ['id', 'name', 'location'],
                'location = ?',
                [location]
            );
        },

        /**
         * Update a city in the database by ID.
         *
         * @param {number} id - The ID of the city to update.
         * @param {Object} data - An object containing the fields to update.
         * @returns {Promise} The result of the database update operation.
         */
        updateCity: async function updateCity(id, data) {
            return await db.update('cities', data, 'id = ?', [id]);
        },

        /**
         * Delete a city from the database by ID.
         *
         * @param {number} id - The ID of the city to delete.
         * @returns {Promise} The result of the database delete operation.
         */
        deleteCity: async function deleteCity(id) {
            return await db.remove('cities', 'id = ?', [id]);
        }
    };

    return cities;
}
