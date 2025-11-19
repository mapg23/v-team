import db from "../database.mjs";


const users = {
    /**
     * Create a new user in the database.
     *
     * @param {Object} body - An object containing the user data to insert.
     * @returns {Promise} The result from the database insert operation.
     */
    getUsers: async function getUsers() {
       return await db.select('users');
    },
    /**
     * Create a new user in the database.
     *
     * @param {Object} body - User data to insert.
     * @returns {Promise} Result of the insert operation.
     */
    createUser: async function createUser(body) {
        return await db.insert('users', body);
    },

    /**
     * Fetch a single user by ID.
     *
     * @param {number} id - ID of the user.
     * @returns {Promise} User record if found.
     */
    getUserById: async function getUserById(id) {
       return await db.select('users', '*', 'id = ?', [id]);
    }
}


export default users;
