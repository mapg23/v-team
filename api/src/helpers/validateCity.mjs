/**
 * A module that contain helper function for cities.
 */

const CityHelpers = {
    /**
     * Validates city input for registration.
     *
     * Checks that required fields (name, latitud, longitud) are present
     * and that they have correct format.
     *
     * @param {Object} body - The request body containing city data.
     * @returns {string|null} Returns an error message
     * if validation fails, otherwise null.
     */

    validateBody: function validateBody(body) {
        const { name, latitude, longitude } = body;

        if (!name || !latitude || !longitude) {
            return "Missing required fields";
        }

        // Om allt ok
        return null;
    },

    /**
     * Validates latitude and longitude
     * format during city registration.
     *
     * @param {number} latitude - The latitude entered by the admin.
     * @param {number} longitude - The longitude entered by the admin.
     * @returns {string|null} Returns an error message
     * if validation fails, otherwise null.
     */
    validateLatAndLong: function validateLatAndLong(lat, lon) {
        if (isNaN(Number(lat)) || isNaN(Number(lon))) {
            return "Latitude and longitude must be numbers";
        }

        // Om allt ok
        return null;
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
