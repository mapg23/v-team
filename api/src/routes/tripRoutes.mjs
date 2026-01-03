import express from 'express';
import trips from "../models/trips.mjs";
import tripService from "../services/tripService.mjs";
import bikesInUseModel from '../models/bikesInUse.mjs';
import * as validation from "../middleware/validation/validationMiddleware.mjs";

const router = express.Router();

/**
 * Start a trip.
 * Request body needs:
 * ID for the user
 * ID for the bike
 * @returns {Array} an array with the bike-in-use object.
 */
router.post(`/`,
    validation.createTrip,
    validation.checkValidationResult,
    async (req, res) => {
        try {
            const newTrip = await tripService.startTrip(req.body);

            return res.status(201).json(newTrip);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Could not create trip', message: err.message });
        }
    });

/**
 * End a trip.
 * Request body needs:
 * id: id for the bike used
 * @returns {Array} an array with the trip object.
 */
router.post(`/:id`,
    validation.idParam,
    validation.checkValidationResult,
    async (req, res) => {
        try {
            const endedTrip = await tripService.endTrip(req.params.id);

            if (endedTrip.length === 0) {
                return res.status(404).json({ error: "Trip not found" });
            }

            return res.status(200).json(endedTrip);
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: `Could not end trip for bike with id: ${req.params.id}`,
                message: err.message
            });
        }
    });

router.delete(`/:id`,
    validation.idParam,
    validation.checkValidationResult,
    async (req, res) => {
        try {
            const result = await trips.deleteTrip(req.params.id);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: `Could not find trip with id: ${req.params.id}`
                });
            }

            return res.sendStatus(204);
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: `Could not delete trip with id: ${req.params.id}`,
                message: err.message
            });
        }
    });

/**
 * Returns all started trips, all bikes in use.
 */
router.get(`/bikes-in-use`,
    async (req, res) => {
        try {
            const startedTripsList = await bikesInUseModel.getBikesInUse();

            return res.status(200).json(startedTripsList);
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: `Could not fetch all bikes in use`,
                message: err.message
            });
        }
    });

/**
 * Returns all user trips
 */
router.get(`/`,
    async (req, res) => {
        try {
            const tripList = await trips.getTrips();

            return res.status(200).json(tripList);
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: `Could not fetch trips for user ${req.params.id}`,
                message: err.message
            });
        }
    });

/**
 * Returns a trip by trip id.
 */
router.get(`/user/:id`,
    validation.idParam,
    validation.checkValidationResult,
    async (req, res) => {
        try {
            const userList = await trips.getTripsByUserId(req.params.id);

            return res.status(200).json(userList);
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: `Could not fetch trips for user ${req.params.id}`,
                message: err.message
            });
        }
    });

/**
 * Returns a trip specified by ID
 */
router.get(`/:id`,
    validation.idParam,
    validation.checkValidationResult,
    async (req, res) => {
        try {
            const trip = await trips.getTripById(req.params.id);

            return res.status(200).json(trip);
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: `Could not fetch trip with id: ${req.params.id}`,
                message: err.message
            });
        }
    });



export default router;
