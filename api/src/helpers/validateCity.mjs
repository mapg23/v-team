/**
 * A module that contain helper function for cities.
 */

const CityHelpers = {
    /**
     * Get coordinates (latitude and longitude) of a Swedish city.
     *
     * @param {string} name - City name.
     * @returns {Promise<Object|null>} Coordinates object or null if not found.
     */
    getGeoCoordinates: async function getGeoCoordinates(name) {
        const base = "https://nominatim.openstreetmap.org/search";

        const url = `${base}?city=${encodeURIComponent(name)}&countrycodes=se&format=json&limit=1`;

        // Anropar Nominatim för att hämta koordinater
        const response = await fetch(url);

        const data = await response.json();

        if (!data.length) {
            return null;
        }

        const { lat, lon } = data[0];

        return {
            latitude: parseFloat(lat),
            longitude: parseFloat(lon)
        };
    },

    /**
     * Validates id during id search.
     *
     * Checks if id is present and is a number.
     *
     * @param {number} id - The id entered by the user.
     * @returns {string|null} Returns an error message
     * if validation fails, otherwise null.
     */
    validateId: function validateId(id) {
        if (!id || (isNaN(Number(id)))) {
            return "Id is wrong";
        }
        return null;
    },

};

export default CityHelpers;
