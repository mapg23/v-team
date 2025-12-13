import express from 'express';
import validateJsonBody from '../middleware/validateJsonBody.mjs';
import cityHelpers from '../helpers/validateCity.mjs';
import createParkings from "../models/parkings.mjs";

export default function createParkingRouter(parkings = createParkings()) {
    const route = express.Router();

    route.post(`/parkings`, validateJsonBody, async (req, res) => {
        const { city_id, max_lat, max_long, min_lat, min_long } = req.body;

        if (
            !city_id ||
            max_lat == null ||
            max_long == null ||
            min_lat == null ||
            min_long == null
        ) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        try {
            const result = await parkings.createParking({
                city_id,
                max_lat,
                max_long,
                min_lat,
                min_long
            });

            const newParking = await parkings.getParkingById(result.insertId);

            return res.status(201).json(newParking);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not create parking zone" });
        }
    });

    route.get(`/parkings`, async (req, res) => {
        try {
            if (req.query.city_id) {
                const list = await parkings.getParkingsByCityId(Number(req.query.city_id));

                return res.status(200).json(list);
            }

            const parkingList = await parkings.getParkings();

            return res.status(200).json(parkingList);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not fetch parking zones" });
        }
    });

    route.get(`/parkings/:id`, async (req, res) => {
        const idError = cityHelpers.validateId(req.params.id);

        if (idError) {
            return res.status(400).json({ error: idError });
        }

        try {
            const parking = await parkings.getParkingById(req.params.id);

            if (!parking[0]) {
                return res.status(404).json({ error: "Parking zone not found" });
            }

            return res.status(200).json(parking[0]);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not fetch parking zone" });
        }
    });

    route.put(`/parkings/:id`, validateJsonBody, async (req, res) => {
        const idError = cityHelpers.validateId(req.params.id);

        if (idError) {
            return res.status(400).json({ error: idError });
        }

        try {
            const result = await parkings.updateParking(req.params.id, req.body);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Parking zone not found" });
            }

            const updatedParking = await parkings.getParkingById(req.params.id);

            return res.status(200).json(updatedParking);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not update parking zone" });
        }
    });

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

    return route;
}
