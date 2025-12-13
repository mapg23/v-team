import express from "express";
import createBikes from "../models/bikes.mjs";
import validateJsonBody from "../middleware/validateJsonBody.mjs";

export default function createBikeRouter(bikes = createBikes()) {
    const route = express.Router();

    // Sync bikes to simulator
    route.get(`/bikes/sync`, async (req, res) => {
        try {
            const bikesList = await bikes.getBikes();

            await fetch("http://bike:7071/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bikes: bikesList })
            });

            return res.status(200).json({ message: "Bikes sent to simulator" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to send bikes" });
        }
    });

    // Skapar cykel manuellt - Admin
    route.post("/bikes", validateJsonBody, async (req, res) => {
        try {
            const { status, battery, latitude, longitude, occupied, city_id } = req.body;

            const requiredFields = [
                status,
                battery,
                latitude,
                longitude,
                occupied,
                city_id
            ];

            if (requiredFields.some((field) => field == null)) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const result = await bikes.createBike({
                status,
                battery,
                latitude,
                longitude,
                occupied,
                city_id
            });

            return res.status(201).json({ id: Number(result.insertId) });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not create bike" });
        }
    });


    // Hämtar alla cyklar
    route.get(`/bikes`, async (req, res) => {
        try {
            const list = await bikes.getBikes();

            return res.status(200).json(list);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not fetch bikes" });
        }
    });

    // Hämtar cykel per ID
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

    // Uppdaterar cykel
    route.put(`/bikes/:id`, validateJsonBody, async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({ error: "Invalid bike id" });
            }

            const result = await bikes.updateBike(id, req.body);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Bike not found" });
            }

            return res.status(200).json({ message: "Bike updated" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not update bike" });
        }
    });

    // Tar bort cykel
    route.delete(`/bikes/:id`, async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({ error: "Invalid bike id" });
            }

            const result = await bikes.deleteBike(id);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Bike not found" });
            }

            return res.sendStatus(204);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not delete bike" });
        }
    });


    return route;
}
