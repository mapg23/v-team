import express from "express";
import createBikes, { validateZone, getZoneCoordinates } from "../models/bikes.mjs";
import validateJsonBody from "../middleware/validateJsonBody.mjs";

export default function createBikeRouter(bikes = createBikes()) {
    const route = express.Router();

    /**
     * GET /bikes/sync
     * Fetches bikes from the database and sends them to the simulator.
     * Returns 200 on success, otherwise 500.
     */
    route.get(`/bikes/sync`, async (req, res) => {
        try {
            const bikesList = await bikes.getBikes();

            // Synkar bikes manuellt med simulatorn
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

    /**
     * POST /bikes
     * Creates a bike manually (admin only).
     *
     * Request Body:
     * {
     *   status: number,
     *   battery: number,
     *   latitude: number,
     *   longitude: number,
     *   occupied: number,
     *   cityId: number,
     *   currentZoneId?: number | null,
     *   currentZoneType?: string | null
     * }
     *
     * Returns:
     * 201: created bike
     * 400: missing or invalid fields
     * 500: server error
     */
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

    /**
     * PUT /bikes/:id
     * Updates a bike by ID.
     *
     * Request Body:
     * {
     *   status?: number,
     *   battery?: number,
     *   latitude?: number,
     *   longitude?: number,
     *   occupied?: number,
     *   cityId?: number,
     *   currentZoneId?: number | null,
     *   currentZoneType?: string | null
     * }
     *
     * Returns:
     * 200: updated bike
     * 400: invalid id or zone
     * 404: bike not found
     * 500: server error
     */
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


    /**
     * GET /bikes
     * Fetches all bikes.
     *
     * Returns:
     * 200: list of bikes
     * 500: server error
     */
    route.get(`/bikes`, async (req, res) => {
        try {
            const list = await bikes.getBikes();

            return res.status(200).json(list);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not fetch bikes" });
        }
    });

    /**
     * GET /bikes/:id
     * Fetches a bike by its ID.
     *
     * Returns:
     * 200: bike found
     * 400: invalid bike ID
     * 404: bike not found
     * 500: server error
     */
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

    /**
     * DELETE /bikes/:id
     * Deletes a bike by its ID.
     *
     * Returns:
     * 204: bike deleted successfully
     * 400: invalid bike ID
     * 404: bike not found
     * 500: server error
     */
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

    /**
     * PUT /bikes/:id/move
     * Moves a bike to a different zone.
     *
     * Request Body:
     * {
     *   zoneType: string, "charging" or "parking".
     *   zoneId: number, the id of the chosen zone.
     * }
     *
     * Returns:
     * 200: bike moved successfully
     * 400: invalid zone type, zone ID, or coordinates
     * 404: bike not found
     * 500: server error
     */
    route.put('/bikes/:id/move', validateJsonBody, async (req, res) => {
        const bikeId = Number(req.params.id);
        const { zoneType, zoneId } = req.body;
        const allowed = ['charging', 'parking'];

        if (!allowed.includes(zoneType)) {
            return res.status(400).json({ error: 'Invalid zone type' });
        }

        if (!zoneId || isNaN(zoneId)) {
            return res.status(400).json({ error: 'Invalid zone ID' });
        }

        try {
            // Hämta cykeln
            const bikeArray = await bikes.getBikeById(bikeId);

            if (!bikeArray[0]) {
                return res.status(404).json({ error: 'Bike not found' });
            }
            const bike = bikeArray[0];

            // Validera zonen mot cykelns city_id
            const isValidZone = await validateZone(zoneType, zoneId, bike.city_id, bikes.db);

            if (!isValidZone) {
                return res.status(400).json({ error: 'Zone does not exist for this city' });
            }

            // Hämta koordinater för zonen
            const coords = await getZoneCoordinates(zoneType, zoneId);

            if (!coords) {
                return res.status(400).json({ error: 'Zone coordinates not found' });
            }

            // Uppdatera cykeln med zon och koordinater
            const result = await bikes.updateBike(bikeId, {
                current_zone_type: zoneType,
                current_zone_id: zoneId,
                latitude: coords.latitude,
                longitude: coords.longitude
            });

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Bike not found' });
            }

            const updatedBike = await bikes.getBikeById(bikeId);

            return res.status(200).json(updatedBike[0]);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Could not move bike' });
        }
    });

    return route;
}
