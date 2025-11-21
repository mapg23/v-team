import db from "../database.mjs";


const users = {
    /**
     * Create a new user in the database.
     *
     * @param {Object} body - An object containing the user data to insert.
     * @returns {Promise} The result from the database insert operation.
     */
    getUsers: async function getUsers() {
        const users = await db.select('users', ['id', 'username', 'email']);

        return users;
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
        return await db.select(
            'users',
            ['id', 'username', 'email'],
            'id = ?',
            [id]
        );
    },

    /**
     * Update a user in the database by ID.
     *
     * @param {number} id - The ID of the user to update.
     * @param {Object} data - An object containing the fields to update.
     * @returns {Promise} The result of the database update operation.
     */
    updateUser: async function updateUser(id, data) {
        return await db.update('users', data, 'id = ?', [id]);
    },

    /**
     * Delete a user from the database by ID.
     *
     * @param {number} id - The ID of the user to delete.
     * @returns {Promise} The result of the database delete operation.
     */
    deleteUser: async function deleteUser(id) {
        return await db.remove('users', 'id = ?', [id]);
    }
};


export default users;
