import express from 'express';
import trips from "../models/trips.mjs";
import tripService from "../services/tripService.mjs";
import * as validation from "../middleware/validation/validationMiddleware.mjs";

const router = express.Router();

/**
 * Start a trip.
 * Request body needs:
 * ID for the user
 * ID for the bike
 * @returns {Array} an array with the trip object.
 */
router.post(`/`,
    validation.idBody,
    validation.checkValidationResult,
    async (req, res) => {
        try {
            const newTrip = await tripService.startTrip(req.body);

            return res.status(201).json(newTrip);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Could not create trip' });
        }
    });

/**
 * End a trip.
 * Request body needs:
 * id: id for the trip
 * userID: the users id
 * bikeID: the bikes id
 * location: Location when button clicked
 *  (to avoid race condition(?) if heartbeat not recent?) SKIPPA?
 * @returns {Array} an array with the trip object.
 */
router.put(`/:id`,
    validation.idParam,
    validation.checkValidationResult,
    async (req, res) => {
        console.log("get by ID");
        try {
            const endedTrip = await tripService.endTrip(req.params.id);

            return res.status(200).json(endedTrip);
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: `Could not end trip with id: ${req.params.id}`
            });
        }
    });

router.get(`/hej`,
    // validation.idParam,
    // validation.checkValidationResult,
    async (req, res) => {
        console.log("get");
        return res.status(200).json({yo: "hej"});
    });

/**
 * Returns all user trips
 */
router.get(`/user/:id`,
    validation.idParam,
    validation.checkValidationResult,
    async (req, res) => {
        console.log("get by User ID");
        try {
            const userList = await trips.getTransactionByUserId(req.params.id);

            return res.status(200).json(userList);
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: `Could not fetch trip for user ${req.params.id}`
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
        console.log("get by ID");
        try {
            const user = await trips.getTransactionById(req.params.id);

            return res.status(200).json(user);
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: `Could not fetch trip with id: ${req.params.id}`
            });
        }
    });



export default router;
