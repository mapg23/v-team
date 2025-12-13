import express from 'express';
import validateJsonBody from '../middleware/validateJsonBody.mjs';
import cityHelpers from '../helpers/validateCity.mjs';
import createStations from "../models/stations.mjs";
import createCities from "../models/cities.mjs";

export default function createStationRouter(
    stations = createStations(),
    cities = createCities()
) {
    const route = express.Router();

    route.post(`/stations`, validateJsonBody, async (req, res) => {
        const { city_id, name, latitude, longitude, capacity } = req.body;

        if (!city_id || !name || latitude == null || longitude == null || capacity == null) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        try {
            // Kontrollera att staden finns
            const city = await cities.getCityById(city_id);

            if (!city[0]) {
                return res.status(404).json({ error: "City not found" });
            }

            const result = await stations.createStation({
                city_id,
                name,
                latitude,
                longitude,
                capacity
            });

            const newStation = await stations.getStationById(result.insertId);

            return res.status(201).json(newStation);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not create station" });
        }
    });

    route.get(`/stations`, async (req, res) => {
        try {
            if (req.query.city_id) {
                const list = await stations.getStationsByCityId(Number(req.query.city_id));

                return res.status(200).json(list);
            }

            const stationList = await stations.getStations();

            return res.status(200).json(stationList);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not fetch stations" });
        }
    });

    route.get(`/stations/:id`, async (req, res) => {
        const idError = cityHelpers.validateId(req.params.id);

        if (idError) {
            return res.status(400).json({ error: idError });
        }

        try {
            const station = await stations.getStationById(req.params.id);

            if (!station[0]) {
                return res.status(404).json({ error: "Station not found" });
            }

            return res.status(200).json(station[0]);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not fetch station" });
        }
    });

    route.put(`/stations/:id`, validateJsonBody, async (req, res) => {
        const idError = cityHelpers.validateId(req.params.id);

        if (idError) {
            return res.status(400).json({ error: idError });
        }

        try {
            const result = await stations.updateStation(req.params.id, req.body);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Station not found" });
            }

            const updatedStation = await stations.getStationById(req.params.id);

            return res.status(200).json(updatedStation);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not update station" });
        }
    });

    route.delete(`/stations/:id`, async (req, res) => {
        const idError = cityHelpers.validateId(req.params.id);

        if (idError) {
            return res.status(400).json({ error: idError });
        }

        try {
            const result = await stations.deleteStation(req.params.id);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Station not found" });
            }

            return res.sendStatus(204);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not delete station" });
        }
    });

    return route;
}
