import express from 'express';
import validateJsonBody from '../middleware/validateJsonBody.mjs';
import cityHelpers from '../helpers/validateCity.mjs';
import createCities from "../models/cities.mjs";
import createBikes from "../models/bikes.mjs";
import createStations from "../models/stations.mjs";
import createParkings from "../models/parkings.mjs";


export default function createCityRouter(
    cities = createCities(),
    bikes = createBikes(),
    stations = createStations(),
    parkings = createParkings()
) {
    const route = express.Router();

    /**
     * POST /cities
     * Creates a new city.
     *
     * Request Body:
     * {
     *   name: string
     * }
     *
     * Returns:
     * 201: city created successfully
     * 400: name is missing
     * 404: city not found via geocoding
     * 409: city already exists
     * 500: server error
     */
    route.post(`/cities`, validateJsonBody, async (req, res) => {
        const name  = req.body.name;

        if (!name) {
            return res.status(400).json({ error: 'Name is missing' });
        }
        // Anropar en funktion som hämtar lat, lon via Nominatim.
        const location = await cityHelpers.getGeoCoordinates(name);

        if (!location) {
            return res.status(404).json({ error: 'City not found' });
        }

        const { latitude, longitude } = location;

        // Kollar om staden redan finns
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

    /**
     * GET /cities/:id
     * Fetches details of a city by its ID, including counts of bikes,
     * stations, and parking zones.
     *
     * Returns:
     * 200: city details
     * 400: invalid city ID
     * 404: city not found
     * 500: server error
     */
    route.get(`/cities/:id`, async (req, res) => {
        const idError = cityHelpers.validateId(req.params.id);

        if (idError) {
            return res.status(400).json({ error: idError });
        }

        try {
            const city = await cities.getCityDetails(Number(req.params.id));

            if (!city) {
                return res.status(404).json({ error: 'City not found' });
            }

            // Konverterar id och counts till Number.
            city.id = Number(city.id);
            city.bikeCount = Number(city.bikeCount);
            city.stationCount = Number(city.stationCount);
            city.parkingCount = Number(city.parkingCount);

            return res.status(200).json(city);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Could not fetch city' });
        }
    });

    /**
     * GET /cities
     * Fetches all cities, or a specific city if a `name`
     * query parameter is provided.
     *
     * Query Parameters:
     *   name?: string - optional city name to filter by
     *
     * Returns:
     * 200: list of cities or single city
     * 500: server error
     */
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


    /**
     * PUT /cities/:id
     * Updates a city's name by its ID.
     *
     * Request Body:
     * {
     *   name: string
     * }
     *
     * Returns:
     * 200: city updated successfully
     * 400: invalid city ID or name missing
     * 404: city not found
     * 500: server error
     */
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

    /**
     * DELETE /cities/:id
     * Deletes a city by its ID.
     *
     * Returns:
     * 204: city deleted successfully
     * 400: invalid city ID
     * 500: server error
     */
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

    /**
     * GET /cities/:id/bikes
     * Fetches all bikes in a specific city by city ID.
     *
     * Returns:
     * 200: list of bikes
     * 404: city not found
     * 500: server error
     */
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

    /**
     * GET /cities/:id/stations
     * Fetches all stations in a specific city by city ID.
     *
     * Returns:
     * 200: list of stations
     * 400: invalid city ID
     * 404: city not found
     * 500: server error
     */
    route.get('/cities/:id/stations', async (req, res) => {
        try {
            const cityId = Number(req.params.id);

            if (isNaN(cityId)) {
                return res.status(400).json({ error: 'Invalid city id' });
            }

            const city = await cities.getCityById(cityId);

            if (!city[0]) {
                return res.status(404).json({ error: 'City not found' });
            }

            const stationsList = await stations.getStationsByCityId(cityId);

            return res.status(200).json(stationsList);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Could not fetch stations' });
        }
    });

    /**
     * GET /cities/:id/parkings
     * Fetches all parking zones in a specific city by city ID.
     *
     * Returns:
     * 200: list of parking zones
     * 400: invalid city ID
     * 404: city not found
     * 500: server error
     */
    route.get('/cities/:id/parkings', async (req, res) => {
        try {
            const cityId = Number(req.params.id);

            if (isNaN(cityId)) {
                return res.status(400).json({ error: 'Invalid city id' });
            }

            const city = await cities.getCityById(cityId);

            if (!city[0]) {
                return res.status(404).json({ error: 'City not found' });
            }

            const parkingsList = await parkings.getParkingsByCityId(cityId);

            return res.status(200).json(parkingsList);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Could not fetch parking zones' });
        }
    });

    /**
     * GET /cities/:id/bike/:bikeId
     * Fetches a specific bike in a specific city by city ID and bike ID.
     *
     * Returns:
     * 200: bike found
     * 404: city or bike not found
     * 500: server error
     */
    route.get(`/cities/:id/bike/:bikeId`, async (req, res) => {
        try {
            const cityId = Number(req.params.id);
            const bikeId = Number(req.params.bikeId);

            // Kollar att staden finns
            const city = await cities.getCityById(cityId);

            if (!city[0]) {
                return res.status(404).json({ error: "City not found" });
            }

            // Hämtar cykeln och kolla att den tillhör staden
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
