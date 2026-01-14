import dbDefault from "../database.mjs";

export default function createUsers(db = dbDefault) {
    const users = {

        /**
         * Get users with pagination.
         * @param {number} limit=50 - Max number of bikes to return.
         * @param {number} offset=0 - Number of bikes to skip.
         * @returns {Promise<Array>} List of users.
         */
        getUsers: async function getUsers({ limit = 50, offset = 0 } = {}) {
            const users = await db.select('users',
                ['id', 'username', 'email'],
                null,
                [],
                limit,
                offset
            );

            return users;
        },

        /**
         * Count total number of users.
         * @returns {Promise<number>} Total number of users in the database.
         */
        countUsers: async function countUsers() {
            const result = await db.select(
                'users',
                ['COUNT(*) as total']
            );

            return Number(result[0].total);
        },
        /**
         * Create a new user in the database.
         *
         * @param {Object} body - User data to insert.
         * @returns {Promise<Array>} Insert result.
         */
        createUser: async function createUser(body) {
            return await db.insert('users', body);
        },

        /**
         * Get a single user by ID.
         *
         * @param {number} id - ID of the user.
         * @returns {Promise<Array>} User record if found.
         */
        getUserById: async function getUserById(id) {
            return await db.select(
                'users',
                ['id', 'username', 'email', 'role'],
                'id = ?',
                [id]
            );
        },

        /**
         * Get a single user by email.
         *
         * @param {string} email - The email of the user.
         * @returns {Promise<Array>} User record if found.
         */
        getUserByEmail: async function getUserByEmail(email) {
            return await db.select(
                'users',
                ['*'],
                'email = ?',
                [email]
            );
        },

        /**
         * Update a user in the database by ID.
         *
         * @param {number} id - The ID of the user to update.
         * @param {Object} data - An object containing the fields to update.
         * @returns {Promise<Array>} The result of the database update operation.
         */
        updateUser: async function updateUser(id, data) {
            return await db.update('users', data, 'id = ?', [id]);
        },

        /**
         * Delete a user from the database by ID.
         *
         * @param {number} id - The ID of the user to delete.
         * @returns {Promise<Array>} The result of the database delete operation.
         */
        deleteUser: async function deleteUser(id) {
            return await db.remove('users', 'id = ?', [id]);
        }
    };

    return users;
}
