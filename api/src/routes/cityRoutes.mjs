import express from 'express';
import validateJsonBody from '../middleware/validateJsonBody.mjs';
import cityHelpers from '../helpers/validateCity.mjs';
import createCities from "../models/cities.mjs";

export default function createCityRouter(cities = createCities()) {
    const route = express.Router();

    route.post(`/cities`, validateJsonBody, async (req, res) => {
        const lat = req.body.latitude;
        const lon = req.body.longitude;

        // Fältspecifik validering
        const error = cityHelpers.validateBody(req.body);

        if (error) {
            return res.status(400).json({ error: error });
        }

        const formatError = cityHelpers.validateLatAndLong(lat, lon);

        if (formatError) {
            return res.status(400).json({ error: formatError });
        }

        try {
            const result = await cities.createCity(req.body);

            const newCity = await cities.getCityById(Number(result.insertId));

            return res.status(201).json(newCity);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Could not create city' });
        }
    });

    route.get(`/cities/:id`, async (req, res) => {
        const idError = cityHelpers.validateId(req.params.id);

        if (idError) {
            return res.status(400).json({ error: idError });
        }
        try {
            const city = await cities.getCityById(req.params.id);

            return res.status(200).json(city);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Could not fetch city' });
        }
    });

    route.get(`/cities`, async (req, res) => {
        try {
            if (req.query.name) {
                const city = await cities.getCityByName(req.query.name);

                return res.status(200).json(city);
            }

            const cityList = await cities.getCities();

            return res.status(200).json(cityList);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Could not fetch cities' });
        }
    });


    route.put(`/cities/:id`, validateJsonBody, async (req, res) => {
        const idError = cityHelpers.validateId(req.params.id);

        if (idError) {
            return res.status(400).json({ error: idError });
        }
        try {
            // Uppdaterar staden.
            await cities.updateCity(req.params.id, req.body);

            const updatedCity = await cities.getCityById(req.params.id);

            return res.status(200).json(updatedCity);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Could not update city' });
        }
    });

    route.delete(`/cities/:id`, async (req, res) => {
        const idError = cityHelpers.validateId(req.params.id);

        if (idError) {
            return res.status(400).json({ error: idError });
        }
        try {
            await cities.deleteCity(req.params.id);

            // No Content, skickar 204 och avslutar responsen.
            res.sendStatus(204);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Could not delete city' });
        }
    });
    return route;
}
