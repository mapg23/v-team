import dbDefault from "../database.mjs";

export default function createCities(db = dbDefault) {
    const cities = {
        /**
         * Get all cities.
         * @returns {Promise<Array>} List of cities.
         */
        getCities: async function getCities() {
            const cities = await db.select('cities', ['id', 'name', 'latitude', 'longitude']);

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
        getBikeCount: async function getBikeCount(cityId) {
            const result = await db.select(
                'scooters',
                ['COUNT(*) AS bike_count'],
                'city_id = ?',
                [cityId]
            );

            return result[0]?.bike_count || 0;
        },

        getCityDetails: async function getCityDetails(cityId) {
            if (cityId) {
                const cityArray = await cities.getCityById(cityId);

                if (!cityArray[0]) {
                    return null;
                }

                const city = cityArray[0];

                city.bike_count = await cities.getBikeCount(cityId);
                return city;
            } else {
                const citiesArray = await cities.getCities();

                for (const city of citiesArray) {
                    city.bike_count = await cities.getBikeCount(city.id);
                }
                return citiesArray;
            }
        }

    };

    return cities;
}
