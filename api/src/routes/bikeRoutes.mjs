import express from "express";
import createBikes from "../models/bikes.mjs";
import validateJsonBody from "../middleware/validateJsonBody.mjs";


export default function createBikeRouter(io) {
    const route = express.Router();
    const bikes = createBikes();

    // Hämtar cyklar och skickar dem via socket.io till simulatorn
    route.get(`/bikes/sync`, async (req, res) => {
        try {
            const bikesList = await bikes.getBikes();

            // Skickar som event till simulatorn
            io.emit('syncBikes', bikesList);

            return res.status(200).json({ message: "Bikes sent to simulator" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to send bikes" });
        }
    });

    // Skapar en cykel manuellt - Admin
    route.post(`/bikes`, validateJsonBody, async (req, res) => {
        try {
            const { status, battery, location, occupied, city_id} = req.body;

            if (!city_id || !location) {
                return res.status(400).json({ error: "Missing cityId or location" });
            }

            const result = await bikes.createBike({
                status,
                battery,
                location,
                occupied,
                city_id
            });

            return res
                .status(201)
                .json({ message: "Bike created", id: Number(result.insertId) });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not create bike" });
        }
    });

    route.get(`/bikes`, async (req, res) => {
        try {
            const list = await bikes.getBikes();

            return res.status(200).json(list);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not fetch bikes" });
        }
    });

    route.get(`/bikes/:id`, async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({ error: "Invalid bike id" });
            }
            const bike = await bikes.getBikeById(id);

            if (!bike[0]) {
                return res.status(404).json({ error: "Bike not found" });
            }

            return res.status(200).json(bike[0]);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not fetch bike" });
        }
    });

    route.put(`/bikes/:id`, validateJsonBody, async (req, res) => {
        try {
            const id = Number(req.params.id);
            const data = req.body;

            const result = await bikes.updateBike(id, data);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Bike not found" });
            }

            return res.status(200).json({ message: "Bike updated" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not update bike" });
        }
    });

    route.delete(`/bikes/:id`, async (req, res) => {
        try {
            const id = Number(req.params.id);

            const result = await bikes.deleteBike(id);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Bike not found" });
            }

            return res.status(200).json({ message: "Bike deleted" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not delete bike" });
        }
    });

    return route;
}
