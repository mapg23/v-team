import express from 'express';
import validateJsonBody from '../middleware/validateJsonBody.mjs';
import cityHelpers from '../helpers/validateCity.mjs';
import createParkings from "../models/parkings.mjs";

export default function createParkingRouter(parkings = createParkings()) {
    const route = express.Router();

    /**
     * POST /parkings
     * Creates a new parking zone.
     *
     * Request Body:
     * {
     *   cityId: number,
     *   maxLat: number,
     *   maxLong: number,
     *   minLat: number,
     *   minLong: number
     * }
     *
     * Returns:
     * 201: parking zone created successfully
     * 400: missing required fields
     * 404: parking zone not found
     * 500: server error
     */
    route.post(`/parkings`, validateJsonBody, async (req, res) => {
        const { cityId, maxLat, maxLong, minLat, minLong } = req.body;

        const requiredFields = [cityId, maxLat, maxLong, minLat, minLong];

        if (requiredFields.some(field => field == null)) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        try {
            const result = await parkings.createParking({
                city_id: cityId,
                max_lat: maxLat,
                max_long: maxLong,
                min_lat: minLat,
                min_long: minLong
            });

            const newParkingArray = await parkings.getParkingById(result.insertId);

            if (!newParkingArray[0]) {
                return res.status(404).json({ error: "Parking zone not found" });
            }

            const parking = newParkingArray[0];

            return res.status(201).json({
                id: parking.id,
                cityId: parking.city_id,
                maxLat: Number(parking.max_lat),
                maxLong: Number(parking.max_long),
                minLat: Number(parking.min_lat),
                minLong: Number(parking.min_long)
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not create parking zone" });
        }
    });

    /**
     * GET /parkings
     * Fetches all parking zones, optionally filtered by cityId.
     *
     * Returns:
     * 200: list of parking zones
     * 500: server error
     */
    route.get(`/parkings`, async (req, res) => {
        try {
            let list;

            if (req.query.cityId) {
                list = await parkings.getParkingsByCityId(Number(req.query.cityId));
            } else {
                list = await parkings.getParkings();
            }

            const mappedList = list.map(p => ({
                id: p.id,
                cityId: p.city_id,
                maxLat: Number(p.max_lat),
                maxLong: Number(p.max_long),
                minLat: Number(p.min_lat),
                minLong: Number(p.min_long)
            }));

            return res.status(200).json(mappedList);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not fetch parking zones" });
        }
    });

    /**
     * GET /parkings/:id
     * Fetches a specific parking zone by its ID.
     *
     * Returns:
     * 200: parking zone found
     * 400: invalid parking ID
     * 404: parking zone not found
     * 500: server error
     */
    route.get(`/parkings/:id`, async (req, res) => {
        const idError = cityHelpers.validateId(req.params.id);

        if (idError) {
            return res.status(400).json({ error: idError });
        }

        try {
            const parkingArray = await parkings.getParkingById(req.params.id);

            if (!parkingArray[0]) {
                return res.status(404).json({ error: "Parking zone not found" });
            }

            const parking = parkingArray[0];

            return res.status(200).json({
                id: parking.id,
                cityId: parking.city_id,
                maxLat: Number(parking.max_lat),
                maxLong: Number(parking.max_long),
                minLat: Number(parking.min_lat),
                minLong: Number(parking.min_long)
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not fetch parking zone" });
        }
    });

    /**
     * PUT /parkings/:id
     * Updates a parking zone by its ID.
     *
     * Request Body:
     * {
     *   cityId: number,
     *   maxLat: number,
     *   maxLong: number,
     *   minLat: number,
     *   minLong: number
     * }
     *
     * Returns:
     * 200: parking zone updated successfully
     * 400: invalid parking ID
     * 404: parking zone not found
     * 500: server error
     */
    route.put(`/parkings/:id`, validateJsonBody, async (req, res) => {
        const idError = cityHelpers.validateId(req.params.id);

        if (idError) {
            return res.status(400).json({ error: idError });
        }

        const { cityId, maxLat, maxLong, minLat, minLong } = req.body;
        const updateData = {
            city_id: cityId,
            max_lat: maxLat,
            max_long: maxLong,
            min_lat: minLat,
            min_long: minLong
        };

        try {
            const result = await parkings.updateParking(req.params.id, updateData);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Parking zone not found" });
            }

            const updatedParkingArray = await parkings.getParkingById(req.params.id);

            if (!updatedParkingArray[0]) {
                return res.status(404).json({ error: "Parking zone not found" });
            }

            const parking = updatedParkingArray[0];

            return res.status(200).json({
                id: parking.id,
                cityId: parking.city_id,
                maxLat: Number(parking.max_lat),
                maxLong: Number(parking.max_long),
                minLat: Number(parking.min_lat),
                minLong: Number(parking.min_long)
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not update parking zone" });
        }
    });

    /**
     * DELETE /parkings/:id
     * Deletes a parking zone by its ID.
     *
     * Returns:
     * 204: parking zone deleted successfully
     * 400: invalid parking ID
     * 404: parking zone not found
     * 500: server error
     */
    route.delete(`/parkings/:id`, async (req, res) => {
        const idError = cityHelpers.validateId(req.params.id);

        if (idError) {
            return res.status(400).json({ error: idError });
        }

        try {
            const result = await parkings.deleteParking(req.params.id);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Parking zone not found" });
            }

            return res.sendStatus(204);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not delete parking zone" });
        }
    });

    /**
     * GET /parkings/:id/bikes
     * Fetches all bikes in a specific parking zone by parking ID.
     *
     * Returns:
     * 200: list of bikes
     * 400: invalid parking ID
     * 404: parking zone not found
     * 500: server error
     */
    route.get('/parkings/:id/bikes', async (req, res) => {
        try {
            const parkingId = Number(req.params.id);

            if (isNaN(parkingId)) {
                return res.status(400).json({ error: 'Invalid parking id' });
            }

            const parking = await parkings.getParkingById(parkingId);

            if (!parking[0]) {
                return res.status(404).json({ error: 'Parking zone not found' });
            }

            const result = await parkings.getBikesByParkingId(parkingId);

            return res.status(200).json(result);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Could not fetch bikes for parking zone' });
        }
    });


    return route;
}
