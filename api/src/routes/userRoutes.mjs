import express from 'express';
import validateJsonBody from '../middleware/validateJsonBody.mjs';
import helpers from '../helpers/validateUser.mjs';
import createUsers from "../models/users.mjs";

export default function createUserRouter(users = createUsers()) {
    const route = express.Router();

    /**
     * POST /users
     * Creates a new user.
     *
     * Request Body:
     * {
     *   username: string,
     *   email: string,
     *   password: string
     * }
     *
     * Returns:
     * 201: user created successfully
     * 400: validation error (missing fields or invalid email)
     * 500: server error
     */
    route.post(`/users`, validateJsonBody, async (req, res) => {
        // Fältspecifik validering
        const error = helpers.validateBody(req.body);

        if (error) {
            return res.status(400).json({ error: error });
        }

        const emailError = helpers.validateEmailFormat(req.body.email);

        if (emailError) {
            return res.status(400).json({ error: emailError });
        }

        try {
            const result = await users.createUser(req.body);

            const newUser = await users.getUserById(Number(result.insertId));

            return res.status(201).json(newUser);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Could not create user' });
        }
    });

    /**
     * GET /users/:id
     * Fetches a user by their ID.
     *
     * Parameters:
     * id: number, the ID of the user to fetch.
     *
     * Returns:
     * 200: user found
     * 400: invalid user ID
     * 500: server error
     */
    route.get(`/users/:id`, async (req, res) => {
        const idError = helpers.validateId(req.params.id);

        if (idError) {
            return res.status(400).json({ error: idError });
        }
        try {
            const user = await users.getUserById(req.params.id);

            return res.status(200).json(user);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Could not fetch user' });
        }
    });

    /**
     * GET /users
     * Fetches all users with pagination, or a single user if `email` query parameter is provided.
     *
     * Query Parameters:
     * page?: number - optional, default 1
     * limit?: number - optional, default 50
     * email?: string - optional email to filter user by
     *
     * Returns:
     * 200: {
     *   page: number,
     *   limit: number,
     *   total: number,
     *   users: Array of user objects
     *  }
     *
     * 400: invalid email format
     * 500: server error
     */

    route.get(`/users`, async (req, res) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 50;
            const offset = (page - 1) * limit;

            if (req.query.email) {
                const invalidEmail = helpers.validateEmailSearch(req.query.email);

                if (invalidEmail) {return res.status(400).json({ error: invalidEmail });}

                const user = await users.getUserByEmail(req.query.email);

                return res.status(200).json(user);
            }

            const userList = await users.getUsers({ limit, offset });
            const total = await users.countUsers();

            return res.status(200).json({
                page,
                limit,
                total,
                users: userList
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Could not fetch users' });
        }
    });


    /**
     * PUT /users/:id
     * Updates a user by ID.
     *
     * Request Body:
     * {
     *   username?: string
     *   email?: string,
     *   password?: string,
     * }
     *
     * Returns:
     * 200: updated user
     * 400: invalid user ID
     * 500: server error
     */
    route.put(`/users/:id`, validateJsonBody, async (req, res) => {
        const idError = helpers.validateId(req.params.id);

        if (idError) {
            return res.status(400).json({ error: idError });
        }

        try {
        // Uppdaterar användaren
            await users.updateUser(req.params.id, req.body);

            const updatedUser = await users.getUserById(req.params.id);

            return res.status(200).json(updatedUser);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Could not update user' });
        }
    });

    /**
     * PATCH /users/:id
     * Partially updates a user's details by ID.
     *
     * Request Body:
     * {
     *   username?: string,
     *   email?: string,
     *   password?: string
     * }
     *
     * Returns:
     * 200: updated user
     * 400: invalid user ID
     * 500: server error
     */
    route.patch(`/users/:id`, validateJsonBody, async (req, res) => {
        const idError = helpers.validateId(req.params.id);

        if (idError) {
            return res.status(400).json({ error: idError });
        }
        try {
            await users.updateUser(req.params.id, req.body);

            const updatedUser = await users.getUserById(req.params.id);

            return res.status(200).json(updatedUser);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Could not update user' });
        }
    });

    /**
     * DELETE /users/:id
     * Deletes a user by ID.
     *
     * Returns:
     * 204: user deleted successfully
     * 400: invalid user ID
     * 500: server error
     */
    route.delete(`/users/:id`, async (req, res) => {
        const idError = helpers.validateId(req.params.id);

        if (idError) {
            return res.status(400).json({ error: idError });
        }
        try {
            await users.deleteUser(req.params.id);

            // No Content, skickar 204 och avslutar responsen.
            res.sendStatus(204);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Could not delete user' });
        }
    });
    return route;
}
