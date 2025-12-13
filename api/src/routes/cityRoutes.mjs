import express from 'express';
import validateJsonBody from '../middleware/validateJsonBody.mjs';
import cityHelpers from '../helpers/validateCity.mjs';
import createCities from "../models/cities.mjs";
import createBikes from "../models/bikes.mjs";

export default function createCityRouter(cities = createCities(), bikes = createBikes()) {
    const route = express.Router();

    route.post(`/cities`, validateJsonBody, async (req, res) => {
        const name  = req.body.name;

        if (!name) {
            return res.status(400).json({ error: 'Name is missing' });
        }
        // Anropa en funktion som hämtar lat, lon via Nominatim.
        const location = await cityHelpers.getGeoCoordinates(name);

        if (!location) {
            return res.status(404).json({ error: 'City not found' });
        }

        const { latitude, longitude } = location;

        // Kolla om staden redan finns
        const existingCity = await cities.getCityByName(name);

        if (existingCity.length > 0) {
            return res.status(409).json({ error: 'City already exists' });
        }

        try {
            // Skapar staden i DB
            const result = await cities.createCity({ name, latitude, longitude });

            const newCity = await cities.getCityById(Number(result.insertId));

            return res.status(201).json(newCity);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Could not create city' });
        }
    });

    route.get(`/cities/:id`, async (req, res) => {
    const idError = cityHelpers.validateId(req.params.id);
    if (idError) return res.status(400).json({ error: idError });

    try {
        const city = await cities.getCityDetails(Number(req.params.id));
        if (!city) {
            return res.status(404).json({ error: 'City not found' });
        }

        // Konverterar id och counts till Number.
        city.id = Number(city.id);
        city.bike_count = Number(city.bike_count);
        city.station_count = Number(city.station_count);
        city.parking_count = Number(city.parking_count);

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

        // Namnvalidering
        if (!req.body.name || req.body.name.trim() === "") {
            return res.status(400).json({ error: "Name is missing" });
        }

        try {
            // Uppdaterar staden.
            await cities.updateCity(req.params.id, req.body);

            const updatedCity = await cities.getCityById(req.params.id);

            if (updatedCity.length === 0) {
                return res.status(404).json({ error: "City not found" });
            }

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

    route.get(`/cities/:id/bikes`, async (req, res) => {
        try {
            const cityId = Number(req.params.id);

            // Kollar att staden finns
            const city = await cities.getCityById(cityId);

            if (!city[0]) {
                return res.status(404).json({ error: "City not found" });
            }

            // Hämtar cyklar i staden
            const bikesList = await bikes.getBikesByCityId(cityId);

            return res.status(200).json(bikesList);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not fetch bikes for city" });
        }
    });

    route.get(`/cities/:id/bike/:bikeId`, async (req, res) => {
        try {
            const cityId = Number(req.params.id);
            const bikeId = Number(req.params.bikeId);

            // Kolla att staden finns
            const city = await cities.getCityById(cityId);

            if (!city[0]) {return res.status(404).json({ error: "City not found" });}

            // Hämta cykeln och kolla att den tillhör staden
            const bike = await bikes.getBikeById(bikeId);

            if (!bike[0] || bike[0].city_id !== cityId) {
                return res.status(404).json({ error: "Bike not found in this city" });
            }

            return res.status(200).json(bike[0]);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not fetch bike" });
        }
    });

    return route;
}
