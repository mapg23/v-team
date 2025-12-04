/**
 * A module that contain helper function for users.
 */

const helpers = {
    /**
     * Validates user input for registration.
     *
     * Checks that required fields (name, email, password) are present
     * and that the email has a valid format.
     *
     * @param {Object} body - The request body containing user data.
     * @returns {string|null} Returns an error message
     * if validation fails, otherwise null.
     */

    validateBody: function validateBody(body) {
        const { username, email, password } = body;

        if (!username || !email || !password) {
            return "Missing required fields";
        }

        // Om allt ok
        return null;
    },

    /**
     * Validates email format during registration.
     *
     * Checks if the email has a valid format.
     *
     * @param {string} email - The email entered by the user.
     * @returns {string|null} Returns an error message
     * if validation fails, otherwise null.
     */
    validateEmailFormat: function validateEmailFormat(email) {
    // Enkel email formatkontroll
        const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailFormat.test(email)) {
            return "Invalid email format";
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

    /**
     * Validates email entered by the user when searching by email.
     *
     * Checks if email is present and in a valid format.
     *
     * @param {string} email - The email entered by the user.
     * @returns {string|null} Returns an error message if validation fails, otherwise null.
     */
    validateEmailSearch: function validateEmailSearch(email) {
        const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || email.trim() === "" || !emailFormat.test(email.trim())) {
            return "Email is missing or has wrong format";
        }
        return null;
    }

};

export default helpers;
