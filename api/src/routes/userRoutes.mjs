import express from 'express';
import validateJsonBody from '../middleware/validateJsonBody.mjs';
import createUsers from "../models/users.mjs";

export default function createUserRouter(users = createUsers()) {
    const route = express.Router();

    route.post(`/users`, validateJsonBody, async (req, res) => {
        try {
            const result = await users.createUser(req.body);

            const newUser = await users.getUserById(Number(result.insertId));

            return res.status(201).json(newUser);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Could not create user' });
        }
    });

    route.get(`/users/:id`, async (req, res) => {
        try {
            const user = await users.getUserById(req.params.id);

            return res.status(200).json(user);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Could not fetch user' });
        }
    });

    route.get(`/users`, async (req, res) => {
        try {
            if (req.query.email) {
                const user = await users.getUserByEmail(req.query.email);

                return res.status(200).json(user);
            }

            const userList = await users.getUsers();

            return res.status(200).json(userList);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Could not fetch users' });
        }
    });

    route.put(`/users/:id`, validateJsonBody, async (req, res) => {
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

    // Uppdaterar en del av användarens uppgifter.
    route.patch(`/users/:id`, validateJsonBody, async (req, res) => {
        try {
            await users.updateUser(req.params.id, req.body);

            const updatedUser = await users.getUserById(req.params.id);

            return res.status(200).json(updatedUser);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Could not update user' });
        }
    });

    route.delete(`/users/:id`, async (req, res) => {
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
