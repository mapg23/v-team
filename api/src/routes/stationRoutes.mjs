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
        const { cityId, name, latitude, longitude, capacity } = req.body;

        const requiredFields = [cityId, name, latitude, longitude, capacity];

        if (requiredFields.some(field => field == null)) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        try {
            const city = await cities.getCityById(cityId);

            if (!city[0]) {
                return res.status(404).json({ error: "City not found" });
            }

            const result = await stations.createStation({
                city_id: cityId,
                name,
                latitude,
                longitude,
                capacity
            });

            const newStationArray = await stations.getStationById(result.insertId);

            if (!newStationArray[0]) {return res.status(404).json({ error: "Station not found" });}

            const station = newStationArray[0];

            return res.status(201).json({
                id: station.id,
                cityId: station.city_id,
                name: station.name,
                latitude: Number(station.latitude),
                longitude: Number(station.longitude),
                capacity: station.capacity
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not create station" });
        }
    });


    route.get(`/stations`, async (req, res) => {
        try {
            let list;

            if (req.query.cityId) {
                list = await stations.getStationsByCityId(Number(req.query.cityId));
            } else {
                list = await stations.getStations();
            }

            const mappedList = list.map(st => ({
                id: st.id,
                cityId: st.city_id,
                name: st.name,
                latitude: Number(st.latitude),
                longitude: Number(st.longitude),
                capacity: st.capacity
            }));

            return res.status(200).json(mappedList);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not fetch stations" });
        }
    });

    route.get(`/stations/:id`, async (req, res) => {
        const idError = cityHelpers.validateId(req.params.id);

        if (idError) {return res.status(400).json({ error: idError });}

        try {
            const stationArray = await stations.getStationById(req.params.id);

            if (!stationArray[0]) {return res.status(404).json({ error: "Station not found" });}

            const station = stationArray[0];

            return res.status(200).json({
                id: station.id,
                cityId: station.city_id,
                name: station.name,
                latitude: Number(station.latitude),
                longitude: Number(station.longitude),
                capacity: station.capacity
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not fetch station" });
        }
    });

    route.put(`/stations/:id`, validateJsonBody, async (req, res) => {
        const idError = cityHelpers.validateId(req.params.id);

        if (idError) {return res.status(400).json({ error: idError });}

        try {
            const { cityId, name, latitude, longitude, capacity } = req.body;

            const updateData = {
                city_id: cityId,
                name,
                latitude,
                longitude,
                capacity
            };

            const result = await stations.updateStation(req.params.id, updateData);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Station not found" });
            }

            const updatedStationArray = await stations.getStationById(req.params.id);

            if (!updatedStationArray[0]) {
                return res.status(404).json({ error: "Station not found" });
            }

            const station = updatedStationArray[0];

            return res.status(200).json({
                id: station.id,
                cityId: station.city_id,
                name: station.name,
                latitude: Number(station.latitude),
                longitude: Number(station.longitude),
                capacity: station.capacity
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not update station" });
        }
    });

    route.delete(`/stations/:id`, async (req, res) => {
        const idError = cityHelpers.validateId(req.params.id);

        if (idError) {return res.status(400).json({ error: idError });}

        try {
            const result = await stations.deleteStation(req.params.id);

            if (result.affectedRows === 0) {return res.status(404).json({ error: "Station not found" });}

            return res.sendStatus(204);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not delete station" });
        }
    });

    return route;
}
