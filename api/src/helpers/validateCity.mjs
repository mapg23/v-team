/**
 * A module that contain helper function for cities.
 */

const CityHelpers = {

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

        // Kontrollera precision mot DECIMAL(9,6)
        // 2 siffror före punkt, 4-6 efter för svenska städer.
        // för att förhindra att databasen får fel format.
        const regex = /^\d{2}\.\d{4,6}$/;

        // Konverterar till sträng för validering med regex.
        const latStr = String(lat);

        const lonStr = String(lon);

        if (!regex.test(latStr) || !regex.test(lonStr)) {
            return "Latitude or longitude have invalid format";
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
