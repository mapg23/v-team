import express from "express";
import createBikes, { validateZone } from "../models/bikes.mjs";
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
            const {
                status,
                battery,
                latitude,
                longitude,
                occupied,
                cityId,
                currentZoneId,
                currentZoneType
            } = req.body;

            const requiredFields = [
                status,
                battery,
                latitude,
                longitude,
                occupied,
                cityId
            ];

            if (requiredFields.some(field => field == null)) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const isValid = await validateZone(currentZoneType, currentZoneId, cityId, bikes.db);

            if (!isValid) {return res.status(400).json({ error: "Invalid zone" });}

            const result = await bikes.createBike({
                status,
                battery,
                latitude,
                longitude,
                occupied,
                city_id: cityId,
                current_zone_id: currentZoneId ?? null,
                current_zone_type: currentZoneType ?? null
            });

            const newBike = await bikes.getBikeById(result.insertId);

            return res.status(201).json(newBike[0]);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not create bike" });
        }
    });

    // Uppdaterar cykel
    route.put(`/bikes/:id`, validateJsonBody, async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({ error: "Invalid bike id" });
            }

            if ('currentZoneType' in req.body || 'currentZoneId' in req.body) {
                const bike = await bikes.getBikeById(id);
                // Använder befintlig city som default
                const cityId = req.body.cityId ?? bike[0].city_id;

                const isValid = await validateZone(
                    req.body.currentZoneType,
                    req.body.currentZoneId,
                    cityId,
                    bikes.db
                );

                if (!isValid) {
                    return res.status(400).json({ error: "Invalid zone" });
                }
            }

            const result = await bikes.updateBike(id, req.body);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Bike not found" });
            }

            const updatedBike = await bikes.getBikeById(id);

            return res.status(200).json(updatedBike[0]);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not update bike" });
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
