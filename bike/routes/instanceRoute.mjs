"use strict";
import express from "express";

import { callWorker } from "../src/Worker.mjs";

const router = express.Router();

/**
 * GET /heatbeat
 * Used to call heartbeat.
 */
router.get('/heartbeat', async (req, res) => {
    try {
        const response = await callWorker('heartbeat');

        res.json(response);
    } catch (error) {
        console.error(error);
    }
});

/**
 * GET /setRoute
 * Route to set a pre-defined route
 */
router.post('/setRoute', async (req, res) => {
    let cordinates = req.body.cordinates || null;

    try {
        const response = await callWorker('setRoute', cordinates);

        res.json(response);
    } catch (error) {
        console.error(error);
    }
});

/**
 * GET /start
 * Route to start bikes and generate new ones.
 * Dosent use the database or api.
 */
router.get('/start', async (req, res) => {
    try {
        const response = await callWorker('start-job');

        console.log(response);
        res.json({
            ok: true,
            msg: 'started-job',
            bikes: response
        });
    } catch (error) {
        console.error(error);
    }
});

/**
 * POST /start
 * req.body.bikes = Array of bikes
 * Route used to load bikes from database.
 */
router.post('/start', async (req, res) => {
    try {
        let bikes = req.body.bikes;
        const response = await callWorker('start-job-memory', bikes);

        res.json({
            ok: true,
            msg: 'started-job-memory',
            res: response
        });
    } catch (error) {
        console.error(error);
    }
});

/**
 * GET /end
 * Route used to end the simulation.
 */
router.get('/end', async (req, res) => {
    try {
        const response = await callWorker('end-job');

        res.json(response);
    } catch (error) {
        console.error(error);
    }
});


export default router;
