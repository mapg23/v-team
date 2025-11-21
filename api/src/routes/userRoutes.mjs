import express from 'express';
import validateJsonBody from '../middleware/validateJsonBody.mjs';
import users from "../models/users.mjs";


const route = express.Router();

route.post(`/users`, validateJsonBody, async (req, res) => {
    try {
        const result = await users.createUser(req.body);

        const newUser = await users.getUserById(Number(result.insertId));

        return res.json(newUser);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Could not create user' });
    }
});

route.get(`/users/:id`, async (req, res) => {
    try {
        const user = await users.getUserById(req.params.id);

        return res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Could not fetch user' });
    }
});

route.get(`/users`, async (req, res) => {
    try {
        if (req.query.email) {
            const user = await users.getUserByEmail(req.query.email);

            return res.json(user);
        }

        const userList = await users.getUsers();

        return res.json(userList);
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

        return res.json(updatedUser);
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

        return res.json(updatedUser);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Could not update user' });
    }
});

route.delete(`/users/:id`, async (req, res) => {
    try {
        const user = await users.deleteUser(req.params.id);
        // No Content

        res.sendStatus(204);

        return res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Could not delete user' });
    }
});

export default route;
