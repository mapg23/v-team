import express from 'express';
import users from "../models/users.mjs";

const route = express.Router();

route.post(`/users`, async (req, res) => {
    try {
        // Returnerar db.insert-resultatet
        const result = await users.createUser(req.body);
        // Konverterar från BigInt till number
        const user = { id: Number(result.insertId), ...req.body };

        return res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Could create user' });
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
        const userList = await users.getUsers();

        return res.json(userList);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Could not fetch users' });
    }
});

route.put(`/users/:id`, async (req, res) => {
    try {
        await users.updateUser(req.params.id, req.body);
        // konverterar id till number
        const user = { id: Number(req.params.id), ...req.body };

        return res.json(user);
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
